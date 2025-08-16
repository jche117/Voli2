"""Backfill NULL is_active values and enforce NOT NULL/default

Revision ID: b7c9d2e1f234
Revises: a1b2c3d4e5f6
Create Date: 2025-08-14
"""
from alembic import op
import sqlalchemy as sa

revision = 'b7c9d2e1f234'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    dialect = conn.dialect.name
    # Backfill any NULL values
    conn.execute(sa.text("UPDATE users SET is_active = TRUE WHERE is_active IS NULL"))
    # Enforce default + not null where supported
    if dialect not in ("sqlite",):
        op.execute(sa.text("ALTER TABLE users ALTER COLUMN is_active SET DEFAULT TRUE"))
        op.execute(sa.text("ALTER TABLE users ALTER COLUMN is_active SET NOT NULL"))


def downgrade() -> None:
    conn = op.get_bind()
    dialect = conn.dialect.name
    if dialect not in ("sqlite",):
        op.execute(sa.text("ALTER TABLE users ALTER COLUMN is_active DROP NOT NULL"))
        op.execute(sa.text("ALTER TABLE users ALTER COLUMN is_active DROP DEFAULT"))
