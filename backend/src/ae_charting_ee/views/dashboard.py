# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

import copy
from datetime import datetime, timedelta

from pyramid.httpexceptions import HTTPNotFound, HTTPUnprocessableEntity
from pyramid.view import view_config

from appenlight.models import Datastores, DBSession
from appenlight.models.alert_channel_action import AlertChannelAction
from appenlight.models.services.alert_channel_action import \
    AlertChannelActionService
from appenlight.models.services.event import EventService
from appenlight.lib.helpers import time_deltas
from ae_charting_ee.lib.es_parser import (
    build_filter_settings_from_chart_config,
    transform_json_to_es_config,
    parse_es_result)
from appenlight.lib.rule import RuleService
from ae_charting_ee.models.dashboard import Dashboard
from ae_charting_ee.models.dashboard_chart import DashboardChart
from ae_charting_ee.validators import ChartConfigSchema

from zope.sqlalchemy import mark_changed

import logging

log = logging.getLogger(__name__)


@view_config(route_name='dashboards_no_id', renderer='json',
             permission='authenticated', request_method="GET")
def index(request):
    if not request.user:
        return {"owned_dashboards": [],
                "viewable_dashboards": []}

    dashboards = request.user.resources_with_perms(
        ['delete'], resource_types=['dashboard'])
    owned_dashboard_list = []
    owned_dashboard_ids = []
    viewable_dashboards_list = []
    for d in dashboards:
        ddict = d.get_dict(exclude_keys=None,
                           include_keys=['resource_id', 'resource_name',
                                         'uuid', 'public'])
        owned_dashboard_list.append(ddict)
        owned_dashboard_ids.append(ddict['resource_id'])

    viewable_dashboards = request.user.resources_with_perms(
        ['view'], resource_types=['dashboard'])

    for d in viewable_dashboards:
        if d.resource_id in owned_dashboard_ids:
            continue
        ddict = d.get_dict(exclude_keys=None,
                           include_keys=['resource_id', 'resource_name',
                                         'uuid', 'public'])
        ddict['permissions'] = [perm.perm_name for perm in
                                d.perms_for_user(request.user)]
        viewable_dashboards_list.append(ddict)

    return {"owned_dashboards": owned_dashboard_list,
            "viewable_dashboards": viewable_dashboards_list}


@view_config(route_name='dashboards_no_id', renderer='json',
             request_method="POST", permission='create_resources')
def dashboard_POST(request):
    dashboard = Dashboard(
        resource_name=request.unsafe_json_body['resource_name'],
        layout_config=request.unsafe_json_body['layout_config'],
    )
    request.user.resources.append(dashboard)
    DBSession.flush()
    chart_ids = []
    for row in dashboard.layout_config:
        for col in row['columns']:
            chart_ids.append(col['chartId'])
    for c_uuid in chart_ids:
        chart = DashboardChart(uuid=c_uuid, config=None)
        dashboard.charts.append(chart)
    request.session.flash('Dashboard created')
    return dashboard.get_dict()


@view_config(route_name='dashboards', renderer='json',
             request_method="PATCH", permission='edit')
def dashboard_PATCH(request):
    dashboard = request.context.resource
    allowed_keys = ['public', 'resource_name', 'layout_config']
    for k, v in request.unsafe_json_body.items():
        if k in allowed_keys:
            setattr(dashboard, k, v)
        else:
            return HTTPUnprocessableEntity()

    # ensure we don't have any leftover chart definitions present from
    # removed layout columns
    chart_ids = []
    for row in dashboard.layout_config:
        for col in row['columns']:
            chart_ids.append(col['chartId'])

    for chart in dashboard.charts:
        if chart.uuid not in chart_ids:
            actions = AlertChannelActionService.by_other_id(chart.uuid)
            for action in actions:
                DBSession.delete(action)
            dashboard.charts.remove(chart)

    existing_ids = [c.uuid for c in dashboard.charts]
    for c_uuid in chart_ids:
        if c_uuid not in existing_ids:
            chart = DashboardChart(uuid=c_uuid, config=None)
            dashboard.charts.append(chart)
    request.session.flash('Dashboard updated')
    return dashboard.get_dict(request=request)


