from sqlalchemy.orm import Session
from datetime import datetime
from uuid import uuid4, UUID
from fastapi import HTTPException, status

from ..database.models import User
from ..models.user import UserCreate
from . import auth


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def get_user_by_id(db: Session, user_id: UUID):
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = User(
        id=uuid4(),
        username=user.username,
        email=user.email, 
        password=hashed_password,
        score=user.score,
        allowed_attempts=user.allowed_attempts,
        is_admin = user.is_admin,
        created = datetime.now()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user


def delete_user_by_id(db: Session, user_id: UUID):
    db_user = db.query(User).filter(User.id == user_id).first()

    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db.delete(db_user)
    db.commit()


def delete_user_by_username(db: Session, username: str):
    db_user = db.query(User).filter(User.username == username).first()

    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db.delete(db_user)
    db.commit()
