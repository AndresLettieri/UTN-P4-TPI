from datetime import UTC, datetime

from fastapi import HTTPException
from sqlmodel import Session

from app.modules.catalogos.estadoPedido.model import EstadoPedido
from app.modules.catalogos.estadoPedido.schema import (
    EstadoPedidoCreate,
    EstadoPedidoRead,
    EstadoPedidoUpdate,
)
from app.modules.catalogos.estadoPedido.unit_of_work import EstadoPedidoUnitOfWork


class EstadoPedidoService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def obtener_todas(self) -> list[EstadoPedidoRead]:
        with EstadoPedidoUnitOfWork(self.session) as uow:
            estados_pedido = uow.estado_pedido.get_all()
            result = [EstadoPedidoRead.model_validate(c) for c in estados_pedido]
        return result

    def crear(self,data: EstadoPedidoCreate) -> EstadoPedidoRead:
        with EstadoPedidoUnitOfWork(self.session) as uow:
            estado_pedido = EstadoPedido.model_validate(data)
            uow.estado_pedido.add(estado_pedido)
            result = EstadoPedidoRead.model_validate(estado_pedido)
        return result

    def actualizar(self, codigo: str, data: EstadoPedidoUpdate) -> EstadoPedidoRead:
        with EstadoPedidoUnitOfWork(self.session) as uow:
            estado_pedido = uow.estado_pedido.get_by_codigo(codigo)
            if not estado_pedido:
                raise HTTPException(status_code=404, detail="Estado de pedido no encontrado")

            patch = data.model_dump(exclude_unset=True)
            
            for key, value in patch.items():
                setattr(estado_pedido, key, value)

            estado_pedido.updated_at = datetime.now(UTC)

            uow.estado_pedido.update(estado_pedido)
            result = EstadoPedidoRead.model_validate(estado_pedido)
        
        return result
