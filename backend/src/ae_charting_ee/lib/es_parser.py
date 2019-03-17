# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

import copy
import appenlight.lib.helpers as h
from appenlight.lib.utils import es_index_name_limiter
from collections import OrderedDict, defaultdict
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta, MO, SU
from ziggurat_foundations.models.services.user import UserService
from appenlight.validators import LogSearchSchema, TagListSchema, accepted_search_params


def build_filter_settings_from_chart_config(
    request, params=None, override_app_ids=None, resource_permissions=None
):
    """
    Builds list of normalized search terms for ES from chart config
    ensuring application list is restricted to only applications user
    has access to

    :param search_params (dictionary)
    :param override_app_ids - list of application id's to use instead of
    applications user normally has access to
    """
    params = copy.deepcopy(params)
    applications = []
    if not resource_permissions:
        resource_permissions = ["view"]

    if request and request.user:
        applications = UserService.resources_with_perms(
            request.user, resource_permissions, resource_types=["application"]
        )

    # CRITICAL - this ensures our resultset is limited to only the ones
    # user has view permissions
    all_possible_app_ids = set([app.resource_id for app in applications])

    # if override is preset we force permission for app to be present
    # this allows users to see dashboards and applications they would
    # normally not be able to

    if override_app_ids:
        all_possible_app_ids = set(override_app_ids)

    transformed_params = {}
    if params.get("resource"):
        transformed_params["resource"] = [params.pop("resource")]
    else:
        transformed_params["resource"] = []

    # filter may hold tags and namespace/level filters we need to handle
    # them differently and rewrite them accordingly to "query" string format

    for item in params.get("filters", []):
        i_name = item["name"]
        if not i_name or item["type"] in ["namespace", "level"]:
            i_name = item["type"]
        if i_name not in transformed_params:
            transformed_params[i_name] = []

        # special handling for tags (we need to handle operands for them)
        # vs normal objects, tags
        if item["type"] == "tag":
            transformed_params[i_name].append(
                {"value": item["value"], "op": item.get("op"), "name": i_name}
            )
        else:
            transformed_params[i_name].append(item["value"])

    additional_parms = dict(
        [(k, v) for k, v in params.items() if k in accepted_search_params and v]
    )
    transformed_params.update(additional_parms)
    schema = LogSearchSchema().bind(resources=all_possible_app_ids)
    tag_schema = TagListSchema()
    filter_settings = schema.deserialize(transformed_params)
    tag_list = []
    for k, filters in list(filter_settings.items()):
        if k in accepted_search_params:
            continue
        tag_list.extend(filters)
        filter_settings.pop(k, None)
    tags = tag_schema.deserialize(tag_list)
    filter_settings["tags"] = tags
    return filter_settings


def fix_dot(input):
    if input:
        return input.replace(".", "_")
    return input


