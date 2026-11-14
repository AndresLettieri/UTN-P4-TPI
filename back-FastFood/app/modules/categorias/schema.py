
from pydantic import BaseModel, ConfigDict, Field, field_validator


class CategoriaBase(BaseModel):
    nombre: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )
    descripcion: str | None = Field(
        default=None,
    )

    @field_validator("nombre")
    @classmethod
    def validar_nombre(cls, valor: str) -> str:
        valor = valor.strip()
        if not valor:
            raise ValueError("El nombre no puede contener solo espacios")

        return valor


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(CategoriaBase):
    pass


class CategoriaRead(CategoriaBase):
    id: int
    activo: bool
    model_config = ConfigDict(from_attributes=True)


class CategoriaList(BaseModel):
    categorias: list[CategoriaRead] = Field(default_factory=list)
    total: int
