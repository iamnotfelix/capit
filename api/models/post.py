from pydantic import UUID4
from datetime import date

from .theme import ThemeGetPost
from .user import UserGetPost
from .base import Base


class PostCreate(Base):
    attempt_id: UUID4


class PostGet(Base):
    id: UUID4
    image_name: str
    caption: str
    score: float
    created: date

    user_id: UUID4
    theme_id: UUID4
    theme: ThemeGetPost
    user: UserGetPost