def process_agg(request, agg, override_app_ids=None):
    """
    generates elasticsearch query json structure from chart configuration json
    object
    """
    # non-computed field path
    if not agg.get("computed"):
        # will be needed for label generation
        agg["field_name"] = fix_dot(agg["config"]["field"])
        agg["config"]["script"] = ""
        if agg["type"] in ["terms", "value_count", "cardinality"]:
            agg["config"]["field"] = "tags.{}.values".format(
                fix_dot(agg["config"]["field"])
            )
        elif agg["type"] in [
            "stats",
            "percentiles",
            "min",
            "max",
            "sum",
            "avg",
            "extended_stats",
            "range",
        ]:
            agg["config"]["field"] = "tags.%s.numeric_values" % fix_dot(
                agg["config"]["field"]
            )

    # computed field path
    else:
        agg["config"]["field"] = "tags.%s.numeric_values" % fix_dot(
            agg["config"]["field"]
        )
        agg["field_name"] = "computed"
        script = ""
        tmpl = " %s doc['tags.%s.numeric_values'].value"
        for field in agg["computed_fields"]:
            if field["op"] and field["op"] not in ["+", "-", "*", "/"]:
                raise Exception("invalid operand used")
            # this will detect if we are dealing with numerical value or not
            try:
                script += " %s %s" % (
                    field["op"] if field["op"] else "",
                    float(field["field"]),
                )
            except ValueError:
                script += tmpl % (field["op"] if field["op"] else "", field["field"])
        agg["config"]["script"] = script

    # now lets use the query parser to parse rules for this aggregation
    # and extract the "nested" part - since this is the only part that
    # will work
    agg_filters = build_filter_settings_from_chart_config(
        request, {"filters": agg.get("filters", [])}, override_app_ids=override_app_ids
    )

    sub_query = build_query(agg_filters)
    and_rules = sub_query["query"]["filtered"]["filter"]["and"]
    if not agg.get("computed"):
        compute_from = {"field": agg["config"]["field"]}
    else:
        compute_from = {"script": agg["config"]["script"], "lang": "expression"}
    if agg["config"].get("size"):
        compute_from["size"] = int(agg["config"]["size"])
    # work only on documents that have the tag
    and_rules.append({"exists": {"field": agg["config"]["field"]}})
    # base of aggregation
    sub_agg = {
        "filter": {"and": and_rules},
        "aggs": {"sub_agg": {agg["type"]: compute_from}},
    }
    if agg.get("deepAggEnabled"):
        agg_id, parsed_agg = process_agg(request, agg["deepAgg"])
        sub_agg["aggs"]["sub_agg"]["aggs"] = {"deep_agg": parsed_agg["aggs"]["sub_agg"]}

    return agg["id"], sub_agg


def build_query(filters):
    """
    Builds basic filtered query from filter definitions
    """
    resources = list(filters["resource"])
    query = {
        "query": {
            "filtered": {
                "filter": {"and": [{"terms": {"resource_id": list(resources)}}]}
            }
        }
    }

    start_date = filters.get("start_date")
    end_date = filters.get("end_date")
    filter_part = query["query"]["filtered"]["filter"]["and"]
    # transform few tags with same name and 'eq' operator to one tag
    # with a list of valid terms
    eq_values = defaultdict(list)
    for tag in filters.get("tags", []):

        tag_values = [v.lower() for v in tag["value"]]
        if tag["op"] in ["lt", "gt", "lte", "gte"]:
            key = "tags.%s.numeric_values" % fix_dot(tag["name"])
            filter_part.append({"range": {key: {tag["op"]: tag_values[0]}}})
        else:
            eq_values[tag["name"]].extend(tag_values)

    for k, v in eq_values.items():
        key = "tags.%s.values" % fix_dot(k)
        filter_part.append({"terms": {key: v}})
    date_range = {"range": {"timestamp": {}}}
    if start_date:
        date_range["range"]["timestamp"]["gte"] = start_date
    if end_date:
        date_range["range"]["timestamp"]["lte"] = end_date
    if start_date or end_date:
        filter_part.append(date_range)

    levels = filters.get("level")
    if levels:
        filter_part.append({"terms": {"log_level": levels}})
    namespaces = filters.get("namespace")
    if namespaces:
        filter_part.append({"terms": {"namespace": namespaces}})
    messages = filters.get("message")
    if messages:
        query["query"]["filtered"]["query"] = {"match": {"message": " ".join(messages)}}
    return query


def traverse_sub_aggs(aggregation_list, data):
    """
    Traverse data looking for sub aggregations and return them in organized
    metrics format
    """
    sub_agg = data.get("sub_agg")
    fields = []
    if sub_agg:
        return traverse_sub_aggs(aggregation_list, sub_agg)
    for agg in aggregation_list:
        if agg["id"] in data:
            sub_agg_type = None
            sub_agg_field = None
            sub_agg_config = None
            if agg.get("deepAgg") and agg.get("deepAggEnabled"):
                sub_agg_type = agg["deepAgg"]["type"]
                sub_agg_field = agg["deepAgg"]["field_name"]
                sub_agg_config = agg["deepAgg"]["config"]
            fields.append(
                {
                    "name": agg["field_name"],
                    "agg_type": agg["type"],
                    "sub_agg_type": sub_agg_type,
                    "sub_agg_field": sub_agg_field,
                    "sub_agg_config": sub_agg_config,
                    "config": agg["config"],
                    "grouping": agg.get("grouping", False),
                    "agg_id": agg["id"],
                    "traversed": traverse_sub_aggs(aggregation_list, data[agg["id"]]),
                }
            )
    if fields:
        return fields
    else:
        return data


