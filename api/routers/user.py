from typing import Annotated
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from ..dependencies.database import get_db
from ..models.user import UserGet, UserCreate
from ..dependencies import user as crud
from ..dependencies import auth


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post("/", response_model=UserGet, dependencies=[Depends(auth.is_current_user_admin)])
def create_user(user: UserCreate, db: Annotated[Session, Depends(get_db)]):
    db_user_email = crud.get_user_by_email(db, email=user.email)
    db_user_username = crud.get_user_by_username(db, username=user.username)

    if db_user_username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    if db_user_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    return crud.create_user(db=db, user=user)


@router.get("/", response_model=list[UserGet], dependencies=[Depends(auth.is_current_user_admin)])
def get_all_users(db: Annotated[Session, Depends(get_db)], skip: int = 0, limit: int = 100):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/byuserid/{user_id}", response_model=UserGet, dependencies=[Depends(auth.get_current_user)])
def get_user_by_id(user_id: UUID, db: Annotated[Session, Depends(get_db)]):
    db_user = crud.get_user_by_id(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user


@router.get("/byusername/{username}", response_model=UserGet, dependencies=[Depends(auth.get_current_user)])
def get_user_by_username(username: str, db: Annotated[Session, Depends(get_db)]):
    db_user = crud.get_user_by_username(db, username=username)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user


@router.delete("/byuserid/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(auth.is_current_user_admin)])
def delete_user_by_id(user_id: UUID, db: Annotated[Session, Depends(get_db)]):
    crud.delete_user_by_id(db, user_id=user_id)

@router.delete("/byusername/{username}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(auth.is_current_user_admin)])
def delete_user_by_username(username: str, db: Annotated[Session, Depends(get_db)]):
    crud.delete_user_by_username(db, username=username)
