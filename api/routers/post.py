from typing import Annotated
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from ..dependencies.database import get_db
from ..models.post import PostCreate, PostGet
from ..models.user import UserGet
from ..dependencies import post as crud
from ..dependencies import auth


router = APIRouter(
    prefix="/posts",
    tags=["Posts"],
)


@router.post("/", response_model=PostGet)
async def create_post(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[UserGet, Depends(auth.get_current_user)],
    post: PostCreate, 
):
    return crud.create_post(db=db, post=post, user_id=user.id)


@router.get("/", response_model=list[PostGet], dependencies=[Depends(auth.get_current_user)])
async def get_all_posts(
    db: Annotated[Session, Depends(get_db)], 
    skip: int = 0, 
    limit: int = 100,
):
    return crud.get_posts(db, skip=skip, limit=limit)


@router.get("/me", response_model=list[PostGet])
async def get_authenticated_user_posts(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[UserGet, Depends(auth.get_current_user)],
):
    return crud.get_posts_by_user_id(db, user_id=user.id)


@router.get("/me/canposttoday", response_model=bool)
async def get_can_authenticated_user_post_today(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[UserGet, Depends(auth.get_current_user)],
):
    if user.is_admin:
        return True
    return crud.get_can_user_post_today(db, user_id=user.id)


@router.get("byuser/{user_id}", response_model=list[PostGet], dependencies=[Depends(auth.get_current_user)])
async def get_posts_by_user_id(
    db: Annotated[Session, Depends(get_db)],
    user_id: UUID,
):
    return crud.get_posts_by_user_id(db, user_id=user_id)


@router.get("bypost/{post_id}", response_model=PostGet)
async def get_post_by_id(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[UserGet, Depends(auth.get_current_user)],
    post_id: UUID, 
):
    db_post = crud.get_post_by_id(db, post_id=post_id, user_id=user.id)

    if db_post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
    
    return db_post


@router.delete("me/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_authenticated_user_post_by_id(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[UserGet, Depends(auth.get_current_user)],
    post_id: UUID,
):
    crud.delete_post_by_id(db, post_id=post_id, user_id=user.id)
