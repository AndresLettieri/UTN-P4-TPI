from sqlmodel import Session

from app.core.base_repository import BaseRepository
from app.modules.pedidos.detallePedido.model import DetallePedido


class DetallePedidoRepository(BaseRepository[DetallePedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, DetallePedido)