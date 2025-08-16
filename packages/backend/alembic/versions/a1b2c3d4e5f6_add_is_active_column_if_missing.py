"""Ensure is_active column exists on users

Revision ID: a1b2c3d4e5f6
Revises: f1d2d2f924ab
Create Date: 2025-08-14
"""
from alembic import op
import sqlalchemy as sa

revision = 'a1b2c3d4e5f6'
down_revision = 'f1d2d2f924ab'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add is_active if it does not exist
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [c['name'] for c in inspector.get_columns('users')]
    if 'is_active' not in columns:
        with op.batch_alter_table('users') as batch_op:
            batch_op.add_column(sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()))
        # Backfill existing rows to TRUE (server_default handles new inserts)
        conn.execute(sa.text("UPDATE users SET is_active = TRUE WHERE is_active IS NULL"))


def downgrade() -> None:
    # Only drop if present to be safe
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    columns = [c['name'] for c in inspector.get_columns('users')]
    if 'is_active' in columns:
        with op.batch_alter_table('users') as batch_op:
            batch_op.drop_column('is_active')