def save_label(info_dict, agg_id, agg, f_type=None, key=None):
    """
    Generate field identifier with label associated with it
    """
    if f_type in ["count", "bucket"]:
        label = {
            "agg": agg["agg_id"],
            "name": agg["name"],
            "type": agg["agg_type"],
            "key": key,
            "human_label": "<label>",
        }

        if f_type == "count":
            h_label = "agg {} {} {} other count".format(
                agg["agg_id"], agg["name"], agg["agg_type"]
            )

        elif f_type == "bucket":
            if agg["config"].get("label"):
                h_label = "%s %s" % (key, agg["config"]["label"])
            else:
                h_label = "{}".format(key)

        if agg.get("sub_agg_type"):
            label = {
                "agg": agg["agg_id"],
                "name": agg["sub_agg_field"],
                "type": agg["sub_agg_type"],
                "key": key,
                "human_label": "<label>",
            }

            if agg["sub_agg_config"].get("label"):
                h_label = "%s %s" % (key, agg["sub_agg_config"]["label"])
            else:
                h_label = "{} {} {}".format(
                    key, agg["sub_agg_field"], agg["sub_agg_type"]
                )

    elif f_type == "nonbucket":
        label = {
            "agg": agg["agg_id"],
            "name": agg["name"],
            "type": agg["agg_type"],
            "key": key if key != "value" else "__NOKEY__",
            "human_label": "<label>",
        }

        if agg["config"].get("label"):
            h_label = agg["config"]["label"]
        else:
            h_label = "{} {} {}".format(
                agg["name"], agg["agg_type"], key if key != "value" else ""
            )

    if agg_id not in info_dict["system_labels"]:
        label["human_label"] = h_label.strip().capitalize()
        info_dict["system_labels"][agg_id] = label
    return label


def gen_groups(info_dict, agg, field_id):
    """
    Generate lists containing field identifiers that should be grouped
    by charting library on frontend
    """
    # used to notify c3js that we want to group all terms from
    # this agg together and "stack" them
    if agg.get("grouping"):
        if agg["agg_id"] not in info_dict["groups"]:
            info_dict["groups"][agg["agg_id"]] = set()
        info_dict["groups"][agg["agg_id"]].add(field_id)
    # used to notify c3js that we want to group all terms from
    # ALL aggs together and "stack" them
    agg_grouping = agg.get("agg_grouping")
    if agg_grouping:
        agg_group = "agg_groups_{}".format(agg_grouping)
        if agg_group not in info_dict["groups"]:
            info_dict["groups"][agg_group] = set()
        info_dict["groups"][agg_group].add(field_id)


def gen_subkey(info_dict, agg_id, key, counter):
    """
    Generates helper subkeys used later for generating field_id's,
    """
    subkey = "%s_%s" % (agg_id, key)
    if agg_id not in info_dict["subkeys"]:
        info_dict["subkeys"][agg_id] = {}
    if key not in info_dict["subkeys"][agg_id]:
        ints = list(info_dict["subkeys"][agg_id].values())
        if ints:
            count = max(ints)
        else:
            count = 0
        info_dict["subkeys"][agg_id][key] = count + 1
    return subkey, counter


