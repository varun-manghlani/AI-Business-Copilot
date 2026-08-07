from sqlalchemy.orm import Session
from langchain_ollama import ChatOllama

from app.services.ai_usage_service import save_ai_usage

llm = ChatOllama(
    model="llama3.2:3b"
)


def generate_report(
    report_type: str,
    project_name: str,
    details: str,
    audience: str,
    db: Session,
    user_id: int,
):
    prompt = f"""
You are a professional business analyst.

Generate a detailed business report.

Report Type:
{report_type}

Project:
{project_name}

Details:
{details}

Audience:
{audience}

Format the report professionally with:

1. Title
2. Executive Summary
3. Key Points
4. Recommendations
5. Next Steps

Return only the report.
"""

    response = llm.invoke(prompt)

    # Save analytics
    save_ai_usage(
        db=db,
        user_id=user_id,
        tool_name="report",
    )

    return {
        "report": response.content
    }