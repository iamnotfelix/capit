from typing import Annotated
from fastapi import Depends, APIRouter, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime

from ..dependencies.database import get_db
from ..models.theme import ThemeCreate, ThemeGet
from ..models.user import UserGet
from ..dependencies import theme as crud
from ..dependencies import auth


router = APIRouter(
    prefix="/themes",
    tags=["Themes"],
)


@router.get("/", response_model=list[ThemeGet], dependencies=[Depends(auth.is_current_user_admin)])
async def get_all_themes(
    db: Annotated[Session, Depends(get_db)],
    skip: int = 0, 
    limit: int = 100,
):
    return crud.get_themes(db, skip, limit)


@router.get("/today", response_model=ThemeGet, dependencies=[Depends(auth.get_current_user)])
async def get_todays_theme(
    db: Annotated[Session, Depends(get_db)],
):
    db_theme = crud.get_theme_by_date(db, datetime.now().date())

    if db_theme is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Theme not found")
    
    return db_theme


@router.get("/{theme_id}", response_model=ThemeGet, dependencies=[Depends(auth.is_current_user_admin)])
async def get_theme_by_id(
    db: Annotated[Session, Depends(get_db)],
    theme_id: UUID,
):
    db_theme = crud.get_theme(db, theme_id=theme_id)

    if db_theme is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Theme not found")
    
    return db_theme


@router.post("/", response_model=ThemeGet)
def create_theme(
    theme: ThemeCreate, 
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserGet, Depends(auth.is_current_user_admin)]
):
    db_theme = crud.get_theme_by_date(db, active_date=theme.active_date)

    if db_theme:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Active date already exists")

    return crud.create_theme(db=db, theme=theme, user=current_user)


@router.delete("/{theme_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(auth.is_current_user_admin)])
def delete_theme_by_id(theme_id: UUID, db: Annotated[Session, Depends(get_db)]):
    crud.delete_theme_by_id(db, theme_id=theme_id)
