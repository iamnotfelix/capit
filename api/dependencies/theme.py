from typing import Annotated
from sqlalchemy.orm import Session
from datetime import datetime, date
from uuid import uuid4, UUID
from fastapi import Depends, HTTPException, status


from .database import get_db
from ..database.models import Theme
from ..models.user import UserGet
from ..models.theme import ThemeCreate


# CRUD

def get_themes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Theme).offset(skip).limit(limit).all()


def get_theme(db: Session, theme_id: UUID):
    return db.query(Theme).filter(Theme.id == theme_id).first()


def get_theme_by_date(db: Session, active_date: date):
    return db.query(Theme).filter(Theme.active_date == active_date).first()


def create_theme(db: Session, theme: ThemeCreate, user: UserGet):

    db_theme = Theme(
        id=uuid4(),
        active_date=theme.active_date,
        main=theme.main,
        all=theme.all,
        user_id=user.id,
    )
    db.add(db_theme)
    db.commit()
    db.refresh(db_theme)

    return db_theme


def delete_theme_by_id(db: Session, theme_id: UUID):
    db_theme = db.query(Theme).filter(Theme.id == theme_id).first()

    if not db_theme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Theme not found")

    db.delete(db_theme)
    db.commit()


# Extra

def get_theme_today(db: Annotated[Session, Depends(get_db)]):
    return db.query(Theme).filter(Theme.active_date == datetime.now().date()).first()
