from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.chat import ChatRequest
from app.services.chat_service import get_chat_response

router = APIRouter()


@router.post("/chat")
def chat(request: ChatRequest):
    return StreamingResponse(
        get_chat_response(
            request.message,
            request.thread_id,
            request.conversation_id,
        ),
        media_type="text/plain",
    )