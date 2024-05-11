from pydantic import UUID4
from datetime import date
from .base import Base


class AttemptInDB(Base):
    id: UUID4
    image_name: str
    caption: str
    score: float
    created: date

    user_id: UUID4

    class Config:
        orm_mode = True


class AttemptCreate(Base):
    image_name: str


class AttemptGet(Base):
    id: UUID4
    image_name: str
    caption: str
    score: float
    created: date

    user_id: UUID4
