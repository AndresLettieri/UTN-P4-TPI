from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.modules.pedidos.detallePedido.schema import (
    DetallePedidoRead,
    ItemPedidoCreate,
)


class PedidoBase(BaseModel):
    forma_pago: str = Field(..., min_length=1)
    direccion_entrega: str = Field(
        ...,
        min_length=5,
        max_length=200,
    )
    notas: str | None = None

    @field_validator("direccion_entrega")
    @classmethod
    def validar_direccion(cls, valor: str) -> str:
        valor = valor.strip()

        if not valor:
            raise ValueError("La dirección de entrega no puede estar vacía")

        return valor

class PedidoCreate(PedidoBase):
    items: list[ItemPedidoCreate] = Field(
        ...,
        min_length=1,
    )

class PedidoUpdate(PedidoBase):
    pass

class PedidoRead(PedidoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    usuario_id: int
    estado: str
    total: Decimal
    created_at: datetime
    updated_at: datetime
    items: list[DetallePedidoRead]

class PedidosPaginados(BaseModel):
    items: list[PedidoRead] = Field(default_factory=list)
    total: int

class CambioEstado(BaseModel):
    estado: str

class ResumenPedido(BaseModel):
    pendientes: int
    en_preparacion: int
    entregados: int
    cancelados: int
    pedidos_hoy: int
    ingresos_entregados: Decimal