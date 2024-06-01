from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from datetime import datetime

from ..main import app
from ..dependencies.auth import is_current_user_admin, get_current_user
from ..dependencies.database import get_db
from ..database.database import Base 


SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def get_mocked_user():
    return  {
        "id": "4a56e9e0-e34c-41cf-9621-63bf04aeaf54",
        "username": "username",
        "email": "email",
        "score": 0,
        "allowed_attempts": 0,
        "is_admin": False,
        "created": datetime.now().date(),
        "profile_image": "",
    }


def override_current_user():
    return get_mocked_user()


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[is_current_user_admin] = override_current_user
app.dependency_overrides[get_current_user] = override_current_user

client = TestClient(app)


def test_get_all_attempts():
    response = client.get("/attempts/")
    data = response.json()

    assert response.status_code == 200
    assert type(data) is list
    assert len(data) == 0
