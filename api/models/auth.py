from .base import Base
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(Base):
    id: str | None = None
