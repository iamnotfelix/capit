from pydantic import BaseModel, UUID4
from datetime import date


class UserInDB(BaseModel):
    id: UUID4
    username: str
    email: str
    password: str
    score: float
    allowed_attempts: int
    is_admin: bool
    created: date

    class Config:
        orm_mode = True


class UserGet(BaseModel):
    id: UUID4
    username: str
    email: str
    score: float
    allowed_attempts: int
    is_admin: bool
    created: date


class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    score: float
    allowed_attempts: int
    is_admin: bool


class UserSignUp(BaseModel):
    username: str
    email: str
    password: str
