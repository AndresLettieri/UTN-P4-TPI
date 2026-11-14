from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from app.modules.pedidos.model import Pedido


class PedidoRepository(BaseRepository[Pedido]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Pedido)

    def list_by_usuario(
        self,
        usuario_id: int,
        skip: int = 0,
        limit: int = 10,
    ) -> list[Pedido]:
        return list(
            self.session.exec(
                select(Pedido)
                .where(Pedido.usuario_id == usuario_id)
                .offset(skip)
                .limit(limit)
            ).all()
        )

    def count_pedidos(self) -> int:
        statement = select(func.count()).select_from(Pedido)
        return self.session.scalar(statement) or 0

    def count_by_usuario(self, usuario_id: int) -> int:
        statement = (
            select(func.count())
            .select_from(Pedido)
            .where(Pedido.usuario_id == usuario_id)
        )
        return self.session.scalar(statement) or 0

    def count_by_estado(self, estado: str) -> int:
        statement = (
            select(func.count())
            .select_from(Pedido)
            .where(Pedido.estado == estado)
        )
        return self.session.scalar(statement) or 0