from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class ReviewCreate(BaseModel):
    rating: int
    comment: str | None = None


class ReviewerInfo(BaseModel):
    full_name: str | None
    id: UUID

    class Config:
        from_attributes = True


class ReviewResponse(BaseModel):
    id: UUID
    product_id: UUID
    user_id: UUID
    rating: int
    comment: str | None
    is_approved: bool
    created_at: datetime
    user: ReviewerInfo | None = None

    class Config:
        from_attributes = True
