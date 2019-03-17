# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

import copy
from datetime import datetime

from celery.utils.log import get_task_logger
from pyramid.threadlocal import get_current_request, get_current_registry

from appenlight.celery import celery
from appenlight.models import DBSession, Datastores
from appenlight.models.event import Event
from appenlight.models.services.event import EventService
from appenlight.models.services.alert_channel_action import \
    AlertChannelActionService
from ae_charting_ee.models.services.dashboard_chart import \
    DashboardChartService
from appenlight.lib.helpers import time_deltas
from appenlight.lib.rule import RuleService
from ae_charting_ee.lib.es_parser import (
    build_filter_settings_from_chart_config,
    determine_date_boundries_json,
    transform_json_to_es_config,
    parse_es_result)

log = get_task_logger(__name__)

DATE_FORMAT = '%Y-%m-%dT%H:%M:%S'


@celery.task(queue="default")
def alerting_charts():
    """
    loop that loads existing charting alert rules and issues checks
    """
    alert_rules = AlertChannelActionService.by_type('chart')
    for rule in alert_rules:
        alert_chart.delay(rule.pkey, rule.other_id)


@celery.task(queue="default")
def alert_chart(pkey, chart_uuid):
    start = datetime.utcnow()
    request = get_current_request()
    alert_action = AlertChannelActionService.by_pkey(pkey)
    chart = DashboardChartService.by_uuid(chart_uuid)
    chart.migrate_json_config()
    resource = chart.dashboard
    json_body = chart.config
    ids_to_override = [json_body['resource']]
    filter_settings = build_filter_settings_from_chart_config(
        request, json_body, override_app_ids=ids_to_override)

    log.warning('alert_chart, resource:{}, chart:{}'.format(
        resource,
        chart_uuid
    ))

    # determine start and end date for dataset
    start_date, end_date = determine_date_boundries_json(json_body)
    if not filter_settings['start_date']:
        filter_settings['start_date'] = start_date.replace(
            hour=0, minute=0, second=0, microsecond=0)

    if not filter_settings['end_date']:
        filter_settings['end_date'] = end_date

    event_type = Event.types['chart_alert']
    open_event = None
    latest_closed_event = None
    events_query = EventService.for_resource(
        [resource.resource_id], event_type=event_type,
        target_uuid=chart_uuid, limit=20)

    for event in events_query:
        if event.status == Event.statuses['active'] and not open_event:
            open_event = event
        if (event.status == Event.statuses['closed'] and
                not latest_closed_event):
            latest_closed_event = event

    if latest_closed_event:
        filter_settings['start_date'] = latest_closed_event.end_date

    es_config = transform_json_to_es_config(
        request, json_body, filter_settings, ids_to_override=ids_to_override)

    if not es_config['index_names']:
        return
    result = Datastores.es.search(body=es_config['query'],
                                  index=es_config['index_names'],
                                  doc_type='log',
                                  size=0)
    series, info_dict = parse_es_result(result, es_config,
                                        json_config=json_body)

    # we need to make a deepcopy since we will mutate it
    rule_config = copy.deepcopy(alert_action.rule)
    field_mappings = alert_action.config

    rule_obj = RuleService.rule_from_config(rule_config, field_mappings,
                                            info_dict['system_labels'])
    matched_interval = None
    finished_interval = None
    for step in reversed(series):
        if rule_obj.match(step):
            log.info('matched start')
            if not matched_interval:
                matched_interval = step
                break
        else:
            finished_interval = step

    if matched_interval:
        if open_event:
            log.info('ALERT: PROGRESS: %s %s' % (event_type, resource))
            if finished_interval:
                open_event.values = copy.deepcopy(open_event.values)
                end_interval = finished_interval['key'].strftime(DATE_FORMAT)
                open_event.values['end_interval'] = end_interval
                open_event.close()
        else:
            log.warning('ALERT: OPEN: %s %s' % (event_type, resource))
            step_size = None
            parent_agg = json_body.get('parentAgg')
            if parent_agg and parent_agg['type'] == 'time_histogram':
                step_size = time_deltas[parent_agg['config']['interval']][
                    'delta'].total_seconds()
            matched_step_values = {
                "values": matched_interval,
                "labels": info_dict['system_labels']
            }
            values_dict = {"matched_rule": alert_action.get_dict(),
                           "matched_step_values": matched_step_values,
                           "start_interval": step['key'],
                           "end_interval": None,
                           "resource": chart.config.get('resource'),
                           "chart_name": chart.name,
                           "chart_uuid": chart_uuid,
                           "step_size": step_size,
                           "action_name": alert_action.name}
            new_event = Event(resource_id=resource.resource_id,
                              event_type=event_type,
                              status=Event.statuses['active'],
                              values=values_dict,
                              target_uuid=chart_uuid)
            DBSession.add(new_event)
            DBSession.flush()
            new_event.send_alerts(request=request, resource=resource)
    elif open_event:
        if finished_interval:
            open_event.values = copy.deepcopy(open_event.values)
            end_interval = finished_interval['key'].strftime(DATE_FORMAT)
            open_event.values['end_interval'] = end_interval
        open_event.close()
    took = datetime.utcnow() - start
    log.warning('chart alert rule check took: {}'.format(took))
