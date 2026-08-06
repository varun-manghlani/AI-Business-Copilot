from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database.database import get_db

from app.services.conversation_service import (
    create_new_conversation,
    get_conversations,
    delete_existing_conversation,
    rename_conversation,
)

from app.schemas.conversation import ConversationCreateRequest
from app.services.message_service import get_conversation_messages

from models.User import User
from app.services.auth.auth_dependency import get_current_user

router = APIRouter()


class RenameConversationRequest(BaseModel):
    title: str


@router.post("/conversation")
def create_conversation(
    request: ConversationCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = create_new_conversation(
        db=db,
        title=request.title,
        user_id=current_user.id,
    )

    return conversation


@router.get("/conversations")
def get_all_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversations = get_conversations(
        db=db,
        user_id=current_user.id,
    )

    return conversations


@router.put("/conversation/{conversation_id}/title")
def update_conversation_title_route(
    conversation_id: int,
    request: RenameConversationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = rename_conversation(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id,
        title=request.title,
    )

    if conversation is None:
        return {"message": "Conversation not found"}

    return conversation


@router.delete("/conversation/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = delete_existing_conversation(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id,
    )

    if conversation is None:
        return {"message": "Conversation not found"}

    return {"message": "Conversation deleted successfully"}


@router.get("/conversation/{conversation_id}/messages")
def get_messages(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    messages = get_conversation_messages(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id,
    )

    return messages