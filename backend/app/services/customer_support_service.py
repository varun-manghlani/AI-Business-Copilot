from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="llama3.2:3b"
)


def generate_customer_response(request):

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

    return {
        "response": response.content
    }