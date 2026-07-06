from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel


class CartItemAdd(BaseModel):
    product_id: UUID
    quantity: int = 1


class CartItemUpdate(BaseModel):
    quantity: int


class CartProductInfo(BaseModel):
    id: UUID
    name: str
    slug: str
    price: Decimal
    sale_price: Decimal | None
    effective_price: Decimal
    images: list[str]
    stock: int
    weight: str | None

    class Config:
        from_attributes = True


class CartItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    quantity: int
    product: CartProductInfo

    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: list[CartItemResponse]
    subtotal: Decimal
    shipping_fee: Decimal
    total: Decimal
    item_count: int