def parse_metrics(parent_agg, info_dict, es_result, counter):
    """
    Parses normalized es_result and transforms the entries to a format
    that is usable in charting later on, generating metric/series
    idenfiers, labels and groups
    """
    parsed_series = OrderedDict()
    # means we have parent agg without sub aggregations, this wasn't
    # traversed so we build the structure here
    if "doc_count" in es_result:
        es_result = [
            {
                "name": parent_agg["config"]["field"],
                "agg_type": parent_agg["type"],
                "grouping": 0,
                "config": parent_agg["config"],
                "agg_id": "p_agg",
                "traversed": {"doc_count": es_result["doc_count"]},
            }
        ]

    for agg in es_result:
        traversed = agg["traversed"]
        if "buckets" in traversed:
            # return the amount of other documents,
            # not only top X
            # disabled for now may be never used
            # if traversed.get("sum_other_doc_count"):
            #     field_id = "%s_%s" % (agg['agg_id'], 'C')
            #     save_label(info_dict, field_id, agg, f_type="count")
            #     gen_groups(info_dict, agg, field_id)
            #     parsed_series[field_id] = traversed["sum_other_doc_count"]
            for entry in traversed["buckets"]:

                # required for determining between multiple aggs with same key
                # names
                subkey, counter = gen_subkey(
                    info_dict, agg["agg_id"], entry["key"], counter
                )
                key_id = info_dict["subkeys"][agg["agg_id"]][entry["key"]]
                field_id = "%s_%s" % (agg["agg_id"], key_id)
                save_label(info_dict, field_id, agg, f_type="bucket", key=entry["key"])
                gen_groups(info_dict, agg, field_id)
                # deep_agg is only present if we are using single-value
                # metric nested in another metric like sum value in
                # terms metrics in time histogram bucket
                if "deep_agg" not in entry:
                    parsed_series[field_id] = entry["doc_count"]
                else:
                    parsed_series[field_id] = entry["deep_agg"]["value"]
        else:
            if "values" in traversed:
                # handle percentiles
                to_iter = traversed["values"].items()
            else:
                to_iter = traversed.items()
            for k, v in to_iter:
                subkey, counter = gen_subkey(info_dict, agg["agg_id"], k, counter)
                key_id = info_dict["subkeys"][agg["agg_id"]][k]
                field_id = "%s_%s" % (agg["agg_id"], key_id)

                save_label(info_dict, field_id, agg, key=k, f_type="nonbucket")
                gen_groups(info_dict, agg, field_id)
                parsed_series[field_id] = v
    return parsed_series, counter


def determine_date_boundries_json(json_body):
    # determine the start and end dates for our chart based on config
    start_moment = json_body.get("startMoment", "now")
    start_moment_unit = json_body.get("startMomentUnit")
    start_moment_value = json_body.get("startMomentValue")
    time_range = json_body.get("timeRange", "1M")
    end_date = datetime.utcnow().replace(second=0, microsecond=0)
    if start_moment:
        if start_moment == "day_end":
            end_date = end_date + relativedelta(days=1, hour=0, minute=0)
        elif start_moment == "week_end":
            days = 1 if end_date.weekday() == 6 else 0
            end_date = (
                end_date
                + relativedelta(weekday=SU(1), minute=0, hour=0, days=days)
                + relativedelta(days=1)
            )
        elif start_moment == "month_start":
            end_date = end_date + relativedelta(day=1, minute=0, hour=0)
        elif start_moment == "month_end":
            end_date = end_date + relativedelta(day=1, months=1, minute=0, hour=0)

    if start_moment_value and start_moment_unit:
        op = {start_moment_unit: int(start_moment_value) * -1}
        end_date += relativedelta(**op)

    start_date = end_date - h.time_deltas[time_range]["delta"]
    end_date = end_date.replace(second=59, microsecond=999999)
    return start_date, end_date


