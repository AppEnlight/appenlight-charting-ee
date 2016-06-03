# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

import pkg_resources
from datetime import timedelta


def url_gen(request):
    urls = {
    'dashboards': request.route_url('dashboards', resource_id='REPLACE_RID').replace('REPLACE_RID',':resourceId'),
    'dashboardsNoId': request.route_url('dashboards_no_id'),
    'dashboardsProperty': request.route_url('dashboards_property', key='REPLACE_KEY', resource_id='REPLACE_RID').replace('REPLACE_KEY',':key').replace('REPLACE_RID',':resourceId'),
    'charts':  request.route_url('charts', chart_id='REPLACE_CID').replace('REPLACE_CID',':chartId'),
    'chartsNoId':  request.route_url('charts_no_id'),
    'chartsProperty':  request.route_url('charts_property', key='REPLACE_KEY', chart_id='REPLACE_CID').replace('REPLACE_KEY',':key').replace('REPLACE_CID',':chartId'),
    'chartsEventRules':  request.route_url('charts_event_rules', rule_id='REPLACE_CID').replace('REPLACE_CID',':ruleId'),
    'chartsEventRulesNoId':  request.route_url('charts_event_rules_no_id'),
    }
    return urls

PLUGIN_DEFINITION = {
    'name': 'ae_charting_ee',
    'config': {'celery_tasks': ['ae_charting_ee.celery.tasks'],
               'celery_beats': [('alerting_charts', {
                   'task': 'ae_charting_ee.celery.tasks.alerting_charts',
                   'schedule': timedelta(seconds=60)
               })],
               'fulltext_indexer': None,
               'sqlalchemy_migrations': 'ae_charting_ee:migrations',
               'default_values_setter': None,
               'top_nav': {
                   'menu_dashboards_items': {'sref': 'dashboard.list',
                                             'label': 'Custom Dashboards'}
               },
               'javascript': {
                   'src': 'ae_charting_ee.js',
                   'angular_module': 'appenlight.plugins.ae_charting_ee'
               },
               'static': pkg_resources.resource_filename(
                   'ae_charting_ee', 'static'),
               'url_gen':url_gen,
               'resource_types': ['dashboard']
               }
}


def includeme(config):
    """Add the application's view handlers.
    """
    # dashboards API
    config.add_route('dashboards_no_id', '/dashboards')
    config.add_route('dashboards', '/dashboards/{resource_id}',
                     factory='ae_charting_ee.security.DashboardFactory')
    config.add_route('dashboards_property', '/dashboards/{resource_id}/{key}',
                     factory='ae_charting_ee.security.DashboardFactory')

    # charts API
    config.add_route('charts_no_id', '/charts')
    config.add_route('charts', '/charts/{chart_id}',
                     factory='ae_charting_ee.security.ChartFactory')
    config.add_route('charts_property', '/charts/{chart_id}/{key}',
                     factory='ae_charting_ee.security.ChartFactory')

    # chart event rules API
    config.add_route('charts_event_rules_no_id', '/charts_event_rules',
                     factory='ae_charting_ee.security.ChartFactory')
    config.add_route('charts_event_rules', '/charts_event_rules/{rule_id}',
                     factory='ae_charting_ee.security.ChartAlertFactory')

    config.register_appenlight_plugin(
        PLUGIN_DEFINITION['name'],
        PLUGIN_DEFINITION['config']
    )
    config.scan('ae_charting_ee',
                ignore=['ae_charting_ee.scripts'])
