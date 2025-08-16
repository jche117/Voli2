"""Remove is_admin column and migrate legacy admins to role

Revision ID: f1d2d2f924ab
Revises: e8d3512e374a
Create Date: 2025-08-14
"""

from alembic import op
import sqlalchemy as sa

revision = 'f1d2d2f924ab'
down_revision = 'e8d3512e374a'
branch_labels = None
depends_on = None

def upgrade() -> None:
    conn = op.get_bind()
    # Ensure administrator role exists
    result = conn.execute(sa.text("SELECT id FROM roles WHERE name='administrator'"))
    role_id = result.scalar()
    if not role_id:
        conn.execute(sa.text("INSERT INTO roles (name, description) VALUES ('administrator', 'System administrator')"))
        role_id = conn.execute(sa.text("SELECT id FROM roles WHERE name='administrator'")) .scalar()
    # Migrate users with is_admin TRUE to have administrator role
    conn.execute(sa.text("""
        INSERT INTO user_roles (user_id, role_id)
        SELECT u.id, :role_id FROM users u
        WHERE u.is_admin = TRUE
          AND NOT EXISTS (
              SELECT 1 FROM user_roles ur WHERE ur.user_id = u.id AND ur.role_id = :role_id
          )
    """), {"role_id": role_id})
    # Drop the legacy column
    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_column('is_admin')

def downgrade() -> None:
    # Re-add is_admin column
    with op.batch_alter_table('users') as batch_op:
        batch_op.add_column(sa.Column('is_admin', sa.Boolean(), nullable=True))
    conn = op.get_bind()
    # Set is_admin TRUE for users having administrator role
    conn.execute(sa.text("""
        UPDATE users SET is_admin = TRUE
        WHERE id IN (
            SELECT ur.user_id FROM user_roles ur
            JOIN roles r ON r.id = ur.role_id
            WHERE r.name = 'administrator'
        )
    """))
