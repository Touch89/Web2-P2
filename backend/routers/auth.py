from typing import Annotated
import os

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from dotenv import load_dotenv
from sqlmodel import select

from database.db import SessionDep
from models.user import User
from auth.jwt import create_access_token

load_dotenv()

EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES"))

router = APIRouter(tags=["auth"])

ph = PasswordHasher()

FormDep = Annotated[OAuth2PasswordRequestForm, Depends()]

@router.post("/login")
def login(response: Response, form_data: FormDep, session: SessionDep):
    user = session.exec(select(User).where(User.username == form_data.username)).first()

    if not user:
        ph.hash("contraseña falsa")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="usuario o contraseña incorrectos",
        )

    try:
        ph.verify(user.hashed_password, form_data.password)
    except VerifyMismatchError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="usuario o contraseña incorrectos",
        )

    token = create_access_token(user.username)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=EXPIRE_MINUTES * 60,
        samesite="lax",
    )

    return {"access_token": token, "token_type": "bearer"}
