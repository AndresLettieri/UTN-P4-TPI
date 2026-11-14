from fastapi import HTTPException, status
from sqlmodel import Session

from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.modules.auth.schema import (
    Token,
    UserCreate,
    UserPublic,
)
from app.modules.usuarios.model import Usuario
from app.modules.usuarios.unit_of_work import UsuarioUnitOfWork


class AuthService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def crear(self, data: UserCreate,) -> UserPublic:
        with UsuarioUnitOfWork(self.session) as uow:
            usuario = uow.usuario.obtener_por_email(data.email)
            if usuario:
                raise HTTPException(status_code=409, detail="Email ya existe")

            usuario = uow.usuario.obtener_por_username(data.username)
            if usuario:
                raise HTTPException(status_code=409, detail="Username ya existe")
            
            usuario = Usuario(
                username=data.username,
                full_name=data.full_name,
                email=data.email,
                hashed_password=hash_password(data.password),
            )
            uow.usuario.add(usuario)

            result = UserPublic.model_validate(usuario)
        return result

    def authenticate(self, username: str, password: str):
        with UsuarioUnitOfWork(self.session) as uow:
            usuario = uow.usuario.obtener_por_username(username)
            if not usuario or not verify_password(password, usuario.hashed_password):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Credenciales incorrectas",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            if usuario.disabled:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cuenta de usuario desactivada",
                )

            access_token = create_access_token(
                data={"sub": usuario.username, "role": usuario.role}
            )
            return Token(
                access_token=access_token,
                token_type="bearer",
                expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            )

    def obtener_por_username(self, username: str) -> UserPublic:
        from app.modules.auth.schema import UserPublic
        with UsuarioUnitOfWork(self.session) as uow:
            usuario = uow.usuario.obtener_por_username(username)
            if not usuario:
                raise HTTPException(status_code=404, detail="Usuario no encontrado")
            result = UserPublic.model_validate(usuario)
        return result