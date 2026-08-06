from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from app.services.message_service import (
    create_new_message,
    get_conversation_messages,
)

router = APIRouter()

@router.get("/conversation/{conversation_id}/messages")
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
):
    messages = get_conversation_messages(
        db=db,
        conversation_id=conversation_id,
    )

    return messages