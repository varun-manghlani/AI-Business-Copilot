from sqlalchemy.orm import Session

from models.message import Message


def create_message(
    db: Session,
    conversation_id: int,
    role: str,
    content: str,
):
    message = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


def get_messages(
    db: Session,
    conversation_id: int,
):
    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .all()
    )

    return messages

def delete_messages(
    db: Session,
    conversation_id: int,
):
    (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .delete()
    )

    db.commit()