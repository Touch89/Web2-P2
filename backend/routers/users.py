from fastapi import APIRouter, HTTPException, Request, status
from sqlmodel import select
from argon2 import PasswordHasher

from database.db import SessionDep
from models.user import User, UserCreate, UserPublic
from auth.jwt import decode_access_token

router = APIRouter(prefix="/users", tags=["users"])

ph = PasswordHasher()

@router.post("", status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreate, session: SessionDep):
    existing = session.exec(select(User).where(User.username == user_data.username)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="nombre ya existente",
        )

    user = User(
        name=user_data.name,
        username=user_data.username,
        hashed_password=ph.hash(user_data.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "usuario creado"}

@router.get("/me", response_model=UserPublic)
def get_me(request: Request, session: SessionDep):
    token = request.cookies.get("access_token")

    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="no autorizado",
        )

    username = decode_access_token(token)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="invalido o token expirado",
        )

    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="usuario no encontrado",
        )

    return user
