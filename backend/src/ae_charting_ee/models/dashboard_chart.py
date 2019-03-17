# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

import copy
import sqlalchemy as sa

from sqlalchemy.dialects.postgresql import JSON
from ziggurat_foundations.models.base import BaseModel

from appenlight.models import Base

CURRENT_JSON_VERSION = 1


class DashboardChart(Base, BaseModel):
    __tablename__ = "ae_charting_ee_dashboards_charts"

    uuid = sa.Column(sa.Unicode(40), nullable=False, primary_key=True)
    resource_id = sa.Column(
        sa.Integer(),
        sa.ForeignKey("resources.resource_id", onupdate="cascade", ondelete="cascade"),
        nullable=False,
    )
    config = sa.Column(JSON, nullable=False)
    name = sa.Column(sa.Unicode(255), default="Chart title")
    json_config_version = sa.Column(
        sa.Integer, default=CURRENT_JSON_VERSION, nullable=False
    )

    dashboard = sa.orm.relationship(
        "Dashboard", passive_deletes=True, passive_updates=True, lazy="joined"
    )

    def migrate_json_config(self):
        if self.config is None:
            return
        if self.json_config_version == 0:
            tmp_config = copy.deepcopy(self.config)
            tmp_config["postProcess"] = {"type": None, "config": {}}
            self.config = None
            self.config = tmp_config
            self.json_config_version = 1
        if self.json_config_version == 1:
            tmp_config = copy.deepcopy(self.config)
            if "selectedApp" in tmp_config:
                tmp_config["resource"] = tmp_config.pop("selectedApp")
            self.config = None
            self.config = tmp_config
            self.json_config_version = 2
        if self.json_config_version == 2:
            tmp_config = copy.deepcopy(self.config)
            if "datasource" not in tmp_config:
                tmp_config["datasource"] = "logs"
            self.config = None
            self.config = tmp_config
            self.json_config_version = 3
