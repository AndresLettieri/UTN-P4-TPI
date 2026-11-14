from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.core.database import get_session
from app.core.deps import require_role
from app.modules.usuarios.model import Usuario
from app.modules.usuarios.schema import (
    UserList,
    UserPublic,
)
from app.modules.usuarios.service import UsuarioService

router = APIRouter()

SESSION_DEPENDENCY = Depends(get_session)


def get_usuario_service(session: Session = SESSION_DEPENDENCY) -> UsuarioService:
    return UsuarioService(session)

@router.get(
    "/admin/usuarios", 
    response_model=UserList,
    status_code=status.HTTP_200_OK,
    summary="Obtener todos los usuarios"
)
def obtener_usuarios(
    svc: Annotated[UsuarioService, Depends(get_usuario_service)],
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
    skip: int = Query(default=0,ge=0),
    limit: int = Query(default=20,ge=1, le =100),
) -> UserList:
    return svc.obtener_todos(skip=skip, limit=limit)


@router.post(
    "/{usuario_id}/activar",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    summary="Activar un usuario por ID"
)
def activar_usuario(
    usuario_id: int,
    svc: Annotated[UsuarioService, Depends(get_usuario_service)],
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
    ) -> UserPublic:
    return svc.activar(usuario_id)

@router.post(
    "/{usuario_id}/desactivar",
    response_model=UserPublic,
    status_code=status.HTTP_200_OK,
    summary="Desactivar un usuario por ID"
)
def desactivar_usuario(
    usuario_id: int,
    svc: Annotated[UsuarioService, Depends(get_usuario_service)],
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
) -> UserPublic:
    return svc.desactivar(usuario_id)
