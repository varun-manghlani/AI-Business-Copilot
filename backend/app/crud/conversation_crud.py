from sqlalchemy.orm import Session

from models.conversation import Conversation


def create_conversation(
    db: Session,
    title: str,
    thread_id: str,
    user_id: int,
):
    conversation = Conversation(
        title=title,
        thread_id=thread_id,
        user_id=user_id,
    )

    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return conversation


def get_all_conversations(
    db: Session,
    user_id: int,
):
    print("Logged in User ID:", user_id)

    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .all()
    )

    print("Conversation IDs:", [c.id for c in conversations])
    print("Conversation Owners:", [c.user_id for c in conversations])

    return conversations


def delete_conversation(
    db: Session,
    conversation_id: int,
    user_id: int,
):
    print(f"Deleting conversation {conversation_id} for user {user_id}")

    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
        .first()
    )

    print("Found conversation:", conversation)

    if conversation is None:
        return None

    db.delete(conversation)
    db.commit()

    print("Conversation deleted successfully.")

    return conversation

def update_conversation_title(
    db: Session,
    conversation_id: int,
    user_id: int,
    title: str,
):
    conversation = (
        db.query(Conversation)
        .filter(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id,
        )
        .first()
    )

    if conversation is None:
        return None

    print("Saving title to DB:", title)

    conversation.title = title

    db.commit()

    db.refresh(conversation)

    return conversation