from pydantic import BaseModel, UUID4
from datetime import date


class AttemptInDB(BaseModel):
    id: UUID4
    image_name: str
    caption: str
    score: float
    created: date

    user_id: UUID4

    class Config:
        orm_mode = True
