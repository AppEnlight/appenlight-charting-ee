# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

from appenlight.models import get_db_session
from ae_charting_ee.models.dashboard_chart import DashboardChart
from appenlight.models.services.base import BaseService


class DashboardChartService(BaseService):
    @classmethod
    def by_uuid(cls, uuid, db_session=None):
        db_session = get_db_session(db_session)
        query = db_session.query(DashboardChart)
        query = query.filter(DashboardChart.uuid == uuid)
        return query.first()
