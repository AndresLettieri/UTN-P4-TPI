from sqlmodel import Session, select

from app.core.base_repository import BaseRepository
from app.modules.catalogos.estadoPedido.model import EstadoPedido


class EstadoPedidoRepository(BaseRepository[EstadoPedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, EstadoPedido)

    def get_by_codigo(self, codigo: str) -> EstadoPedido | None:
        return self.session.exec(select(EstadoPedido).where(EstadoPedido.codigo == codigo)).first()

