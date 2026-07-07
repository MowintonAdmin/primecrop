"""Add wishlist_items table and profile_photo_url

Revision ID: 0003
Revises: 0002
Create Date: 2026-07-07
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, UUID as PGUUID
import uuid

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add profile_photo_url to users
    op.add_column("users", sa.Column("profile_photo_url", sa.String(500), nullable=True))

    # Create wishlist_items table
    op.create_table(
        "wishlist_items",
        sa.Column("id", PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4),
        sa.Column("user_id", PGUUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("product_id", PGUUID(as_uuid=True), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("NOW()")),
    )
    op.create_index("ix_wishlist_user_product", "wishlist_items", ["user_id", "product_id"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_wishlist_user_product", table_name="wishlist_items")
    op.drop_table("wishlist_items")
    op.drop_column("users", "profile_photo_url")