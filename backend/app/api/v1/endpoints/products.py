import math
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.product import Product
from app.models.category import Category
from app.models.review import Review
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductListResponse
from app.schemas.review import ReviewCreate, ReviewResponse
from app.core.deps import get_current_user, get_current_admin, get_optional_user
from app.models.user import User

router = APIRouter(prefix="/products", tags=["Products"])


def _build_product_response(product: Product) -> dict:
    reviews = [r for r in product.reviews if r.is_approved]
    avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0.0
    return {
        **{c.name: getattr(product, c.name) for c in product.__table__.columns},
        "category": product.category,
        "average_rating": round(avg_rating, 1),
        "review_count": len(reviews),
        "effective_price": product.sale_price if product.sale_price else product.price,
    }


@router.get("", response_model=ProductListResponse)
def list_products(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    category: str | None = None,
    search: str | None = None,
    featured: bool | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    sort: str = Query("newest", pattern="^(newest|price_asc|price_desc|rating)$"),
    db: Session = Depends(get_db),
):
    q = db.query(Product).filter(Product.is_active == True)

    if category:
        cat = db.query(Category).filter(Category.slug == category).first()
        if cat:
            q = q.filter(Product.category_id == cat.id)

    if search:
        q = q.filter(Product.name.ilike(f"%{search}%"))

    if featured is not None:
        q = q.filter(Product.is_featured == featured)

    if min_price is not None:
        q = q.filter(Product.price >= min_price)

    if max_price is not None:
        q = q.filter(Product.price <= max_price)

    if sort == "price_asc":
        q = q.order_by(Product.price.asc())
    elif sort == "price_desc":
        q = q.order_by(Product.price.desc())
    else:
        q = q.order_by(Product.created_at.desc())

    total = q.count()
    products = q.offset((page - 1) * page_size).limit(page_size).all()

    return ProductListResponse(
        items=[ProductResponse.model_validate(_build_product_response(p)) for p in products],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 1,
    )


@router.get("/featured", response_model=list[ProductResponse])
def get_featured_products(limit: int = Query(8, ge=1, le=20), db: Session = Depends(get_db)):
    products = (
        db.query(Product)
        .filter(Product.is_active == True, Product.is_featured == True)
        .order_by(Product.created_at.desc())
        .limit(limit)
        .all()
    )
    return [ProductResponse.model_validate(_build_product_response(p)) for p in products]


@router.get("/{slug}", response_model=ProductResponse)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductResponse.model_validate(_build_product_response(product))


@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    existing = db.query(Product).filter(Product.slug == payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")

    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(_build_product_response(product))


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: UUID,
    payload: ProductUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return ProductResponse.model_validate(_build_product_response(product))


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: UUID,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.is_active = False
    db.commit()


@router.get("/{slug}/reviews", response_model=list[ReviewResponse])
def get_product_reviews(slug: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    reviews = db.query(Review).filter(
        Review.product_id == product.id, Review.is_approved == True
    ).order_by(Review.created_at.desc()).all()
    return reviews


@router.post("/{slug}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    slug: str,
    payload: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.slug == slug, Product.is_active == True).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = db.query(Review).filter(
        Review.product_id == product.id, Review.user_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this product")

    if not (1 <= payload.rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    review = Review(
        product_id=product.id,
        user_id=current_user.id,
        rating=payload.rating,
        comment=payload.comment,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review
