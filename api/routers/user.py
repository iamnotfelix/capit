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
    dependencies=[Depends(auth.is_current_user_admin)]
)


@router.post("/", response_model=UserGet)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user_email = crud.get_user_by_email(db, email=user.email)
    db_user_username = crud.get_user_by_username(db, username=user.username)

    if db_user_username:
        raise HTTPException(status_code=400, detail="Username already registered")
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    return crud.create_user(db=db, user=user)


@router.get("/", response_model=list[UserGet])
def get_all_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@router.get("/{user_id}", response_model=UserGet)
def get_user_by_id(user_id: UUID, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_by_id(user_id: UUID, db: Session = Depends(get_db)):
    crud.delete_user_by_id(db, user_id=user_id)

@router.delete("/{username}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_by_username(username: str, db: Session = Depends(get_db)):
    crud.delete_user_by_username(db, username=username)


# @app.post("/users/{user_id}/items", response_model=schemas.Item)
# def create_item_for_user(
#     user_id: int, item: schemas.ItemCreate, db: Session = Depends(get_db)
# ):
#     return crud.create_user_item(db=db, item=item, user_id=user_id)
