import math
import random
import string
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cart import CartItem
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderResponse, OrderListResponse
from app.core.deps import get_current_user
from app.config import settings
from app.models.user import User
from decimal import Decimal

router = APIRouter(prefix="/orders", tags=["Orders"])

VALID_PAYMENT_METHODS = ["online_banking", "bank_transfer", "credit_card", "debit_card", "ewallet"]
VALID_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"]


def _generate_order_number() -> str:
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"PC-{suffix}"


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    payload: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.payment_method not in VALID_PAYMENT_METHODS:
        raise HTTPException(status_code=400, detail=f"Invalid payment method. Use one of: {VALID_PAYMENT_METHODS}")

    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Validate stock
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id, Product.is_active == True).first()
        if not product:
            raise HTTPException(status_code=400, detail=f"Product no longer available")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")

    subtotal = Decimal("0.00")
    for item in cart_items:
        product = item.product
        price = product.sale_price if product.sale_price else product.price
        subtotal += price * item.quantity

    shipping_fee = (
        Decimal("0.00")
        if subtotal >= Decimal(str(settings.FREE_SHIPPING_THRESHOLD))
        else Decimal(str(settings.STANDARD_SHIPPING_FEE))
    )

    # Generate unique order number
    while True:
        order_number = _generate_order_number()
        if not db.query(Order).filter(Order.order_number == order_number).first():
            break

    order = Order(
        order_number=order_number,
        user_id=current_user.id,
        status="pending",
        total_amount=subtotal + shipping_fee,
        shipping_fee=shipping_fee,
        full_name=payload.full_name,
        phone=payload.phone,
        address=payload.address,
        city=payload.city,
        state=payload.state,
        postal_code=payload.postal_code,
        payment_method=payload.payment_method,
        payment_status="pending",
        notes=payload.notes,
    )
    db.add(order)
    db.flush()

    for item in cart_items:
        product = item.product
        price = product.sale_price if product.sale_price else product.price
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            product_image=product.images[0] if product.images else None,
            quantity=item.quantity,
            unit_price=price,
        )
        db.add(order_item)
        product.stock -= item.quantity

    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    db.refresh(order)
    return order


@router.get("", response_model=OrderListResponse)
def list_my_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    q = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc())
    total = q.count()
    orders = q.offset((page - 1) * page_size).limit(page_size).all()
    return OrderListResponse(
        items=orders,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 1,
    )


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/{order_id}/cancel")
def cancel_order(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == current_user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status not in ("pending", "paid"):
        raise HTTPException(status_code=400, detail="Order cannot be cancelled at this stage")

    # Restore stock
    for item in order.items:
        if item.product:
            item.product.stock += item.quantity

    order.status = "cancelled"
    db.commit()
    return {"message": "Order cancelled successfully"}
