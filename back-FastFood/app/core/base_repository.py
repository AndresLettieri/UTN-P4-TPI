from collections.abc import Sequence
from typing import Generic, TypeVar

from sqlmodel import Session, SQLModel, func, select

ModelT = TypeVar("ModelT", bound=SQLModel)


class BaseRepository(Generic[ModelT]):
    def __init__(self, session: Session, model: type[ModelT]) -> None:
        self.session = session
        self.model = model

    def get_by_id(self, record_id: int) -> ModelT | None:
        return self.session.get(self.model, record_id)

    def get_all(self, skip: int = 0, limit: int = 20) -> Sequence[ModelT]:
        return self.session.exec(
            select(self.model).offset(skip).limit(limit)
        ).all()

    def count_all(self) -> int:
        statement = select(func.count()).select_from(self.model)
        return self.session.scalar(statement) or 0

    def add(self, instance: ModelT) -> ModelT:
        self.session.add(instance)
        self.session.flush()  # obtiene el ID sin hacer commit
        self.session.refresh(instance)
        return instance

    def delete(self, instance: ModelT) -> None:
        instance.activo = False
        self.session.add(instance)
        self.session.flush()

    def update(self, instance: ModelT) -> ModelT:
        self.session.add(instance)
        self.session.flush()
        self.session.refresh(instance)
        return instance
