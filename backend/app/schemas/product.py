from datetime import datetime
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel, field_validator


class ProductBase(BaseModel):
    name: str
    slug: str
    description: str | None = None
    short_description: str | None = None
    price: Decimal
    sale_price: Decimal | None = None
    stock: int = 0
    weight: str | None = None
    category_id: UUID | None = None
    images: list[str] = []
    tags: list[str] = []
    health_benefits: list[str] = []
    is_featured: bool = False
    is_active: bool = True

    @field_validator("price")
    @classmethod
    def validate_price(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Price must be greater than 0")
        return v


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    short_description: str | None = None
    price: Decimal | None = None
    sale_price: Decimal | None = None
    stock: int | None = None
    weight: str | None = None
    category_id: UUID | None = None
    images: list[str] | None = None
    tags: list[str] | None = None
    health_benefits: list[str] | None = None
    is_featured: bool | None = None
    is_active: bool | None = None


class CategoryInfo(BaseModel):
    id: UUID
    name: str
    slug: str

    class Config:
        from_attributes = True


class ProductResponse(ProductBase):
    id: UUID
    category: CategoryInfo | None = None
    average_rating: float = 0.0
    review_count: int = 0
    effective_price: Decimal
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
