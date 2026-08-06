from sqlalchemy.orm import Session

from app.crud.message_crud import (
    create_message,
    get_messages,
    delete_messages,
)


def create_new_message(
    db: Session,
    conversation_id: int,
    role: str,
    content: str,
):
    message = create_message(
        db=db,
        conversation_id=conversation_id,
        role=role,
        content=content,
    )

    return message


def get_conversation_messages(
    db: Session,
    conversation_id: int,
    user_id: int,
):
    messages = get_messages(
        db=db,
        conversation_id=conversation_id,
    )

    return messages

def delete_conversation_messages(
    db: Session,
    conversation_id: int,
):
    delete_messages(
        db=db,
        conversation_id=conversation_id,
    )