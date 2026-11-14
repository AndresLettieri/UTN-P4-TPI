from collections.abc import Sequence

from sqlmodel import Session, func, select

from app.core.base_repository import BaseRepository
from app.modules.categorias.model import Categoria


class CategoriaRepository(BaseRepository[Categoria]):
    def __init__(self, session: Session) -> None:
        super().__init__(session, Categoria)

    def get_by_nombre(self, nombre: str) -> Categoria | None:
        return self.session.exec(
            select(Categoria).where(
                func.lower(Categoria.nombre) == nombre.strip().lower()
            )
        ).first()

    def get_all_active(self, skip: int = 0, limit: int = 20) -> Sequence[Categoria]:
        return self.session.exec(
            select(Categoria)
            .where(Categoria.activo == True)
            .offset(skip)
            .limit(limit)
            .order_by("id")
        ).all()

    def count_active(self) -> int:
        statement = (
            select(func.count())
            .select_from(Categoria)
            .where(Categoria.activo == True)
        )
        return self.session.scalar(statement) or 0
