from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, UUID, Float, Date
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    score = Column(Float, default=0, nullable=False)
    allowed_attempts = Column(Integer, default=3, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created = Column(Date, nullable=False)

    attempts = relationship("Attempt", back_populates="user")
    themes = relationship("Theme", back_populates="user")


class Attempt(Base):
    __tablename__ = "attempts"

    id = Column(UUID, primary_key=True, nullable=False)
    image_name = Column(String, nullable=False)
    caption = Column(String, nullable=False)
    score = Column(Float, default=0, nullable=False)
    created = Column(Date, nullable=False)

    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="attempts")

    theme_id = Column(UUID, ForeignKey("themes.id"), nullable=True) # nullable in case no theme for the current date
    theme = relationship("Theme", back_populates="attempts")


class Theme(Base):
    __tablename__ = "themes"

    id = Column(UUID, primary_key=True, nullable=False)
    active_date = Column(Date, nullable=False)
    main = Column(String, nullable=False)
    all = Column(String, nullable=False)

    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="themes")

    attempts = relationship("Attempt", back_populates="theme")
