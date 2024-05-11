from typing import Annotated
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID

from ..dependencies.database import get_db
from ..models.attempt import AttemptCreate, AttemptGet
from ..models.user import UserGet
from ..dependencies import attempt as crud
from ..dependencies import auth


router = APIRouter(
    prefix="/attempts",
    tags=["Attempts"],
)


@router.post("/", response_model=AttemptGet)
async def create_attempt(
    attempt: AttemptCreate, 
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserGet, Depends(auth.get_current_user)]
):
    return crud.create_attempt(db=db, attempt=attempt, user=current_user)


@router.get("/", response_model=list[AttemptGet], dependencies=[Depends(auth.is_current_user_admin)])
async def get_all_attempts(
    db: Annotated[Session, Depends(get_db)], 
    skip: int = 0, 
    limit: int = 100
):
    attempts = crud.get_attempts(db, skip=skip, limit=limit)
    return attempts


@router.get("/{attempt_id}", response_model=AttemptGet)
def get_attempt_by_id(
    attempt_id: UUID, 
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserGet, Depends(auth.get_current_user)]
):
    db_attempt = crud.get_attempt(db, attempt_id=attempt_id, user_id=current_user.id)

    if db_attempt is None:
        raise HTTPException(status_code=404, detail="Attempt not found")
    
    return db_attempt