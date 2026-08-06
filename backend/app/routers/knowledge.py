from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from database.database import get_db
from app.schemas.knowledge import KnowledgeDocumentResponse
from app.services.knowledge_query_service import get_all_documents
from app.services.knowledge_service import upload_document
from app.services.knowledge_delete_service import delete_document
from models.User import User

from app.services.auth.auth_dependency import (
    get_current_admin,
)

router = APIRouter(
    prefix="/knowledge",
    tags=["Knowledge Base"],
)


@router.post("/upload")
def upload_company_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed.",
        )

    document = upload_document(
        db=db,
        upload_file=file,
    )

    return {
        "message": "Document uploaded successfully.",
        "document": {
            "id": document.id,
            "original_filename": document.original_filename,
            "status": document.status,
            "file_size": document.file_size,
            "uploaded_at": document.uploaded_at,
        },
    }


@router.get(
    "/documents",
    response_model=list[KnowledgeDocumentResponse],
)
def list_documents(
    db: Session = Depends(get_db),
):
    return get_all_documents(db)


@router.delete("/documents/{document_id}")
def delete_company_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    delete_document(
        db=db,
        document_id=document_id,
    )

    return {
        "message": "Document deleted successfully."
    }