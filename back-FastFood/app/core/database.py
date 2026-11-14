from collections.abc import Generator

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings

if not settings.DATABASE_URL:
    raise ValueError("DATABASE_URL no está configurada")


engine = create_engine(settings.DATABASE_URL, echo=True)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session