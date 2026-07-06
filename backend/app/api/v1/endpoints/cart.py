from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cart import CartItem
from app.models.product import Product
from app.schemas.cart import CartItemAdd, CartItemUpdate, CartResponse, CartItemResponse, CartProductInfo
from app.core.deps import get_current_user
from app.config import settings
from app.models.user import User

router = APIRouter(prefix="/cart", tags=["Cart"])


def _build_cart_response(cart_items: list[CartItem]) -> CartResponse:
    items_out = []
    subtotal = Decimal("0.00")

    for item in cart_items:
        product = item.product
        effective_price = product.sale_price if product.sale_price else product.price
        subtotal += effective_price * item.quantity

        product_info = CartProductInfo(
            id=product.id,
            name=product.name,
            slug=product.slug,
            price=product.price,
            sale_price=product.sale_price,
            effective_price=effective_price,
            images=product.images or [],
            stock=product.stock,
            weight=product.weight,
        )
        items_out.append(CartItemResponse(
            id=item.id,
            product_id=product.id,
            quantity=item.quantity,
            product=product_info,
        ))

    shipping_fee = (
        Decimal("0.00")
        if subtotal >= Decimal(str(settings.FREE_SHIPPING_THRESHOLD))
        else Decimal(str(settings.STANDARD_SHIPPING_FEE))
    )

    return CartResponse(
        items=items_out,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total=subtotal + shipping_fee,
        item_count=sum(i.quantity for i in cart_items),
    )


@router.get("", response_model=CartResponse)
def get_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    return _build_cart_response(cart_items)


@router.post("/items", response_model=CartResponse)
def add_to_cart(
    payload: CartItemAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == payload.product_id, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.stock < payload.quantity:
        raise HTTPException(status_code=400, detail=f"Only {product.stock} items in stock")

    existing = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == payload.product_id,
    ).first()

    if existing:
        new_qty = existing.quantity + payload.quantity
        if product.stock < new_qty:
            raise HTTPException(status_code=400, detail=f"Only {product.stock} items in stock")
        existing.quantity = new_qty
    else:
        item = CartItem(
            user_id=current_user.id,
            product_id=payload.product_id,
            quantity=payload.quantity,
        )
        db.add(item)

    db.commit()
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    return _build_cart_response(cart_items)


@router.put("/items/{item_id}", response_model=CartResponse)
def update_cart_item(
    item_id: str,
    payload: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(CartItem).filter(
        CartItem.id == item_id, CartItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    if payload.quantity <= 0:
        db.delete(item)
    else:
        if item.product.stock < payload.quantity:
            raise HTTPException(status_code=400, detail=f"Only {item.product.stock} items in stock")
        item.quantity = payload.quantity

    db.commit()
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    return _build_cart_response(cart_items)


@router.delete("/items/{item_id}", response_model=CartResponse)
def remove_cart_item(
    item_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(CartItem).filter(
        CartItem.id == item_id, CartItem.user_id == current_user.id
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    return _build_cart_response(cart_items)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_cart(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
