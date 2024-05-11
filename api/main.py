import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .routers import auth, user, attempt
from .ml.load import get_model


@asynccontextmanager
async def lifespan(app: FastAPI):
    # cache model
    get_model()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


app.include_router(auth.router)
app.include_router(user.router)
app.include_router(attempt.router)


@app.get('/')
async def root():
    return {'root': 'root'}
