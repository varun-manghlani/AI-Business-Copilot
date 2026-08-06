from fastapi import APIRouter

from app.schemas.customer_support import CustomerSupportRequest
from app.services.customer_support_service import generate_customer_response

router = APIRouter()


@router.post("/customer-support")
def customer_support(request: CustomerSupportRequest):
    return generate_customer_response(request)