def parse_es_result(elasticsearch_data, es_config, json_config):
    """

    :param elasticsearch_data: result of elasticsearch query
    :param es_config: result of `transform_json_to_es_config`
    :param json_config: original config passed to `transform_json_to_es_config`
    :return:
    """
    parent_agg = es_config.get("parent_agg")
    aggregations = es_config["aggregations"]
    # will store actual series data
    series = []
    info_dict = {
        "system_labels": {},
        "human_labels": {},
        "groups": {},
        "subkeys": {},
        "categories": [],
    }
    # subkeys - helper dict so we can generate right metric keys for
    # terms and other stuff
    # will hold generated labels and group information

    # incremented when we create new metric key
    counter = 1

    result = traverse_sub_aggs(aggregations, elasticsearch_data.get("aggregations", {}))
    single_row = False

    if parent_agg and parent_agg["type"] == "time_histogram":
        buckets = result["parent_agg"]["buckets"]
        for bucket in buckets:
            t_key = datetime.utcfromtimestamp(int(bucket["key"]) / 1000)
            traversed = traverse_sub_aggs(aggregations, bucket)
            item, counter = parse_metrics(parent_agg, info_dict, traversed, counter)
            item["key"] = t_key
            series.append(item)

        post_pocess = json_config.get("postProcess")
        if post_pocess and post_pocess.get("type"):
            if post_pocess["type"] == "acumulate":
                postprocess_acumulate(series)

    elif parent_agg and parent_agg["type"]:
        buckets = result["parent_agg"]["buckets"]
        for bucket in buckets:
            traversed = traverse_sub_aggs(aggregations, bucket)
            item, counter = parse_metrics(parent_agg, info_dict, traversed, counter)
            item["key"] = bucket["key"]
            series.append(item)
    else:
        single_row = True
        temp_series, counter = parse_metrics(parent_agg, info_dict, result, counter)
        series = []
        for k, v in temp_series.items():
            row = {k: v, "key": info_dict["system_labels"][k]}
            series.append(row)

    # now lets do a 2nd pass over buckets normalizing missing metrics
    if not single_row:
        for serie in series:
            for label in info_dict["system_labels"].keys():
                if label not in serie:
                    serie[label] = None

    categories = []

    for serie in series:
        if "key" in serie and parent_agg and parent_agg["type"] == "terms":
            categories.append(serie["key"])
        if not parent_agg or (parent_agg and parent_agg["type"] is None):
            categories.append(serie["key"])

    # we dont need that anymore
    info_dict.pop("subkeys", None)
    info_dict["categories"] = categories
    return series, info_dict


