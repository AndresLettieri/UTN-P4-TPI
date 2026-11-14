from sqlmodel import Session

from app.core.unit_of_work import UnitOfWork
from app.modules.catalogos.estadoPedido.repository import EstadoPedidoRepository
from app.modules.catalogos.formaPago.repository import FormaPagoRepository
from app.modules.pedidos.detallePedido.repository import DetallePedidoRepository
from app.modules.pedidos.repository import PedidoRepository
from app.modules.productos.repository import ProductoRepository


class PedidoUnitOfWork(UnitOfWork):
    def __init__(self, session: Session) -> None:
        super().__init__(session)
        self.session = session
        self.pedido = PedidoRepository(session)
        self.forma_pago = FormaPagoRepository(session)
        self.producto = ProductoRepository(session)
        self.detalle_pedido = DetallePedidoRepository(session)
        self.estado = EstadoPedidoRepository(session)