from pydantic import BaseModel


class CustomerSupportRequest(BaseModel):
    customer_question: str