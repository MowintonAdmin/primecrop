from datetime import datetime
from decimal import Decimal
from uuid import UUID
from pydantic import BaseModel


class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int


class OrderCreate(BaseModel):
    full_name: str
    phone: str
    address: str
    city: str
    state: str
    postal_code: str
    payment_method: str
    notes: str | None = None


class OrderItemResponse(BaseModel):
    id: UUID
    product_id: UUID | None
    product_name: str
    product_image: str | None
    quantity: int
    unit_price: Decimal

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: UUID
    order_number: str
    status: str
    total_amount: Decimal
    shipping_fee: Decimal
    full_name: str
    phone: str
    address: str
    city: str
    state: str
    postal_code: str
    payment_method: str
    payment_status: str
    payment_reference: str | None
    notes: str | None
    items: list[OrderItemResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: str
    payment_status: str | None = None
    payment_reference: str | None = None


class OrderListResponse(BaseModel):
    items: list[OrderResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
