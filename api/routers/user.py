from typing import Annotated
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from ..dependencies.database import get_db
from ..models.user import UserGet, UserCreate, UserUpdateProfileImage
from ..dependencies import user as crud
from ..dependencies import auth


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post("/", response_model=UserGet, dependencies=[Depends(auth.is_current_user_admin)])
def create_user(
    db: Annotated[Session, Depends(get_db)],
    user: UserCreate, 
):
    db_user_email = crud.get_user_by_email(db, email=user.email)
    db_user_username = crud.get_user_by_username(db, username=user.username)

    if db_user_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    if db_user_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    return crud.create_user(db=db, user=user)


@router.get("/", response_model=list[UserGet], dependencies=[Depends(auth.is_current_user_admin)])
def get_all_users(db: Annotated[Session, Depends(get_db)], skip: int = 0, limit: int = 100):
    return crud.get_users(db=db, skip=skip, limit=limit)


@router.put("/profileimage", response_model=UserGet)
def update_authenticated_user_profile_image(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[UserGet, Depends(auth.get_current_user)],
    profile_image: UserUpdateProfileImage, 
):
    return crud.update_user_profile_image(db=db, user_id=user.id, profile_image=profile_image.profile_image)


@router.get("/byuserid/{user_id}", response_model=UserGet, dependencies=[Depends(auth.get_current_user)])
def get_user_by_id(
    db: Annotated[Session, Depends(get_db)],
    user_id: UUID, 
):
    db_user = crud.get_user_by_id(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user


@router.get("/byusername/{username}", response_model=UserGet, dependencies=[Depends(auth.get_current_user)])
def get_user_by_username(
    db: Annotated[Session, Depends(get_db)],
    username: str, 
):
    db_user = crud.get_user_by_username(db=db, username=username)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user


@router.delete("/byuserid/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(auth.is_current_user_admin)])
def delete_user_by_id(
    db: Annotated[Session, Depends(get_db)],
    user_id: UUID, 
):
    crud.delete_user_by_id(db=db, user_id=user_id)


@router.delete("/byusername/{username}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(auth.is_current_user_admin)])
def delete_user_by_username(
    db: Annotated[Session, Depends(get_db)],
    username: str, 
):
    crud.delete_user_by_username(db=db, username=username)
