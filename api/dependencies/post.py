from sqlalchemy.orm import Session
from datetime import datetime
from uuid import uuid4, UUID
from fastapi import HTTPException, status

from ..dependencies.s3 import S3Client
from ..database.models import Post, Attempt, User
from ..models.follow import FollowingGetUser
from ..models.post import PostCreate


def get_posts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Post).offset(skip).limit(limit).all()


def get_post_by_id(db: Session, post_id: UUID, user_id: UUID):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if db_post and db_post.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permission.")
    return db_post


def get_posts_by_user_id(db: Session, user_id: UUID):
    db_posts = db.query(Post).filter(Post.user_id == user_id).all()
    db_posts.sort(key=lambda post: post.created, reverse=True)
    return db_posts


def get_posts_by_user_followings(db: Session, followings: list[FollowingGetUser]):
    db_posts = []
    for following in followings:
        db_post = db.query(Post).filter(Post.user_id == following.following_id).all()
        db_posts.extend(db_post)
    db_posts.sort(key=lambda post: post.created, reverse=True)

    return db_posts


def get_can_user_post_today(db: Session, user_id: UUID):
    post_today = db.query(Post).filter(Post.user_id == user_id).filter(Post.created == datetime.now().date()).first()
    if post_today:
        return False
    return True


def create_post(db: Session, post: PostCreate, user_id: UUID):
    db_attempt = db.query(Attempt).filter(Attempt.id == post.attempt_id).first()
    db_user = db.query(User).filter(User.id == user_id).first()

    if db_attempt and db_attempt.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permission.")

    if not db_attempt:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attempt not found")
    
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db_post = Post(
        id=uuid4(),
        image_name=db_attempt.image_name,
        caption=db_attempt.caption,
        score=db_attempt.score,
        created=datetime.now(),
        user_id=db_attempt.user_id,
        theme_id=db_attempt.theme_id
    )
    db.add(db_post)
    setattr(db_user, "score", db_attempt.score + db_user.score)
    db.commit()
    db.refresh(db_post)

    return db_post


def delete_post_by_id(db: Session, s3: S3Client, post_id: UUID, user_id: UUID):
    db_post = db.query(Post).filter(Post.id == post_id).first()

    if db_post and db_post.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permission.")

    if not db_post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    s3.delete(db_post.image_name)
    db.delete(db_post)
    db.commit()

