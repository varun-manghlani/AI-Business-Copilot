from datetime import datetime

from sqlalchemy import Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from database.database import Base


class CompanyDocument(Base):
    __tablename__ = "company_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    original_filename: Mapped[str] = mapped_column(String)

    stored_filename: Mapped[str] = mapped_column(String, unique=True)

    filepath: Mapped[str] = mapped_column(String)

    page_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    status: Mapped[str] = mapped_column(
        String,
        default="Uploaded",
    )

    file_size: Mapped[str] = mapped_column(String)

    chunk_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )