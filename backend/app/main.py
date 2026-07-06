import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="PrimeCrop - Premium Mushroom E-Commerce API",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.MEDIA_DIR, exist_ok=True)
os.makedirs(f"{settings.MEDIA_DIR}/products", exist_ok=True)

app.mount("/media", StaticFiles(directory=settings.MEDIA_DIR), name="media")

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "name": "PrimeCrop API",
        "version": settings.VERSION,
        "status": "online",
        "domain": "theprimecrop.com",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
