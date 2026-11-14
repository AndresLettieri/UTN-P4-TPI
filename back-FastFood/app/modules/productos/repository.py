from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from app.modules.productos.model import Producto


class ProductoRepository(BaseRepository[Producto]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Producto)

    def obtener_por_nombre(self, nombre: str) -> Producto | None:
        return self.session.exec(
            select(Producto).where(func.lower(Producto.nombre) == nombre.strip().lower())
        ).first()

    def obtener_por_categoria(self, categoria_id: int) -> list[Producto]:
        return list(
            self.session.exec(
                select(Producto).where(Producto.categoria_id == categoria_id)
            ).all()
        )