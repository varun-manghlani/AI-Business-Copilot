from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db

from app.schemas.email import EmailRequest
from app.services.email_service import generate_email

from models.User import User
from app.services.auth.auth_dependency import get_current_user

router = APIRouter()


@router.post("/email/generate")
def email_generator(
    request: EmailRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_email(
        recipient=request.recipient,
        subject=request.subject,
        purpose=request.purpose,
        tone=request.tone,
        db=db,
        user_id=current_user.id,
    )