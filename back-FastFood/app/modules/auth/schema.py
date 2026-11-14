from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from sqlmodel import SQLModel


class UserCreate(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    full_name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    password: str = Field(min_length=8)

    @field_validator("username", "full_name")
    @classmethod
    def validar_texto(cls, valor: str) -> str:
        valor = valor.strip()

        if not valor:
            raise ValueError("El campo no puede contener solo espacios")

        return valor


class UserPublic(BaseModel):
    id: int
    username: str
    full_name: str
    email: EmailStr
    role: str
    disabled: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class Token(SQLModel):
    access_token: str
    token_type:   str = "bearer"
    expires_in:   int  # segundos hasta expiración