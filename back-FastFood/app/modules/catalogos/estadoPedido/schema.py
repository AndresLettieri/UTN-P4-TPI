from pydantic import BaseModel, ConfigDict, Field


class EstadoPedidoCreate(BaseModel):
    orden: int = Field(...)
    codigo: str = Field(min_length=1, max_length=20)
    descripcion: str = Field(min_length=1, max_length=80)
    es_terminal: bool = Field(default=True)

class EstadoPedidoRead(EstadoPedidoCreate):
    model_config = ConfigDict(from_attributes=True)

class EstadoPedidoUpdate(EstadoPedidoCreate):
    pass