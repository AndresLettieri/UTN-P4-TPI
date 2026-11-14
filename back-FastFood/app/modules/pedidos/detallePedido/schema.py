from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class ItemPedidoCreate(BaseModel):
    producto_id: int = Field(..., gt=0)
    cantidad: int = Field(..., ge=1)

class DetallePedidoRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    producto_id: int
    nombre_producto: str
    precio_unitario: Decimal
    cantidad: int
    subtotal: Decimal

class DetallePedidoList(BaseModel):
    items: list[DetallePedidoRead] = Field(default_factory=list)
    total: int
