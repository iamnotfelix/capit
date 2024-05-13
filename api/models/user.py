from pydantic import UUID4
from datetime import date
from .base import Base


class UserGet(Base):
    id: UUID4
    username: str
    email: str
    score: float
    allowed_attempts: int
    is_admin: bool
    created: date


class UserCreate(Base):
    username: str
    email: str
    password: str
    score: float
    allowed_attempts: int
    is_admin: bool


class UserSignUp(Base):
    username: str
    email: str
    password: str


class UserGetPost(Base):
    id: UUID4
    username: str
