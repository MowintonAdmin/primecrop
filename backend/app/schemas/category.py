from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str | None = None
    image_url: str | None = None
    is_active: bool = True
    sort_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    image_url: str | None = None
    is_active: bool | None = None
    sort_order: int | None = None


class CategoryResponse(CategoryBase):
    id: UUID
    created_at: datetime
    product_count: int = 0

    class Config:
        from_attributes = True
