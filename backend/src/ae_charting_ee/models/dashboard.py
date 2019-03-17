# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

import sqlalchemy as sa

from sqlalchemy.dialects.postgresql import JSON
from pyramid.threadlocal import get_current_request

from appenlight.models import Resource
from ae_charting_ee.models.dashboard_chart import DashboardChart
from appenlight.lib.utils import gen_uuid


class Dashboard(Resource):
    __tablename__ = "ae_charting_ee_dashboards"
    __mapper_args__ = {"polymorphic_identity": "dashboard"}

    # lists configurable possible permissions for this resource type
    __possible_permissions__ = ("view", "update")

    resource_id = sa.Column(
        sa.Integer(),
        sa.ForeignKey("resources.resource_id", onupdate="CASCADE", ondelete="CASCADE"),
        primary_key=True,
    )

    uuid = sa.Column(sa.String(), default=gen_uuid)
    public = sa.Column(sa.Boolean(), default=False, nullable=False)
    description = sa.Column(sa.UnicodeText, nullable=False, default="")
    layout_config = sa.Column(JSON(), default=[], nullable=False)

    charts = sa.orm.relationship(
        "DashboardChart",
        cascade="all, delete-orphan",
        passive_deletes=True,
        passive_updates=True,
        lazy="dynamic",
    )

    def get_dict(self, *args, **kwargs):
        request = kwargs.pop("request", None)
        result = super(Dashboard, self).get_dict(*args, **kwargs)
        result["chart_config"] = {}
        result["public_url"] = self.get_public_url(request=request)
        for chart in self.charts:
            chart.migrate_json_config()
            result["chart_config"][chart.uuid] = chart.get_dict()
        return result

    def get_public_url(self, request=None, _app_url=None):
        """
        Returns url that user can use to visit specific report
        """
        if not request:
            request = get_current_request()
        url = request.route_url("/", _app_url=_app_url)
        return (url + "#/dashboard/{}").format(self.uuid)

    def get_chart(self, uuid):
        return self.charts.filter(DashboardChart.uuid == uuid).first()
