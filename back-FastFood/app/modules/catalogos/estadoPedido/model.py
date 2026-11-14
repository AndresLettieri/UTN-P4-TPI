from sqlalchemy import Boolean, Column, String
from sqlmodel import Field, Integer, SQLModel


class EstadoPedido(SQLModel, table=True):
    __tablename__ = "estado_pedido"  # type: ignore

    orden: int = Field(
        sa_column=Column(Integer, nullable=False)
    )
    
    codigo: str = Field(
        sa_column=Column(String(20), primary_key=True, nullable=False)
    )
    descripcion: str = Field(
        sa_column=Column(String(80), nullable=False)
    )
    es_terminal: bool = Field(
        sa_column=Column(Boolean, nullable=False, default=True)
    )