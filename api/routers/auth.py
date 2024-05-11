import os
from datetime import timedelta
from typing import Annotated
from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from dotenv import load_dotenv, find_dotenv
from sqlalchemy.orm import Session

from ..dependencies.auth import get_current_user, create_access_token, authenticate_user, sign_up_user
from ..dependencies.database import get_db
from ..dependencies import user as user_crud 
from ..models.auth import Token
from ..models.user import UserGet, UserSignUp


load_dotenv(find_dotenv())

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES"))

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=UserGet)
async def sign_up(
    user: UserSignUp,
    db: Annotated[Session, Depends(get_db)],
) -> UserGet:
    db_user_email = user_crud.get_user_by_email(db, email=user.email)
    db_user_username = user_crud.get_user_by_username(db, username=user.username)

    if db_user_username:
        raise HTTPException(status_code=400, detail="Username already registered")
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = sign_up_user(db, user)

    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Something went wrong")
    
    return new_user
    

@router.post("/token", response_model=Token)
async def login_for_access_token(
    db: Annotated[Session, Depends(get_db)],
    form_data: Annotated[OAuth2PasswordRequestForm, Depends(OAuth2PasswordRequestForm)],
) -> Token:
    user = authenticate_user(db, form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"id": str(user.id)}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserGet)
async def get_authenticated_user(
    current_user: Annotated[UserGet, Depends(get_current_user)],
) -> UserGet:
    return current_user
