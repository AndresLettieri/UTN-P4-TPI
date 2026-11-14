from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.core.database import get_session
from app.core.deps import get_current_active_user, require_role
from app.modules.pedidos.schema import (
    PedidoCreate,
    PedidoRead,
    PedidosPaginados,
    ResumenPedido,
)
from app.modules.pedidos.service import PedidoService
from app.modules.usuarios.model import Usuario
from app.modules.usuarios.schema import UserPublic

router = APIRouter()
    
SESSION_DEPENDENCY = Depends(get_session)

    
def get_pedido_service(session: Session = SESSION_DEPENDENCY) -> PedidoService:
    return PedidoService(session)

@router.post(
    "/", 
    response_model=PedidoRead, 
    status_code=status.HTTP_201_CREATED,
    summary="Crear un nuevo pedido"
)
def crear_pedido(
    data: PedidoCreate,
    svc: Annotated[PedidoService, Depends(get_pedido_service)],
    _current_user: Annotated[UserPublic,Depends(get_current_active_user)]
) -> PedidoRead:
    return svc.crear(data, _current_user)

@router.get(
    "/resumen",
    response_model=ResumenPedido,
    status_code=status.HTTP_200_OK,
    summary="Obtener resumen de pedidos"
)
def obtener_resumen_pedidos(
    svc: Annotated[PedidoService, Depends(get_pedido_service)],
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],   
) -> ResumenPedido:
    return svc.obtener_resumen()


@router.get(
    "/{pedido_id}",
    response_model=PedidoRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener un pedido por su ID"
)
def obtener_pedido(
    pedido_id: int,
    svc: Annotated[PedidoService, Depends(get_pedido_service)],
    _current_user: Annotated[UserPublic,Depends(get_current_active_user)]
) -> PedidoRead:
    return svc.obtener_por_id(pedido_id, _current_user)

@router.get(
    "/",
    response_model=PedidosPaginados,
    status_code=status.HTTP_200_OK,
    summary="Obtener todos los pedidos"
)
def obtener_pedidos(
    svc: Annotated[PedidoService, Depends(get_pedido_service)],
    current_user: Annotated[UserPublic, Depends(get_current_active_user)],
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
) -> PedidosPaginados:
    return svc.obtener_todos(current_user, skip=skip, limit=limit)

@router.post(
    "/{pedido_id}/cancelar",
    response_model=PedidoRead,
    status_code=status.HTTP_200_OK,
    summary="Cancelar un pedido por su ID"
)
def cancelar_pedido(
    pedido_id: int,
    svc: Annotated[PedidoService, Depends(get_pedido_service)],
    current_user: Annotated[UserPublic, Depends(get_current_active_user)],
) -> PedidoRead:
    return svc.cancelar(pedido_id, current_user)

@router.post(
    "/{pedido_id}/estado",
    response_model=PedidoRead,
    status_code=status.HTTP_200_OK,
    summary="Avanzar el estado de un pedido por su ID"
)
def cambiar_estado(
    pedido_id: int,
    svc: Annotated[PedidoService, Depends(get_pedido_service)],
    _current_user: Annotated[UserPublic, Depends(get_current_active_user)],
) -> PedidoRead:
    return svc.cambiar_estado(pedido_id, _current_user)