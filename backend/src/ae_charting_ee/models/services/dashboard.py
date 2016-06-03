# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

from appenlight.models import get_db_session
from ae_charting_ee.models.dashboard import Dashboard
from appenlight.models.services.base import BaseService


class DashboardService(BaseService):
    @classmethod
    def by_uuid(cls, uuid, db_session=None):
        db_session = get_db_session(db_session)
        query = db_session.query(Dashboard).filter(Dashboard.uuid == uuid)
        return query.first()
