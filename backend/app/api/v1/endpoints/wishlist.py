from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database import get_db
from app.models.user import User
from app.models.product import Product
from app.models.wishlist import WishlistItem
from app.schemas.wishlist import WishlistItemResponse, WishlistToggleRequest
from app.core.deps import get_current_user

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("", response_model=list[WishlistItemResponse])
def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == current_user.id)
        .order_by(WishlistItem.created_at.desc())
        .all()
    )
    return [
        WishlistItemResponse(
            id=str(item.id),
            product_id=str(item.product_id),
            product=item.product,
            created_at=item.created_at.isoformat(),
        )
        for item in items
    ]


@router.post("/toggle", response_model=WishlistItemResponse | None)
def toggle_wishlist(
    payload: WishlistToggleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == payload.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == payload.product_id,
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return None  # Removed from wishlist
    else:
        item = WishlistItem(user_id=current_user.id, product_id=payload.product_id)
        db.add(item)
        db.commit()
        db.refresh(item)
        return WishlistItemResponse(
            id=str(item.id),
            product_id=str(item.product_id),
            product=item.product,
            created_at=item.created_at.isoformat(),
        )


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_wishlist(
    product_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(WishlistItem).filter(
        WishlistItem.user_id == current_user.id,
        WishlistItem.product_id == product_id,
    ).first()
    if item:
        db.delete(item)
        db.commit()