from datetime import UTC, datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Column, DateTime, ForeignKey, Numeric, String
from sqlmodel import Field, Relationship, SQLModel

from app.modules.usuarios.model import Usuario

if TYPE_CHECKING:
    from app.modules.pedidos.detallePedido.model import DetallePedido


class Pedido(SQLModel, table=True):
    __tablename__ = "pedido"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)

    usuario_id: int = Field(
        sa_column=Column(
            ForeignKey("usuario.id", ondelete="RESTRICT"),
            nullable=False,
        )
    )

    estado: str = Field(
        sa_column=Column(
            String(30),
            ForeignKey("estado_pedido.codigo", ondelete="RESTRICT"),
            nullable=False,
        )
    )

    forma_pago: str = Field(
        sa_column=Column(
            String(30),
            ForeignKey("forma_pago.codigo", ondelete="RESTRICT"),
            nullable=False,
        )
    )

    direccion_entrega: str = Field(
        sa_column=Column(String(200), nullable=False)
    )

    notas: str | None = Field(
        default=None,
        sa_column=Column(String, nullable=True),
    )

    total: Decimal = Field(
        sa_column=Column(Numeric(12, 2), nullable=False)
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )

    usuario: Usuario = Relationship()

    items: list["DetallePedido"] = Relationship(
        back_populates="pedido",
        cascade_delete=True,
    )