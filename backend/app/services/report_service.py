from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="llama3.2:3b"
)


def generate_report(request):

    prompt = f"""
You are a professional business analyst.

Generate a detailed business report.

Report Type:
{request.report_type}

Project:
{request.project_name}

Details:
{request.details}

Audience:
{request.audience}

Format the report professionally with:

1. Title
2. Executive Summary
3. Key Points
4. Recommendations
5. Next Steps

Return only the report.
"""

    response = llm.invoke(prompt)

    return {
        "report": response.content
    }