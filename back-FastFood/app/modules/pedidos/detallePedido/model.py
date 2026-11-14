from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Column, ForeignKey, Integer, Numeric, String
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.modules.pedidos.model import Pedido
    from app.modules.productos.model import Producto


class DetallePedido(SQLModel, table=True):
    __tablename__ = "detalle_pedido"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)

    pedido_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("pedido.id", ondelete="CASCADE"),
            nullable=False,
        )
    )

    producto_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("producto.id", ondelete="RESTRICT"),
            nullable=False,
        )
    )

    cantidad: int = Field(
        sa_column=Column(Integer, nullable=False)
    )

    nombre_producto: str = Field(
        sa_column=Column(String(100), nullable=False)
    )

    precio_unitario: Decimal = Field(
        sa_column=Column(Numeric(10, 2), nullable=False)
    )

    subtotal: Decimal = Field(
        sa_column=Column(Numeric(12, 2), nullable=False)
    )

    pedido: "Pedido" = Relationship(
        back_populates="items",
    )

    producto: "Producto" = Relationship(
        back_populates="items",
    )
