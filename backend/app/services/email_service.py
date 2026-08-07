from sqlalchemy.orm import Session
from langchain_ollama import ChatOllama

from app.services.ai_usage_service import save_ai_usage

llm = ChatOllama(
    model="llama3.2:3b"
)


def generate_email(
    recipient: str,
    subject: str,
    purpose: str,
    tone: str,
    db: Session,
    user_id: int,
):
    prompt = f"""
You are an expert business email writer.

Write a professional email.

Recipient:
{recipient}

Subject:
{subject}

Purpose:
{purpose}

Tone:
{tone}

Only return the email.
"""

    response = llm.invoke(prompt)

    # Save analytics
    save_ai_usage(
        db=db,
        user_id=user_id,
        tool_name="email",
    )

    return {
        "email": response.content
    }