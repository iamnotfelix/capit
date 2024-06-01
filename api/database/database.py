import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import URL
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

url = URL.create(
    drivername="postgresql",
    username=os.environ.get("DB_USER"),
    host=os.environ.get("DB_HOST"),
    database=os.environ.get("DB_NAME"),
    password=os.environ.get("DB_PASSWORD"),
    port=os.environ.get("DB_PORT"),
)

engine = create_engine(url=url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
