import uuid

from sqlalchemy.orm import Session

from app.crud.conversation_crud import (
    create_conversation,
    get_all_conversations,
    delete_conversation,
    update_conversation_title,
)

from app.services.message_service import delete_conversation_messages

from app.services.title_service import generate_chat_title


def create_new_conversation(
    db: Session,
    title: str,
    user_id: int,
):
    thread_id = str(uuid.uuid4())

    conversation = create_conversation(
        db=db,
        title=title,
        thread_id=thread_id,
        user_id=user_id,
    )

    return conversation


def get_conversations(
    db: Session,
    user_id: int,
):
    conversations = get_all_conversations(
        db=db,
        user_id=user_id,
    )

    return conversations


def delete_existing_conversation(
    db: Session,
    conversation_id: int,
    user_id: int,
):
    delete_conversation_messages(
        db=db,
        conversation_id=conversation_id,
    )

    conversation = delete_conversation(
        db=db,
        conversation_id=conversation_id,
        user_id=user_id,
    )

    return conversation


def rename_conversation(
    db: Session,
    conversation_id: int,
    user_id: int,
    title: str,
):
    ai_title = generate_chat_title(title)

    conversation = update_conversation_title(
        db=db,
        conversation_id=conversation_id,
        user_id=user_id,
        title=ai_title,
    )

    return conversation