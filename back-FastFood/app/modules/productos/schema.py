from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.modules.categorias.schema import CategoriaRead


class ProductoBase(BaseModel):
    nombre: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    descripcion: str | None = Field(
        default=None,
    )

    precio_base: Decimal = Field(
        ...,
        ge=0,
        examples=[150.50],
    )

    imagen_url: str | None = Field(
        default=None,
    )

    stock: int = Field(
        ...,
        ge=0,
    )

    disponible: bool = True

    @field_validator("nombre")
    @classmethod
    def validar_nombre(cls, valor: str) -> str:
        valor = valor.strip()

        if not valor:
            raise ValueError("El nombre no puede contener solo espacios")

        return valor

class ProductoCreate(ProductoBase):
    categoria_id: int = Field(..., gt=0)

class ProductoUpdate(ProductoBase):
   categoria_id: int = Field(..., gt=0)
   

class ProductoRead(ProductoBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    activo: bool
    categoria: "CategoriaRead"


class ProductosPaginados(BaseModel):
    productos: list[ProductoRead] = Field(default_factory=list)
    total: int

class ProductoStockUpdate(BaseModel):
    stock: int = Field(..., ge=0)
    disponible: bool