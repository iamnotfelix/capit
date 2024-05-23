from pydantic import UUID4
from datetime import date
from .base import Base
from .follow import FollowerGetUser, FollowingGetUser


class UserGet(Base):
    id: UUID4
    username: str
    email: str
    score: float
    allowed_attempts: int
    is_admin: bool
    created: date
    profile_image: str
    followers: list[FollowerGetUser]
    followings: list[FollowingGetUser]


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
    profile_image: str


class UserGetFollow(Base):
    id: UUID4
    username: str


class UserUpdateProfileImage(Base):
    profile_image: str
