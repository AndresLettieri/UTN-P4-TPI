from sqlalchemy import Boolean, Column, String
from sqlmodel import Field, SQLModel


class FormaPago(SQLModel, table=True):
    __tablename__ = "forma_pago"  # type: ignore

    codigo: str = Field(
        sa_column=Column(String(30), primary_key=True, nullable=False)
    )
    descripcion: str = Field(
        sa_column=Column(String(80), nullable=False)
    )
    activo: bool = Field(
        sa_column=Column(Boolean, nullable=False, default=True)
    )
