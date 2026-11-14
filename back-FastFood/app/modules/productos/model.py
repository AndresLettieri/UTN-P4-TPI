
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Column, ForeignKey, Integer, Numeric, String
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.categorias.model import Categoria
    from app.modules.pedidos.detallePedido.model import DetallePedido


class Producto(SQLModel, table=True):
    __tablename__ = "producto"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)

    categoria_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("categoria.id", ondelete="RESTRICT"),
            nullable=False,
        )
    )

    nombre: str = Field(
        sa_column=Column(String(100), nullable=False)
    )

    descripcion: str | None = Field(
        default=None,
        sa_column=Column(String(255), nullable=True),
    )

    precio_base: Decimal = Field(
        sa_column=Column(Numeric(10, 2), nullable=False)
    )

    imagen_url: str | None = Field(
        default=None,
        sa_column=Column(String(255), nullable=True),
    )

    stock: int = Field(
        default=0,
        sa_column=Column(Integer, nullable=False, default=0),
    )

    disponible: bool = Field(
        default=True,
        sa_column=Column(Boolean, nullable=False, default=True),
    )

    activo: bool = Field(
        default=True,
        sa_column=Column(Boolean, nullable=False, default=True),
    )

    categoria: "Categoria" = Relationship(
        back_populates="productos",
    )

    items: list["DetallePedido"] = Relationship(
        back_populates="producto",
    )