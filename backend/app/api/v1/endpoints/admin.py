import math
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.order import Order
from app.models.product import Product
from app.models.user import User
from app.models.review import Review
from app.schemas.order import OrderResponse, OrderListResponse, OrderStatusUpdate
from app.schemas.user import UserResponse
from app.core.deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

VALID_ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"]


@router.get("/dashboard/stats")
def get_dashboard_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    from sqlalchemy import func
    from decimal import Decimal

    total_orders = db.query(Order).count()
    total_revenue = db.query(func.sum(Order.total_amount)).filter(
        Order.payment_status == "paid"
    ).scalar() or Decimal("0")
    total_users = db.query(User).filter(User.is_admin == False).count()
    total_products = db.query(Product).filter(Product.is_active == True).count()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    low_stock = db.query(Product).filter(Product.is_active == True, Product.stock <= 10).count()

    recent_orders = (
        db.query(Order)
        .order_by(Order.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total_orders": total_orders,
        "total_revenue": float(total_revenue),
        "total_users": total_users,
        "total_products": total_products,
        "pending_orders": pending_orders,
        "low_stock_products": low_stock,
        "recent_orders": [
            {
                "id": str(o.id),
                "order_number": o.order_number,
                "full_name": o.full_name,
                "total_amount": float(o.total_amount),
                "status": o.status,
                "created_at": o.created_at.isoformat(),
            }
            for o in recent_orders
        ],
    }


@router.get("/orders", response_model=OrderListResponse)
def list_all_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: str | None = None,
    search: str | None = None,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    q = db.query(Order).order_by(Order.created_at.desc())

    if status:
        q = q.filter(Order.status == status)
    if search:
        q = q.filter(
            Order.order_number.ilike(f"%{search}%") |
            Order.full_name.ilike(f"%{search}%") |
            Order.phone.ilike(f"%{search}%")
        )

    total = q.count()
    orders = q.offset((page - 1) * page_size).limit(page_size).all()
    return OrderListResponse(
        items=orders,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 1,
    )


@router.get("/orders/{order_id}", response_model=OrderResponse)
def get_order(order_id: UUID, admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: UUID,
    payload: OrderStatusUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if payload.status not in VALID_ORDER_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status")

    order.status = payload.status
    if payload.payment_status:
        order.payment_status = payload.payment_status
    if payload.payment_reference:
        order.payment_reference = payload.payment_reference
    db.commit()
    db.refresh(order)
    return order


@router.get("/users", response_model=list[UserResponse])
def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = None,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    q = db.query(User).filter(User.is_admin == False).order_by(User.created_at.desc())
    if search:
        q = q.filter(
            User.email.ilike(f"%{search}%") | User.full_name.ilike(f"%{search}%")
        )
    return q.offset((page - 1) * page_size).limit(page_size).all()


@router.put("/users/{user_id}/toggle-status")
def toggle_user_status(
    user_id: UUID,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id, User.is_admin == False).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = not user.is_active
    db.commit()
    return {"message": f"User {'activated' if user.is_active else 'deactivated'}", "is_active": user.is_active}


@router.get("/reviews")
def list_reviews(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    q = db.query(Review).order_by(Review.created_at.desc())
    total = q.count()
    reviews = q.offset((page - 1) * page_size).limit(page_size).all()
    return {
        "items": reviews,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": math.ceil(total / page_size) if total else 1,
    }


@router.put("/reviews/{review_id}/toggle")
def toggle_review(
    review_id: UUID,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.is_approved = not review.is_approved
    db.commit()
    return {"is_approved": review.is_approved}
