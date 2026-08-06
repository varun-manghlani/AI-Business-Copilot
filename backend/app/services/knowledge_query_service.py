from sqlalchemy.orm import Session

from models.CompanyDocument import CompanyDocument


def get_all_documents(db: Session):
    return (
        db.query(CompanyDocument)
        .order_by(CompanyDocument.uploaded_at.desc())
        .all()
    )