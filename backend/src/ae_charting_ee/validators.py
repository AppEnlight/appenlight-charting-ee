# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

import colander
from colander import null


@colander.deferred
def possible_applications_validator(node, kw):
    possible_apps = [int(a) for a in kw["resources"]]
    return colander.OneOf(possible_apps)


@colander.deferred
def possible_applications(node, kw):
    return [int(a) for a in kw["resources"]]


class UnknownType(object):
    """
    Universal type that will accept a deserialized JSON object and store it unaltered
    """

    def serialize(self, node, appstruct):
        if appstruct is null:
            return null
        return appstruct

    def deserialize(self, node, cstruct):
        if cstruct is null:
            return null
        return cstruct

    def cstruct_children(self):
        return []


time_range_choices = [
    "1m",
    "5m",
    "30m",
    "1h",
    "4h",
    "12h",
    "24h",
    "3d",
    "1w",
    "2w",
    "1M",
    "3M",
    "6M",
    "12M",
]

start_moment_choices = ["week_end", "month_end", "day_end", "now"]

start_moment_unit_choices = ["minutes", "hours", "days", "months"]

chart_type_choices = ["bar", "line", "area", "step", "pie", "donut", "gauge"]

agg_type_choices = [
    "terms",
    "percentiles",
    "min",
    "max",
    "sum",
    "avg",
    "value_count",
    "cardinality",
]

deep_agg_type_choices = ["min", "max", "sum", "avg", "value_count", "cardinality"]


class ConfigTypeSchema(colander.MappingSchema):
    type = colander.SchemaNode(colander.String(), missing=None)
    config = colander.SchemaNode(UnknownType(), missing=None)


class MappingListSchema(colander.SequenceSchema):
    config = colander.SchemaNode(UnknownType())


class ChartDeepAggSchema(colander.MappingSchema):
    id = colander.SchemaNode(colander.String())
    type = colander.SchemaNode(
        colander.String(), validator=colander.OneOf(deep_agg_type_choices)
    )
    computed = colander.SchemaNode(colander.Boolean(), missing=False)
    computed_fields = MappingListSchema()
    filters = MappingListSchema()
    config = colander.SchemaNode(UnknownType())


class ChartAggSchema(colander.MappingSchema):
    id = colander.SchemaNode(colander.String())
    type = colander.SchemaNode(
        colander.String(), validator=colander.OneOf(agg_type_choices)
    )
    grouping = colander.SchemaNode(colander.Boolean(), missing=False)
    computed = colander.SchemaNode(colander.Boolean(), missing=False)
    deepAggEnabled = colander.SchemaNode(colander.Boolean(), missing=False)
    config = colander.SchemaNode(UnknownType())
    computed_fields = MappingListSchema()
    filters = MappingListSchema()
    deepAgg = ChartDeepAggSchema()


class AggListSchema(colander.SequenceSchema):
    agg = ChartAggSchema()


class ChartConfigSchema(colander.MappingSchema):
    parentAgg = ConfigTypeSchema()
    chartType = ConfigTypeSchema()
    resource = colander.SchemaNode(
        colander.Integer(), validator=possible_applications_validator
    )
    datasource = colander.SchemaNode(
        colander.String(), missing="logs", validator=colander.OneOf(["logs", "metrics"])
    )
    postProcess = ConfigTypeSchema(missing=None)
    timeRange = colander.SchemaNode(
        colander.String(), validator=colander.OneOf(time_range_choices)
    )
    startMomentValue = colander.SchemaNode(
        colander.Integer(), missing=0, validator=colander.Range(min=0)
    )
    startMoment = colander.SchemaNode(
        colander.String(), missing="now", validator=colander.OneOf(start_moment_choices)
    )
    startMomentUnit = colander.SchemaNode(
        colander.String(),
        missing="minutes",
        validator=colander.OneOf(start_moment_unit_choices),
    )
    aggs = AggListSchema()
