from pydantic import UUID4
from datetime import date

from .theme import ThemeGet
from .base import Base


class AttemptCreate(Base):
    image_name: str


class AttemptGet(Base):
    id: UUID4
    image_name: str
    caption: str
    score: float
    created: date

    user_id: UUID4
    theme_id: UUID4
    theme: ThemeGet
