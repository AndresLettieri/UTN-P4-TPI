from pydantic import BaseModel, EmailStr, Field, field_validator

from app.modules.auth.schema import UserPublic


class UserUpdate(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    full_name: str = Field(min_length=1, max_length=80)
    email: EmailStr

    @field_validator("username", "full_name")
    @classmethod
    def validar_texto(cls, valor: str) -> str:
        valor = valor.strip()

        if not valor:
            raise ValueError("El campo no puede contener solo espacios")

        return valor



class UserList(BaseModel):
    usuarios: list[UserPublic] = Field(default_factory=list)
    total: int