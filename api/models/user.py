from pydantic import UUID4
from datetime import date
from .base import Base


class UserInDB(Base):
    id: UUID4
    username: str
    email: str
    password: str
    score: float
    allowed_attempts: int
    is_admin: bool
    created: date

    class Config:
        orm_mode = True


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
