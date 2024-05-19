from sqlalchemy.orm import Session
from datetime import datetime
from uuid import uuid4, UUID
from fastapi import HTTPException, status

from ..database.models import Follow
from ..models.follow import FollowCreate


def get_follows(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Follow).offset(skip).limit(limit).all()


def get_follow_by_id(db: Session, follow_id: UUID):
    db_follow = db.query(Follow).filter(Follow.id == follow_id).first()
    if not db_follow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Follow not found.")
    return db_follow


def get_follows_by_follower_id(db: Session, follower_id: UUID):
    return db.query(Follow).filter(Follow.follower_id == follower_id).all()


def get_follows_by_following_id(db: Session, following_id: UUID):
    return db.query(Follow).filter(Follow.following_id == following_id).all()


def get_follow_by_follower_and_following_id(db: Session, follower_id: UUID, following_id: UUID):
    return db.query(Follow).filter(Follow.follower_id == follower_id).filter(Follow.following_id == following_id).first()


def create_follow(db: Session, follow: FollowCreate, user_id: UUID):
    db_f = db.query(Follow).filter(Follow.follower_id == user_id).filter(Follow.following_id == follow.following_id).first()
    if db_f:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Follow already exists.")

    db_follow = Follow(
        id=uuid4(),
        follower_id=user_id,
        following_id=follow.following_id,
        created=datetime.now()
    )
    db.add(db_follow)
    db.commit()
    db.refresh(db_follow)

    return db_follow


def delete_follow_by_follow_id(db: Session, follow_id: UUID):
    db_follow = db.query(Follow).filter(Follow.follow_id == follow_id).first()
    if not db_follow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Follow not found")
    db.delete(db_follow)
    db.commit()


def delete_follow_by_follower_and_following_id(db: Session, follower_id: UUID, following_id: UUID):
    db_follow = db.query(Follow).filter(Follow.follower_id == follower_id).filter(Follow.following_id == following_id).first()
    if not db_follow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Follow not found")
    db.delete(db_follow)
    db.commit()