@view_config(route_name='dashboards',
             context_type_class=('resource', Dashboard),
             renderer='json', request_method="GET", permission='view')
def dashboard_GET(request):
    resource = request.context.resource
    return resource.get_dict(request=request,
                             include_perms=request.has_permission('edit'))


@view_config(route_name='dashboards',
             context_type_class=('resource', Dashboard),
             renderer='json', request_method="DELETE", permission='delete')
def dashboard_DELETE(request):
    dashboard = request.context.resource
    actions = AlertChannelActionService.by_resource_id(dashboard.resource_id)
    for action in actions:
        DBSession.delete(action)
    DBSession.delete(dashboard)
    request.session.flash('Dashboard removed')
    return True


@view_config(route_name='charts', request_method="PATCH", permission='edit',
             context_type_class=('resource', Dashboard), renderer='json')
def charts_PATCH(request):
    dashboard = request.context.resource

    json_body = copy.deepcopy(request.unsafe_json_body)
    chart_config = json_body['config']
    # for now just throw error in case something weird is found

    applications = request.user.resources_with_perms(
        ['view'], resource_types=['application'])

    # CRITICAL - this ensures our resultset is limited to only the ones
    # user has view permissions
    all_possible_app_ids = set([app.resource_id for app in applications])

    schema = ChartConfigSchema().bind(resources=all_possible_app_ids)
    schema.deserialize(chart_config)

    # some processing/normalizing for new/missing variables
    if 'timeRange' not in chart_config:
        chart_config['timeRange'] = '1M'
    if 'startMoment' not in chart_config:
        chart_config['startMoment'] = 'now'
    if 'startMomentUnit' not in chart_config:
        chart_config['startMomentUnit'] = 'days'
    if 'startMomentValue' not in chart_config:
        chart_config['startMomentValue'] = 0
    # ensure we don't have any leftover chart definitions present from
    # removed layout columns
    chart_ids = []
    for row in dashboard.layout_config:
        for col in row['columns']:
            chart_ids.append(col['chartId'])
    for chart in dashboard.charts:
        if chart.uuid not in chart_ids:
            actions = AlertChannelActionService.by_other_id(chart.uuid)
            for action in actions:
                DBSession.delete(action)
            dashboard.charts.remove(chart)

    chart_config['json_config_version'] = chart.json_config_version
    # make sure we set model field as dirty
    request.context.chart.name = json_body['name']
    request.context.chart.config = None
    request.context.chart.config = chart_config
    session = DBSession()
    mark_changed(session)
    request.session.flash('Chart saved')
    return True


@view_config(route_name='charts_property',
             match_param='key=data',
             context_type_class=('resource', Dashboard),
             renderer='json', permission='view')
@view_config(route_name='charts_property',
             match_param='key=data_test_config',
             context_type_class=('resource', Dashboard),
             renderer='json', permission='view')
@view_config(route_name='charts_property',
             match_param='key=data_rule_config',
             context_type_class=('resource', Dashboard),
             renderer='json', permission='view')
