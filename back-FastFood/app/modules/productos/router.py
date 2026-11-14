from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.core.database import get_session
from app.core.deps import require_role
from app.modules.productos.schema import (
    ProductoCreate,
    ProductoRead,
    ProductosPaginados,
    ProductoUpdate,
)
from app.modules.productos.service import ProductoService
from app.modules.usuarios.model import Usuario

router = APIRouter()

SESSION_DEPENDENCY = Depends(get_session)


def get_producto_service(session: Session = SESSION_DEPENDENCY) -> ProductoService:
    return ProductoService(session)

@router.post(
    "/", 
    response_model=ProductoRead, 
    status_code=status.HTTP_201_CREATED,
    summary="Crear un nuevo producto"
)
def crear_producto(
    data: ProductoCreate,
    svc: Annotated[ProductoService, Depends(get_producto_service)],
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
) -> ProductoRead:
    return svc.crear(data)

@router.get(
    "/",
    response_model=ProductosPaginados,
    status_code=status.HTTP_200_OK,
    summary="Obtener todos los productos"
)
def obtener_producto(
    svc: Annotated[ProductoService, Depends(get_producto_service)],
    skip: int = Query(default=0,ge=0),
    limit: int = Query(default=20,ge=1, le =100),
    search: str | None = None,
    categoria_id: int | None = None,
) -> ProductosPaginados:
    return svc.obtener_todos(skip=skip, limit=limit, search=search, categoria_id=categoria_id)

@router.get(
    "/{producto_id}",
    response_model=ProductoRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener un producto por su ID"
)
def obtener_producto_por_id(
    producto_id: int,
    svc: Annotated[ProductoService, Depends(get_producto_service)],
) -> ProductoRead:
    return svc.obtener_por_id(producto_id)

@router.put(
    "/{producto_id}",
    response_model=ProductoRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar un producto por su ID"
)
def actualizar_producto(
    producto_id: int,
    data: ProductoUpdate,
    svc: Annotated[ProductoService, Depends(get_producto_service)],
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
) -> ProductoRead:
    return svc.actualizar(producto_id, data)

@router.delete(
    "/{producto_id}",
    response_model=None,
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar un producto por su ID"
)
def eliminar_producto(
    producto_id: int,
    svc: Annotated[ProductoService, Depends(get_producto_service)],
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
) -> None:
    svc.eliminar(producto_id)
