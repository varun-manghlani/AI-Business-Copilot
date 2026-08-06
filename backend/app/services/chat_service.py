from langchain_core.messages import HumanMessage
from app.graph.graph import graph
from database.database import SessionLocal
from app.services.message_service import create_new_message


def get_chat_response(
    message: str,
    thread_id: str,
    conversation_id: int,
):
    db = SessionLocal()

    create_new_message(
        db=db,
        conversation_id=conversation_id,
        role="user",
        content=message,
    )

    db.close()

    full_response = ""
    
    for chunk, metadata in graph.stream(
        {
            "messages": [
                HumanMessage(content=message)
            ]
        },
        config={
            "configurable": {
                "thread_id": thread_id
            }
        },
        stream_mode="messages"
    ):
      chunk_text = chunk.content

      full_response += chunk_text

      yield chunk_text

      db = SessionLocal()

    create_new_message(
        db=db,
        conversation_id=conversation_id,
        role="assistant",
        content=full_response,
    )

    db.close()