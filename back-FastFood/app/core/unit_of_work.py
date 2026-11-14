from sqlmodel import Session

from app.core.database import engine


class UnitOfWork:
    def __init__(self, session: Session) -> None:
        self._session = session

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> None:
        try:
            if exc_type is None:
                self._session.commit()
            else:
                self._session.rollback()
        finally:
            self._session.close()

    def commit(self) -> None:
        self._session.commit()

    def rollback(self) -> None:
        self._session.rollback()


def get_uow() -> UnitOfWork:
    return UnitOfWork(session=Session(engine))