from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="llama3.2:3b"
)


def generate_email(request):

    prompt = f"""
You are an expert business email writer.

Write a professional email.

Recipient:
{request.recipient}

Subject:
{request.subject}

Purpose:
{request.purpose}

Tone:
{request.tone}

Only return the email.
"""

    response = llm.invoke(prompt)

    return {
        "email": response.content
    }