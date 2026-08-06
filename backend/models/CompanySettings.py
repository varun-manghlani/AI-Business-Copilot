from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from database.database import Base


class CompanySettings(Base):
    __tablename__ = "company_settings"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
    )

    company_name: Mapped[str] = mapped_column(
        String,
        default="My Company",
    )

    ai_name: Mapped[str] = mapped_column(
        String,
        default="Business Copilot",
    )

    company_description: Mapped[str] = mapped_column(
        Text,
        default="",
    )

    model_name: Mapped[str] = mapped_column(
        String,
        default="llama3.2:3b",
    )

    response_style: Mapped[str] = mapped_column(
        String,
        default="Professional",
    )

    max_chunks: Mapped[int] = mapped_column(
        Integer,
        default=5,
    )

    allow_general_knowledge: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
    )

    system_prompt: Mapped[str] = mapped_column(
        Text,
        default="You are a helpful AI Business Copilot.",
    )