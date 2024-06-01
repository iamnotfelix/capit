from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from datetime import datetime
from uuid import uuid4

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
    return {
        "id": str(uuid4()),
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


def test_create_user():
    response = client.post("/users/", json={
        "username": "username1",
        "email": "email1",
        "password": "password",
        "score": 0,
        "allowed_attempts": 0,
        "is_admin": False,
    })
    data = response.json()

    assert response.status_code == 200, response.text
    assert "id" in data
    assert data["username"] == "username1"
    assert data["email"] == "email1"


def test_get_all_users():
    response = client.get("/users/")
    data = response.json()

    assert response.status_code == 200
    assert type(data) is list
    assert len(data) == 1


def test_get_user_by_id():
    response1 = client.post("/users/", json={
        "username": "username2",
        "email": "email2",
        "password": "password",
        "score": 0,
        "allowed_attempts": 0,
        "is_admin": False,
    })
    assert response1.status_code == 200
    user_id = response1.json()["id"]

    response2 = client.get(f"/users/byuserid/{user_id}/")
    data = response2.json()

    assert response2.status_code == 200
    assert data["username"] == "username2"


def test_get_user_by_username():
    response1 = client.post("/users/", json={
        "username": "username3",
        "email": "email3",
        "password": "password",
        "score": 0,
        "allowed_attempts": 0,
        "is_admin": False,
    })
    assert response1.status_code == 200
    username = response1.json()["username"]

    response2 = client.get(f"/users/byusername/{username}/")
    data = response2.json()

    assert response2.status_code == 200
    assert data["email"] == "email3"


def test_delete_user_by_id():
    response1 = client.post("/users/", json={
        "username": "username4",
        "email": "email4",
        "password": "password",
        "score": 0,
        "allowed_attempts": 0,
        "is_admin": False,
    })
    assert response1.status_code == 200
    user_id = response1.json()["id"]

    response2 = client.delete(f"/users/byuserid/{user_id}/")

    assert response2.status_code == 204


def test_get_user_by_username():
    response1 = client.post("/users/", json={
        "username": "username5",
        "email": "email5",
        "password": "password",
        "score": 0,
        "allowed_attempts": 0,
        "is_admin": False,
    })
    assert response1.status_code == 200
    username = response1.json()["username"]

    response2 = client.delete(f"/users/byusername/{username}/")

    assert response2.status_code == 204
