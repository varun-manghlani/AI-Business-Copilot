from pydantic import BaseModel


class EmailRequest(BaseModel):
    recipient: str
    subject: str
    purpose: str
    tone: str