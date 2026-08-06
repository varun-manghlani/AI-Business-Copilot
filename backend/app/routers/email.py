from fastapi import APIRouter

from app.schemas.email import EmailRequest
from app.services.email_service import generate_email

router = APIRouter()

@router.post("/email/generate")
def email_generator(request: EmailRequest):
    return generate_email(request)