import os

from sqlalchemy.orm import Session

from models.CompanyDocument import CompanyDocument
from app.services.vector_service import delete_document_vectors


def delete_document(
    db: Session,
    document_id: int,
):
    document = (
        db.query(CompanyDocument)
        .filter(
            CompanyDocument.id == document_id
        )
        .first()
    )

    if not document:
        raise Exception("Document not found.")

    # Delete vectors
    delete_document_vectors(document.id)

    # Delete PDF file
    if os.path.exists(document.filepath):
        os.remove(document.filepath)

    # Delete database record
    db.delete(document)
    db.commit()