from typing import Annotated
from fastapi import Depends, APIRouter, status
from sqlalchemy.orm import Session
from uuid import UUID

from ..dependencies.database import get_db
from ..models.follow import FollowGet, FollowCreate
from ..models.user import UserGet
from ..dependencies import follow as crud
from ..dependencies import auth


router = APIRouter(
    prefix="/follows",
    tags=["Follows"],
)


@router.post("/", response_model=FollowGet)
async def create_follow(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[UserGet, Depends(auth.get_current_user)],
    follow: FollowCreate,
):
    return crud.create_follow(db=db, follow=follow, user_id=user.id)


@router.get("/", response_model=list[FollowGet], dependencies=[Depends(auth.is_current_user_admin)])
async def get_all_follows(
    db: Annotated[Session, Depends(get_db)], 
    skip: int = 0, 
    limit: int = 100,
):
    return crud.get_follows(db=db, skip=skip, limit=limit)


@router.get("/{follow_id}", response_model=FollowGet, dependencies=[Depends(auth.is_current_user_admin)])
async def get_follow_by_id(
    db: Annotated[Session, Depends(get_db)], 
    follow_id: UUID,
):
    return crud.get_follow_by_id(db=db, follow_id=follow_id)


@router.get("/byfollower/{follower_id}", response_model=list[FollowGet], dependencies=[Depends(auth.get_current_user)])
async def get_follows_by_follower_id(
    db: Annotated[Session, Depends(get_db)],
    follower_id: UUID,
):
    return crud.get_follows_by_follower_id(db=db, follower_id=follower_id)


@router.get("/byfollowing/{following_id}", response_model=list[FollowGet], dependencies=[Depends(auth.get_current_user)])
async def get_follows_by_following_id(
    db: Annotated[Session, Depends(get_db)],
    following_id: UUID,
):
    return crud.get_follows_by_following_id(db=db, following_id=following_id)


@router.get("/me/isfollowing/{user_id}", response_model=bool)
async def get_authenticated_user_is_following(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[UserGet, Depends(auth.get_current_user)],
    user_id: UUID,
):
    db_follow = crud.get_follow_by_follower_and_following_id(db=db, follower_id=user.id, following_id=user_id)
    if not db_follow:
        return False
    return True


@router.delete("/admin/{follow_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(auth.is_current_user_admin)])
async def delete_follow_by_id(
    db: Annotated[Session, Depends(get_db)],
    follow_id: UUID,
):
    crud.delete_follow_by_follow_id(db=db, follow_id=follow_id)


@router.delete("/me/{following_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_authenticated_user_follow_by_following_id(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[UserGet, Depends(auth.get_current_user)],
    following_id: UUID,
):
    crud.delete_follow_by_follower_and_following_id(db=db, follower_id=user.id, following_id=following_id)
