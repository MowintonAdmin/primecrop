"""Add google_id and make password_hash nullable for Google OAuth

Revision ID: 0002
Revises: 0001
Create Date: 2026-07-07
"""
from alembic import op
import sqlalchemy as sa

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Make password_hash nullable for Google OAuth users
    op.alter_column("users", "password_hash", nullable=True)

    # Add google_id column
    op.add_column("users", sa.Column("google_id", sa.String(255), nullable=True))
    op.create_index("ix_users_google_id", "users", ["google_id"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_users_google_id", table_name="users")
    op.drop_column("users", "google_id")
    op.alter_column("users", "password_hash", nullable=False)