def transform_json_to_es_config(
    request, json_body, filter_settings, ids_to_override=None, ixtypes=None
):
    """
    Generates a valid elasticsearch query our of json body and filter settings
    :param request: request object
    :param json_body: config object generated by angular
    :param filter_settings: list of search params restricting main resultset
                            WARNING - this restricts the resultset to data that
                            user has permission to see so its critical to be
                            present
    :param ids_to_override: allows to override the application list that user
    normally would be able to access - this allows to provide public dashboards
    functionality
    :return: {"query": query,
            "parent_agg": parent_agg,
            "aggregations": aggregations,
            "index_names": index_names}
    """

    # determine start and end date for dataset

    bdry_start_date, bdry_end_date = determine_date_boundries_json(json_body)
    # in some cases we have explicitly set start and end dates in filter
    # settings then we use that instead of "relative" config range prediction
    if filter_settings.get("start_date"):
        bdry_start_date = filter_settings["start_date"]
    if filter_settings.get("end_date"):
        bdry_end_date = filter_settings["end_date"]

    # inject the dates if missing from filter settings (important for charting)
    if not filter_settings.get("start_date"):
        filter_settings["start_date"] = bdry_start_date

    if not filter_settings.get("end_date"):
        filter_settings["end_date"] = bdry_end_date

    parent_agg = json_body.get("parentAgg")

    if (
        parent_agg
        and parent_agg["type"] == "time_histogram"
        and parent_agg["config"]["interval"] == "1m"
    ):
        delta = filter_settings["end_date"] - filter_settings["start_date"]
        if delta > timedelta(hours=4):
            bdry_start_date = filter_settings["end_date"] - timedelta(hours=4)
            filter_settings["start_date"] = bdry_start_date

    query = build_query(filter_settings)

    # AGG part

    aggregations = json_body.get("aggs")

    sub_agg = {}

    for agg in aggregations:
        subagg_id, parsed_agg = process_agg(
            request, agg, override_app_ids=ids_to_override
        )
        sub_agg[subagg_id] = parsed_agg
        # handle ordering on sub aggregations
        if parent_agg:
            order_by = parent_agg["config"].get("order_by")
        else:
            order_by = None
        if (not parent_agg or not parent_agg["type"]) and order_by:
            if str(subagg_id) != order_by["agg"]:
                continue
            if parsed_agg["aggs"].get("sub_agg", {}).get("aggs"):
                parsed_agg["aggs"]["sub_agg"][agg["type"]]["order"] = {
                    "deep_agg": order_by["order"]
                }
            else:
                parsed_agg["aggs"]["sub_agg"][agg["type"]]["order"] = {
                    "_count": order_by["order"]
                }

    # input data normalization
    # will be needed for label generation
    if parent_agg and parent_agg["type"] and parent_agg["type"] != "time_histogram":
        parent_agg["field_name"] = fix_dot(parent_agg["config"].get("field"))

    if parent_agg and parent_agg["type"] == "time_histogram":
        parent_agg["field_name"] = "timestamp"
        parent_agg["config"]["field"] = "timestamp"
        query["aggs"] = {
            "parent_agg": {
                "date_histogram": {
                    "field": "timestamp",
                    "interval": parent_agg["config"]["interval"],
                    "min_doc_count": 0,
                    "extended_bounds": {"max": bdry_end_date},
                },
                "aggs": sub_agg,
            }
        }
        date_histogram = query["aggs"]["parent_agg"]["date_histogram"]
        if bdry_start_date < filter_settings["start_date"]:
            date_histogram["extended_bounds"]["min"] = filter_settings["start_date"]
        else:
            date_histogram["extended_bounds"]["min"] = bdry_start_date

    elif parent_agg and parent_agg["type"]:
        query["aggs"] = {"parent_agg": {parent_agg["type"]: {}, "aggs": sub_agg}}

        if parent_agg["config"].get("size"):
            size = int(parent_agg["config"]["size"])
            query["aggs"]["parent_agg"][parent_agg["type"]]["size"] = size

        # handle ordering of nested metrics
        if parent_agg["config"].get("order_by"):
            metric = "%s>sub_agg" % parent_agg["config"]["order_by"]["agg"]
            query["aggs"]["parent_agg"][parent_agg["type"]]["order"] = {
                metric: parent_agg["config"]["order_by"]["order"]
            }
        key = "tags.%s.values" % fix_dot(parent_agg["config"].get("field"))
        query["aggs"]["parent_agg"][parent_agg["type"]]["field"] = key
    else:
        query["aggs"] = sub_agg

    def float_test(input):
        try:
            float(input)
            return False
        except ValueError:
            return True

    tags_to_check = set()

    # check if we need to check indices for fields being present
    for agg in aggregations:
        computed_fields = agg.get("computed_fields", [])
        filtered_fields = list(
            filter(float_test, [f["field"] for f in computed_fields if f["field"]])
        )
        if agg.get("computed"):
            tags_to_check = tags_to_check.union(set(filtered_fields))

        if agg.get("deepAggEnabled"):
            computed_fields = agg["deepAgg"].get("computed_fields", [])
            filtered_fields = list(
                filter(float_test, [f["field"] for f in computed_fields if f["field"]])
            )
            tags_to_check = tags_to_check.union(set(filtered_fields))

    if not ixtypes:
        ixtypes = [json_body.get("datasource", "logs")]

    index_names = es_index_name_limiter(
        start_date=bdry_start_date, end_date=bdry_end_date, ixtypes=ixtypes
    )
    # exclude indices that don't have tags that we use in expression
    if tags_to_check:
        exclude_indices = []
        tags_to_check = set(map(fix_dot, tags_to_check))
        if index_names:
            mappings = request.es_conn.get_mapping(index=index_names, doc_type="log")
        else:
            mappings = {}

        for k, v in mappings.items():
            tags = v["mappings"]["log"]["properties"].get("tags", {"properties": {}})
            if "properties" not in tags:
                exclude_indices.append(k)
                continue
            mapped_keys = list(tags["properties"].keys())
            if not tags_to_check.issubset(mapped_keys):
                exclude_indices.append(k)
        index_names = set(index_names).difference(exclude_indices)

    return {
        "query": query,
        "parent_agg": parent_agg,
        "aggregations": aggregations,
        "index_names": index_names,
    }


def postprocess_acumulate(series):
    cumul_holder = defaultdict(lambda: 0)
    for item in series:
        for k, v in item.items():
            if k == "key":
                continue
            if v is not None:
                cumul_holder[k] += v
        item.update(cumul_holder)
