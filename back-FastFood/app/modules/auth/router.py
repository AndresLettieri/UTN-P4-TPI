from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session

from app.core.database import get_session
from app.core.deps import get_current_active_user
from app.modules.auth.schema import (
    UserCreate,
    UserPublic,
)
from app.modules.auth.service import AuthService
from app.modules.usuarios.model import Usuario

router = APIRouter()

SESSION_DEPENDENCY = Depends(get_session)


def get_auth_service(session: Session = SESSION_DEPENDENCY) -> AuthService:
    return AuthService(session)


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(
    user_in: UserCreate,
    svc: Annotated[AuthService, Depends(get_auth_service)],
):
    return svc.crear(user_in)


@router.post("/token")
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    svc: Annotated[AuthService, Depends(get_auth_service)],
    response: Response,
):
    token = svc.authenticate(form_data.username, form_data.password)

    response.set_cookie(
        key="access_token",
        value=token.access_token,
        httponly=True,
        max_age=1800,
        samesite="lax",
        secure=False,
    )

    return {"mensaje": "Login exitoso. Sesión iniciada."}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="lax",
        secure=False,
    )
    return {"mensaje": "Sesión cerrada exitosamente"}

@router.get("/me", response_model=UserPublic)
def read_me(
    current_user: Annotated[Usuario, Depends(get_current_active_user)],
):
    return current_user

