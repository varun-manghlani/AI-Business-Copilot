from sqlalchemy.orm import Session
from langchain_ollama import ChatOllama

from app.services.ai_usage_service import save_ai_usage

llm = ChatOllama(
    model="llama3.2:3b"
)


def generate_customer_response(
    request,
    db: Session,
    user_id: int,
):
    prompt = f"""
You are an experienced customer support representative.

Answer the customer's question professionally.

Customer Question:

{request.customer_question}

Rules:

- Be polite.
- Be concise.
- Be helpful.
- If information is missing, explain politely.
- End with an offer for further assistance.

Return only the response.
"""

    response = llm.invoke(prompt)

    # Save analytics
    save_ai_usage(
        db=db,
        user_id=user_id,
        tool_name="support",
    )

    return {
        "response": response.content
    }