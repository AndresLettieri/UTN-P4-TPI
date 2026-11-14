from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.core.database import get_session
from app.core.deps import require_role
from app.modules.categorias.schema import CategoriaCreate, CategoriaList, CategoriaRead
from app.modules.categorias.service import CategoriaService
from app.modules.usuarios.model import Usuario

router = APIRouter()

SESSION_DEPENDENCY = Depends(get_session)


def get_categoria_service(session: Session = SESSION_DEPENDENCY) -> CategoriaService:
    return CategoriaService(session)


@router.post(
    "/", 
    response_model=CategoriaRead, 
    status_code=status.HTTP_201_CREATED,
    summary="Crear una nueva categoría"
)
def crear_categoria(
    data: CategoriaCreate,
    svc: Annotated[CategoriaService, Depends(get_categoria_service)],
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
) -> CategoriaRead:
    return svc.crear(data)

@router.get(
    "/", 
    response_model= CategoriaList,
    status_code=status.HTTP_200_OK,
    summary="Obtener todas las categorías"
)
def obtener_categorias(
    svc: Annotated[CategoriaService, Depends(get_categoria_service)],
    skip: int = Query(default=0,ge=0),
    limit: int = Query(default=20,ge=1, le =100),
) -> CategoriaList:
    return svc.obtener_todas(skip=skip, limit=limit)

@router.get(
    "/{categoria_id}",
    response_model=CategoriaRead,
    status_code=status.HTTP_200_OK,
    summary="Obtener una categoría por ID"
)
def obtener_categoria(
    categoria_id: int,
    svc: Annotated[CategoriaService, Depends(get_categoria_service)],
) -> CategoriaRead:
    return svc.obtener_por_id(categoria_id)

@router.put(
    "/{categoria_id}",
    response_model=CategoriaRead,
    status_code=status.HTTP_200_OK,
    summary="Actualizar una categoría por ID"
)
def actualizar_categoria(
    categoria_id: int,
    data: CategoriaCreate,
    svc: Annotated[CategoriaService, Depends(get_categoria_service)],
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
) -> CategoriaRead:
    return svc.actualizar(categoria_id, data)

@router.delete(
    "/{categoria_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar una categoría por ID"
)
def eliminar_categoria(
    categoria_id: int,
    svc: Annotated[CategoriaService, Depends(get_categoria_service)],
    _admin: Annotated[Usuario, Depends(require_role(["admin"]))],
) -> None:
    svc.eliminar(categoria_id)

@router.get(
    "/{categoria_id}/productos",
    response_model=list,
    status_code=status.HTTP_200_OK,
    summary="Obtener los productos de una categoría"
)
def obtener_productos_categoria(
    categoria_id: int,
    svc: Annotated[CategoriaService, Depends(get_categoria_service)],
) -> list:
    return svc.obtener_productos(categoria_id)