from datetime import datetime

from pydantic import BaseModel


class KnowledgeDocumentResponse(BaseModel):
    id: int
    original_filename: str
    status: str
    file_size: str
    page_count: int
    chunk_count: int
    uploaded_at: datetime

    class Config:
        from_attributes = True