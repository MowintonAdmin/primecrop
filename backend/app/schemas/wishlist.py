from pydantic import BaseModel
from uuid import UUID


class WishlistToggleRequest(BaseModel):
    product_id: str


class WishlistProductInfo(BaseModel):
    id: UUID
    name: str
    slug: str
    price: float
    sale_price: float | None = None
    effective_price: float
    images: list = []
    stock: int = 0
    average_rating: float = 0.0
    review_count: int = 0

    class Config:
        from_attributes = True


class WishlistItemResponse(BaseModel):
    id: str
    product_id: str
    product: WishlistProductInfo
    created_at: str