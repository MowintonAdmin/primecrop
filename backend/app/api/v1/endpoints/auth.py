import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from sqlalchemy import func
from decimal import Decimal

from app.database import get_db
from app.models.user import User
from app.models.order import Order
from app.models.product import Product
from app.models.wishlist import WishlistItem
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, GoogleAuthRequest
from app.schemas.user import UserResponse, UserUpdateRequest, ChangePasswordRequest
from app.core.security import hash_password, verify_password, create_access_token
from app.core.deps import get_current_user
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)
GOOGLE_TOKEN_CLOCK_SKEW_SECONDS = 60


@router.post("/google", response_model=TokenResponse)
def google_auth(payload: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Authenticate or register via Google OAuth."""
    try:
        id_info = id_token.verify_oauth2_token(
            payload.id_token,
            google_requests.Request(),
            None,
            clock_skew_in_seconds=GOOGLE_TOKEN_CLOCK_SKEW_SECONDS,
        )
    except ValueError as exc:
        logger.warning("Google token verification failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")

    configured_client_id = settings.GOOGLE_CLIENT_ID.strip()
    if not configured_client_id:
        raise HTTPException(status_code=500, detail="Google OAuth is not configured")

    token_audience = id_info.get("aud")
    allowed_audience = False
    if isinstance(token_audience, str):
        allowed_audience = token_audience == configured_client_id
    elif isinstance(token_audience, list):
        allowed_audience = configured_client_id in token_audience

    if not allowed_audience:
        logger.warning(
            "Google token audience mismatch: expected=%s aud=%s",
            configured_client_id, token_audience,
        )
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")

    google_id = id_info["sub"]
    email = id_info.get("email", "")
    full_name = id_info.get("name", "")

    # Check by google_id first, then by email
    user = db.query(User).filter(User.google_id == google_id).first()
    if not user:
        user = db.query(User).filter(User.email == email).first()
        if user:
            user.google_id = google_id
        else:
            user = User(
                email=email,
                full_name=full_name,
                google_id=google_id,
                is_active=True,
                is_admin=False,
            )
            db.add(user)

    # Update name from Google if not set
    if full_name and not user.full_name:
        user.full_name = full_name
    user.google_id = google_id

    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id))
    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        is_admin=user.is_admin,
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name,
        phone=payload.phone,
        is_active=True,
        is_admin=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(str(user.id))
    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        is_admin=user.is_admin,
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.password_hash:
        raise HTTPException(status_code=401, detail="This account uses Google Sign-In. Please sign in with Google.")
    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")

    token = create_access_token(str(user.id))
    return TokenResponse(
        access_token=token,
        user_id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        is_admin=user.is_admin,
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserResponse)
def update_me(
    payload: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me/stats")
def get_my_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_orders = db.query(Order).filter(Order.user_id == current_user.id).count()
    total_spent = db.query(func.sum(Order.total_amount)).filter(
        Order.user_id == current_user.id,
        Order.payment_status.in_(["paid", "delivered"]),
    ).scalar() or Decimal("0")
    total_wishlist = db.query(WishlistItem).filter(WishlistItem.user_id == current_user.id).count()
    total_reviews = db.query(Product).filter(Order.user_id == current_user.id).count()  # placeholder

    return {
        "total_orders": total_orders,
        "total_spent": float(total_spent),
        "total_wishlist": total_wishlist,
        "member_since": current_user.created_at.isoformat() if current_user.created_at else None,
    }


@router.put("/me/password")
def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(payload.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    if len(payload.new_password) < 8:
        raise HTTPException(status_code=400, detail="New password must be at least 8 characters")
    current_user.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}
