from pydantic import UUID4
from datetime import date
from .base import Base


class ThemeInDB(Base):
    id: UUID4
    active_date: date
    main: str
    all: str
    user_id: UUID4

    class Config:
        from_attributes = True


class ThemeGet(Base):
    id: UUID4
    active_date: date
    main: str
    all: str
    user_id: UUID4


class ThemeCreate(Base):
    active_date: date
    main: str
    all: str
