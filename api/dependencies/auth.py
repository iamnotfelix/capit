import os
from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv, find_dotenv
from sqlalchemy.orm import Session
from uuid import uuid4

from ..models.auth import TokenData
from ..models.user import UserSignUp
from .user import get_user_by_username, get_user_by_id
from .database import get_db
from ..database.models import User


load_dotenv(find_dotenv())

SECRET_KEY = os.environ.get("HASHING_SECRET_KEY")
ALGORITHM = os.environ.get("HASHING_ALGORITHM")


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)

    if not user:
        return False
    
    if not verify_password(password, user.password):
        return False
    
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], 
    db: Annotated[Session, Depends(get_db)],
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id: str = payload.get("id")
        if id is None:
            raise credentials_exception
        token_data = TokenData(id=id)
    except JWTError:
        raise credentials_exception
    
    user = get_user_by_id(db, user_id=token_data.id)
    if user is None:
        raise credentials_exception
    
    return user

async def is_current_user_admin(current_user: Annotated[User, Depends(get_current_user)]):
    if current_user.is_admin:
        return current_user
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")


def sign_up_user(db: Session, user: UserSignUp):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        id=uuid4(),
        username=user.username,
        email=user.email, 
        password=hashed_password,
        score=0,
        allowed_attempts=3,
        is_admin = False,
        created = datetime.now(),
        profile_image = "",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