def charts_data(request):
    """
    Handles charting from UI generated charts
    """
    # path for user testing out the chart
    ids_to_override = None
    chart = request.context.chart
    chart.migrate_json_config()
    req_type = request.matchdict['key']
    if (request.method == "POST" and not request.context.used_uuid
        and req_type == 'data_test_config'):
        chart_config = copy.deepcopy(request.unsafe_json_body)
        # for now just throw error in case something weird is found
        applications = request.user.resources_with_perms(
            ['view'], resource_types=['application'])

        # CRITICAL - this ensures our resultset is limited to only the ones
        # user has view permissions
        all_possible_app_ids = set([app.resource_id for app in applications])

        schema = ChartConfigSchema().bind(resources=all_possible_app_ids)
        schema.deserialize(chart_config)
        filter_settings = build_filter_settings_from_chart_config(request,
                                                                  chart_config)
    else:
        # path for everyone else viewing the chart using UUID/public or not
        # ids_to_override will only work here because
        # initially it was validated
        # in dashboard_chart_save() request - so at this point its considered
        # valid
        chart_config = chart.config
        if not chart_config:
            return {}
        ids_to_override = [chart_config['resource']]
        filter_settings = build_filter_settings_from_chart_config(
            request, chart_config, override_app_ids=ids_to_override)

    if not chart_config:
        return HTTPNotFound()

    # send chartype so client knows how to render the result
    chart_type = chart_config.get('chartType')
    # we always want to use the POST version of chart type for preview purposes
    # as priority
    if not chart_type:
        chart_type = chart.config.get('chartType')

    es_config = transform_json_to_es_config(
        request, chart_config, filter_settings,
        ids_to_override=ids_to_override)

    query = es_config['query']

    if not es_config['index_names']:
        return {
            "name": '',
            "chart_type": chart_type,
            "parent_agg": es_config['parent_agg'],
            "series": [],
            "system_labels": {},
            "groups": [],
            "rect_regions": [],
            "categories": []
        }
    result = Datastores.es.search(query,
                                  index=es_config['index_names'],
                                  doc_type='log',
                                  size=0)
    series, info_dict = parse_es_result(result, es_config,
                                        json_config=chart_config)

    regions = []

    if req_type == 'data_rule_config':
        json_body = copy.deepcopy(request.unsafe_json_body)
        rule_config = json_body.get('rule')
        field_mappings = json_body.get('mappings')
        rule_obj = RuleService.rule_from_config(rule_config, field_mappings,
                                                info_dict['system_labels'])

        parent_agg = chart_config.get('parentAgg')
        if parent_agg and parent_agg['type'] == 'time_histogram':

            for step in series:
                if rule_obj.match(step):
                    iv = time_deltas[parent_agg['config']['interval']]
                    step_start = step['key'].replace(second=0, microsecond=0)
                    regions.append({'start': step_start,
                                    'end': step_start + iv['delta'],
                                    'class': 'rule1'})
    else:
        events = EventService.for_resource([chart.resource_id],
                                           target_uuid=chart.uuid)
        for event in events:
            if event.end_date or event.values.get('end_interval'):
                end_date = event.end_date.replace(second=0, microsecond=0)
                step_end = event.values.get('end_interval') or end_date
            else:
                step_end = datetime.utcnow().replace(second=0, microsecond=0)
            start_date = event.values['start_interval']
            regions.append({
                'start': start_date,
                'end': step_end,
                'class': 'rule1'})

    return {
        "name": chart.name,
        "chart_type": chart_type,
        "parent_agg": es_config['parent_agg'],
        "series": series,
        "system_labels": info_dict['system_labels'],
        "rect_regions": regions,
        "groups": [list(v) for v in info_dict['groups'].values()],
        "categories": info_dict['categories']
    }


@view_config(route_name='charts_event_rules_no_id',
             context_type_class=('chart', DashboardChart),
             request_method="POST",
             renderer='json', permission='view')
def charts_event_rules_POST(request):
    json_body = copy.deepcopy(request.unsafe_json_body)
    alert_action = AlertChannelAction(
        name=json_body.get('name'),
        owner_id=request.user.id,
        resource_id=request.context.resource.resource_id,
        other_id=request.context.chart.uuid,
        rule=json_body['rule'],
        config=json_body['mappings'],
        type='chart')
    DBSession.add(alert_action)
    DBSession.flush()
    return alert_action.get_dict(extended_info=True)


@view_config(route_name='charts_event_rules_no_id',
             context_type_class=('chart', DashboardChart),
             request_method="GET",
             renderer='json', permission='view')
def charts_event_rules_GET(request):
    actions = AlertChannelActionService.by_other_id(request.context.chart.uuid)
    return [a.get_dict(extended_info=True) for a in actions]
