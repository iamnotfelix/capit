from typing import Annotated
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from ..dependencies.database import get_db
from ..models.attempt import AttemptCreate, AttemptGet
from ..models.user import UserGet
from ..models.theme import ThemeGet
from ..dependencies import attempt as crud
from ..dependencies import auth
from ..dependencies import theme
from ..ml.load import get_model, get_scorer
from ..ml.caption import ImageCaptioner
from ..ml.rouge import Rouge


router = APIRouter(
    prefix="/attempts",
    tags=["Attempts"],
)


@router.post("/", response_model=AttemptGet)
async def create_attempt(
    attempt: AttemptCreate, 
    db: Annotated[Session, Depends(get_db)],
    model: Annotated[ImageCaptioner, Depends(get_model)],
    scorer: Annotated[Rouge, Depends(get_scorer)],
    theme_today: Annotated[ThemeGet, Depends(theme.get_theme_today)],
    current_user: Annotated[UserGet, Depends(auth.get_current_user)]
):
    return crud.create_attempt(db=db, model=model, scorer=scorer, attempt=attempt, user=current_user, theme_today=theme_today)


@router.get("/", response_model=list[AttemptGet], dependencies=[Depends(auth.is_current_user_admin)])
async def get_all_attempts(
    db: Annotated[Session, Depends(get_db)], 
    skip: int = 0, 
    limit: int = 100
):
    return crud.get_attempts(db, skip=skip, limit=limit)


@router.get("/me", response_model=list[AttemptGet])
async def get_authenticated_user_attempts_by_date(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserGet, Depends(auth.get_current_user)],
    date=str(datetime.now().date()),
):
    datetime_date = datetime.strptime(date, '%Y-%m-%d')
    db_attempts = crud.get_attempts_by_date(db, user_id=current_user.id, date=datetime_date)

    return db_attempts


@router.get("/me/attemptsleft")
async def get_authenticated_user_attempts_left(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserGet, Depends(auth.get_current_user)],
):
    db_attempts = crud.get_attempts_by_date(db, user_id=current_user.id, date=datetime.now())
    return current_user.allowed_attempts - len(db_attempts)


@router.get("/{attempt_id}", response_model=AttemptGet)
async def get_attempt_by_id(
    attempt_id: UUID, 
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserGet, Depends(auth.get_current_user)]
):
    db_attempt = crud.get_attempt(db, attempt_id=attempt_id, user_id=current_user.id)

    if db_attempt is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attempt not found")
    
    return db_attempt
