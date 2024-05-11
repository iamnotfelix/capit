from sqlalchemy.orm import Session
from datetime import datetime
from uuid import uuid4, UUID
from fastapi import HTTPException, status

from ..database.models import Attempt
from ..models.user import UserGet
from ..models.attempt import AttemptCreate
from ..ml.caption import ImageCaptioner


def get_attempts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Attempt).offset(skip).limit(limit).all()


def get_attempts_by_date(db: Session, user_id: UUID, date: datetime):
    return db.query(Attempt).filter(Attempt.user_id == user_id).filter(Attempt.created == date.date()).all()

def get_attempt(db: Session, attempt_id: UUID, user_id: UUID):
    db_attempt = db.query(Attempt).filter(Attempt.id == attempt_id).first()
    if db_attempt and db_attempt.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permission.")
    return db_attempt


def get_user_by_image_name(db: Session, image_name: str, user_id: UUID):
    db_attempt = db.query(Attempt).filter(Attempt.image_name == image_name).first()
    if db_attempt and db_attempt.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permission.")
    return db_attempt


def create_attempt(db: Session, model: ImageCaptioner, attempt: AttemptCreate, user: UserGet):
    caption = model(attempt.image_name, 3)

    db_attempt = Attempt(
        id=uuid4(),
        image_name=attempt.image_name,
        caption=caption, 
        score=0, #TODO: add model to get caption and score
        created=datetime.now(),
        user_id=user.id,
    )
    db.add(db_attempt)
    db.commit()
    db.refresh(db_attempt)

    return db_attempt


def delete_attempt_by_id(db: Session, attempt_id: UUID):
    db_attempt = db.query(Attempt).filter(Attempt.id == attempt_id).first()

    if not db_attempt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attempt not found")

    db.delete(db_attempt)
    db.commit()
