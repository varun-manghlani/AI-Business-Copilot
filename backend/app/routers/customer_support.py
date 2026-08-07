from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db

from app.schemas.customer_support import CustomerSupportRequest
from app.services.customer_support_service import generate_customer_response

from models.User import User
from app.services.auth.auth_dependency import get_current_user

router = APIRouter()


@router.post("/customer-support/generate")
def customer_support(
    request: CustomerSupportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_customer_response(
        request=request,
        db=db,
        user_id=current_user.id,
    )