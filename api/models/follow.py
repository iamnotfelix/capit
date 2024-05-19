from pydantic import UUID4
from datetime import datetime

from .base import Base


class FollowCreate(Base):
    following_id: UUID4


class FollowGet(Base):
    id: UUID4
    created: datetime

    follower_id: UUID4
    following_id: UUID4


class FollowerGetUser(Base):
    follower_id: UUID4
    created: datetime


class FollowingGetUser(Base):
    following_id: UUID4
    created: datetime
