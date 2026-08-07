from sqlalchemy.orm import Session
from langchain_ollama import ChatOllama

from app.services.ai_usage_service import save_ai_usage

llm = ChatOllama(
    model="llama3.2:3b"
)


def generate_meeting_summary(
    meeting_notes: str,
    db: Session,
    user_id: int,
):
    prompt = f"""
You are an expert business meeting assistant.

Summarize the following meeting notes.

Meeting Notes:

{meeting_notes}

Return your answer in this format:

# Meeting Summary

## Summary

## Key Decisions

## Action Items

## Next Steps

Keep the response professional and concise.
"""

    response = llm.invoke(prompt)

    # Save analytics
    save_ai_usage(
        db=db,
        user_id=user_id,
        tool_name="meeting",
    )

    return {
        "summary": response.content
    }