from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    thread_id: str
    conversation_id: int


class ChatResponse(BaseModel):
    your_message: str
    reply: str