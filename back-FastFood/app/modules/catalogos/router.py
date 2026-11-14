from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from app.core.database import get_session
from app.core.deps import get_current_active_user
from app.modules.catalogos.estadoPedido.schema import EstadoPedidoRead
from app.modules.catalogos.estadoPedido.service import EstadoPedidoService
from app.modules.catalogos.formaPago.schema import FormaPagoRead
from app.modules.catalogos.formaPago.service import FormaPagoService
from app.modules.usuarios.schema import UserPublic

router = APIRouter()
    
SESSION_DEPENDENCY = Depends(get_session)

    
def get_forma_pago_service(session: Session = SESSION_DEPENDENCY) -> FormaPagoService:
    return FormaPagoService(session)

def get_estado_pedido_service(session: Session = SESSION_DEPENDENCY) -> EstadoPedidoService:
    return EstadoPedidoService(session)

@router.get(
    "/formas-pago", 
    response_model=list[FormaPagoRead], 
    status_code=status.HTTP_200_OK,
    summary="Obtener todas las formas de pago"
)
def obtener_formas_pago(
    svc: Annotated[FormaPagoService, Depends(get_forma_pago_service)],
    _current_user: Annotated[UserPublic,Depends(get_current_active_user)],
) -> list[FormaPagoRead]:
    return svc.obtener_todas()

@router.get(
    "/estados-pedido", 
    response_model=list[EstadoPedidoRead], 
    status_code=status.HTTP_200_OK,
    summary="Obtener todos los estados de pedido"
)
def obtener_estados_pedido(
    svc: Annotated[EstadoPedidoService, Depends(get_estado_pedido_service)],
    _current_user: Annotated[UserPublic,Depends(get_current_active_user)],
) -> list[EstadoPedidoRead]:
    return svc.obtener_todas()
