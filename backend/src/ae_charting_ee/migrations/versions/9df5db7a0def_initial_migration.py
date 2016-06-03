# -*- coding: utf-8 -*-

# Published under Commercial License.
# Read the full license text at https://rhodecode.com/licenses.

"""initial_migration

Revision ID: 9df5db7a0def
Revises: 
Create Date: 2016-03-24 12:55:47.148578

"""

# revision identifiers, used by Alembic.
revision = '9df5db7a0def'
down_revision = None
branch_labels = None
depends_on = None

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table

def upgrade():
    op.create_table(
        'ae_charting_ee_dashboards',
        sa.Column('resource_id', sa.Integer(),
                  sa.ForeignKey('resources.resource_id', onupdate='cascade',
                                ondelete='cascade'), nullable=False,
                  primary_key=True, autoincrement=False),
        sa.Column('description', sa.UnicodeText, nullable=False, server_default=''),
        sa.Column('uuid', sa.Unicode(40), nullable=False, index=True),
        sa.Column('layout_config', sa.dialects.postgresql.JSON, nullable=False),
        sa.Column('public', sa.Boolean(), server_default="false", nullable=False)
    )

    op.create_table(
        'ae_charting_ee_dashboards_charts',
        sa.Column('uuid', sa.Unicode(40), nullable=False, primary_key=True),
        sa.Column('resource_id', sa.Integer(),
                  sa.ForeignKey('resources.resource_id', onupdate='cascade',
                                ondelete='cascade'), nullable=False),
        sa.Column('config', sa.dialects.postgresql.JSON, nullable=False),
        sa.Column('name', sa.Unicode(255)),
        sa.Column('json_config_version', sa.Integer, nullable=False,
                  server_default='0'),
    )


def downgrade():
    pass
