from datetime import UTC, datetime

from sqlalchemy import Boolean, Column, DateTime, String
from sqlmodel import Field, SQLModel


class Usuario(SQLModel, table=True):
    __tablename__ = "usuario"  # type: ignore

    id: int | None = Field(default=None, primary_key=True)

    username: str = Field(
        sa_column=Column(String(50), nullable=False, unique=True)
    )

    full_name: str = Field(
        sa_column=Column(String(80), nullable=False)
    )

    email: str = Field(
        sa_column=Column(String(254), nullable=False, unique=True)
    )

    hashed_password: str = Field(
        sa_column=Column(String(255), nullable=False)
    )

    role: str = Field(
        default="user",
        sa_column=Column(String(20), nullable=False, default="user")
    )

    disabled: bool = Field(
        default=False,
        sa_column=Column(Boolean, nullable=False, default=False)
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        sa_column=Column(DateTime(timezone=True), nullable=False)
    )

