from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.core.security import hash_password
from app.config import settings


def bootstrap_admin():
    db: Session = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                email=settings.ADMIN_EMAIL,
                password_hash=hash_password(settings.ADMIN_PASSWORD),
                full_name=settings.ADMIN_NAME,
                is_active=True,
                is_admin=True,
            )
            db.add(admin)
            db.commit()
            print(f"[PrimeCrop] Admin user created: {settings.ADMIN_EMAIL}")
        else:
            print(f"[PrimeCrop] Admin user already exists: {settings.ADMIN_EMAIL}")
    finally:
        db.close()
