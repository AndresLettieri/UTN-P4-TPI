from sqlmodel import Session

from app.core.unit_of_work import UnitOfWork
from app.modules.pedidos.detallePedido.repository import DetallePedidoRepository


class DetallePedidoUnitOfWork(UnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.session = session
        self.detalle_pedido = DetallePedidoRepository(session)
