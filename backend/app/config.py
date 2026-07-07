import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "PrimeCrop API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    DB_HOST: str = os.getenv("DB_HOST", "db")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_USER: str = os.getenv("DB_USER", "primecrop")
    DB_PASS: str = os.getenv("DB_PASS", "primecrop_pass")
    DB_NAME: str = os.getenv("DB_NAME", "primecrop_db")

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    SECRET_KEY: str = os.getenv("SECRET_KEY", "primecrop-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@theprimecrop.com")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "PrimeCrop@Admin2026!")
    ADMIN_NAME: str = "PrimeCrop Admin"

    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""

    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://theprimecrop.com",
        "https://www.theprimecrop.com",
        "https://admin.theprimecrop.com",
    ]

    MEDIA_DIR: str = "/app/media"
    MAX_UPLOAD_SIZE_MB: int = 5

    FREE_SHIPPING_THRESHOLD: float = 200.0  # RM 200
    STANDARD_SHIPPING_FEE: float = 10.0     # RM 10

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
