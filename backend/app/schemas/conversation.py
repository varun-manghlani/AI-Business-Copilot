from pydantic import BaseModel


class ConversationCreateRequest(BaseModel):
    title: str