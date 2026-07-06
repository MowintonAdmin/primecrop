import uuid
from sqlalchemy import Boolean, Column, DateTime, String, Text, Integer, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    short_description = Column(String(500), nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    sale_price = Column(Numeric(10, 2), nullable=True)
    stock = Column(Integer, default=0, nullable=False)
    weight = Column(String(50), nullable=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    images = Column(JSONB, default=list)
    tags = Column(JSONB, default=list)
    health_benefits = Column(JSONB, default=list)
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")

    @property
    def effective_price(self):
        return self.sale_price if self.sale_price else self.price

    @property
    def average_rating(self):
        approved = [r for r in self.reviews if r.is_approved]
        if not approved:
            return 0.0
        return sum(r.rating for r in approved) / len(approved)

    @property
    def review_count(self):
        return len([r for r in self.reviews if r.is_approved])
