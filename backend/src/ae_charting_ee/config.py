# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

import pkg_resources
from datetime import timedelta


def url_gen(request):
    urls = {
        "dashboards": request.route_url(
            "dashboards", resource_id="REPLACE_RID"
        ).replace("REPLACE_RID", ":resourceId"),
        "dashboardsNoId": request.route_url("dashboards_no_id"),
        "dashboardsProperty": request.route_url(
            "dashboards_property", key="REPLACE_KEY", resource_id="REPLACE_RID"
        )
        .replace("REPLACE_KEY", ":key")
        .replace("REPLACE_RID", ":resourceId"),
        "charts": request.route_url("charts", chart_id="REPLACE_CID").replace(
            "REPLACE_CID", ":chartId"
        ),
        "chartsNoId": request.route_url("charts_no_id"),
        "chartsProperty": request.route_url(
            "charts_property", key="REPLACE_KEY", chart_id="REPLACE_CID"
        )
        .replace("REPLACE_KEY", ":key")
        .replace("REPLACE_CID", ":chartId"),
        "chartsEventRules": request.route_url(
            "charts_event_rules", rule_id="REPLACE_CID"
        ).replace("REPLACE_CID", ":ruleId"),
        "chartsEventRulesNoId": request.route_url("charts_event_rules_no_id"),
    }
    return urls


PLUGIN_DEFINITION = {
    "name": "ae_charting_ee",
    "config": {
        "celery_tasks": ["ae_charting_ee.celery.tasks"],
        "celery_beats": [
            (
                "alerting_charts",
                {
                    "task": "ae_charting_ee.celery.tasks.alerting_charts",
                    "schedule": timedelta(seconds=60),
                },
            )
        ],
        "fulltext_indexer": None,
        "sqlalchemy_migrations": "ae_charting_ee:migrations",
        "default_values_setter": None,
        "javascript": {
            "src": "ae_charting_ee.js",
            "angular_module": "appenlight.plugins.ae_charting_ee",
        },
        "static": pkg_resources.resource_filename("ae_charting_ee", "static"),
        "url_gen": url_gen,
        "resource_types": ["dashboard"],
    },
}


def includeme(config):
    """Add the application's view handlers.
    """
    from ae_charting_ee.models.dashboard import Dashboard
    from ae_charting_ee.models.dashboard_chart import DashboardChart

    # dashboards API
    config.add_route("dashboards_no_id", "/dashboards")
    config.add_route(
        "dashboards",
        "/dashboards/{resource_id}",
        factory="ae_charting_ee.security.DashboardFactory",
    )
    config.add_route(
        "dashboards_property",
        "/dashboards/{resource_id}/{key}",
        factory="ae_charting_ee.security.DashboardFactory",
    )

    # charts API
    config.add_route("charts_no_id", "/charts")
    config.add_route(
        "charts", "/charts/{chart_id}", factory="ae_charting_ee.security.ChartFactory"
    )
    config.add_route(
        "charts_property",
        "/charts/{chart_id}/{key}",
        factory="ae_charting_ee.security.ChartFactory",
    )

    # chart event rules API
    config.add_route(
        "charts_event_rules_no_id",
        "/charts_event_rules",
        factory="ae_charting_ee.security.ChartFactory",
    )
    config.add_route(
        "charts_event_rules",
        "/charts_event_rules/{rule_id}",
        factory="ae_charting_ee.security.ChartAlertFactory",
    )

    config.register_appenlight_plugin(
        PLUGIN_DEFINITION["name"], PLUGIN_DEFINITION["config"]
    )

    config.add_view(
        "ae_charting_ee.views.dashboard:index",
        route_name="dashboards_no_id",
        renderer="json",
        permission="authenticated",
        request_method="GET",
    )

    config.add_view(
        "ae_charting_ee.views.dashboard:dashboard_POST",
        route_name="dashboards_no_id",
        renderer="json",
        request_method="POST",
        permission="create_resources",
    )

    config.add_view(
        "ae_charting_ee.views.dashboard:dashboard_PATCH",
        route_name="dashboards",
        renderer="json",
        request_method="PATCH",
        permission="edit",
    )

    config.add_view(
        "ae_charting_ee.views.dashboard:dashboard_GET",
        route_name="dashboards",
        context_type_class=("resource", Dashboard),
        renderer="json",
        request_method="GET",
        permission="view",
    )

    config.add_view(
        "ae_charting_ee.views.dashboard:dashboard_DELETE",
        route_name="dashboards",
        context_type_class=("resource", Dashboard),
        renderer="json",
        request_method="DELETE",
        permission="delete",
    )

    config.add_view(
        "ae_charting_ee.views.dashboard:charts_PATCH",
        route_name="charts",
        request_method="PATCH",
        permission="edit",
        renderer="json",
        context_type_class=("resource", Dashboard),
    )

    config.add_view(
        "ae_charting_ee.views.dashboard:charts_data",
        route_name="charts_property",
        match_param="key=data",
        context_type_class=("resource", Dashboard),
        renderer="json",
        permission="view",
    )

    config.add_view(
        "ae_charting_ee.views.dashboard:charts_data",
        route_name="charts_property",
        match_param="key=data_test_config",
        context_type_class=("resource", Dashboard),
        renderer="json",
        permission="view",
    )

    config.add_view(
        "ae_charting_ee.views.dashboard:charts_data",
        route_name="charts_property",
        match_param="key=data_rule_config",
        context_type_class=("resource", Dashboard),
        renderer="json",
        permission="view",
    )

    config.add_view(
        "ae_charting_ee.views.dashboard:charts_event_rules_POST",
        route_name="charts_event_rules_no_id",
        context_type_class=("chart", DashboardChart),
        request_method="POST",
        renderer="json",
        permission="view",
    )

    config.add_view(
        "ae_charting_ee.views.dashboard:charts_event_rules_GET",
        route_name="charts_event_rules_no_id",
        context_type_class=("chart", DashboardChart),
        request_method="GET",
        renderer="json",
        permission="view",
    )
