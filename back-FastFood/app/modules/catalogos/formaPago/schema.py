from pydantic import BaseModel, ConfigDict, Field


class FormaPagoCreate(BaseModel):
    codigo: str = Field(min_length=1, max_length=80)
    descripcion: str = Field(min_length=1, max_length=100)
    activo: bool = Field(default=True)

class FormaPagoRead(FormaPagoCreate):
    model_config = ConfigDict(from_attributes=True)

class FormaPagoUpdate(FormaPagoCreate):
    pass