import os

from sqlalchemy.orm import Session

from models.CompanyDocument import CompanyDocument
from app.services.storage_service import save_document
from app.services.pdf_service import extract_text_from_pdf
from app.services.document_processor import process_document
from app.services.embedding_service import create_embeddings
from app.services.vector_service import add_chunks


def upload_document(
    db: Session,
    upload_file,
):
    # Save file to disk
    stored_filename, filepath = save_document(upload_file)


    # Get file size
    file_size = os.path.getsize(filepath)

    size_mb = round(file_size / (1024 * 1024), 2)

    # Create database record
    document = CompanyDocument(
      original_filename=upload_file.filename,
      stored_filename=stored_filename,
      filepath=filepath,
      status="Uploaded",
      file_size=f"{size_mb} MB",
      page_count=0,
      chunk_count=0,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    processing_result = process_document(filepath)

    chunks = processing_result["chunks"]

    page_count = processing_result["page_count"]

    embeddings = create_embeddings(
        [chunk["text"] for chunk in chunks]
    )


    add_chunks(
        document=document,
        chunks=chunks,
        embeddings=embeddings,
    )

    document.page_count = page_count
    document.chunk_count = len(chunks)
    document.status = "Indexed"

    db.commit()
    db.refresh(document)

    return document