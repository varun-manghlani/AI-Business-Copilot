from langchain_ollama import ChatOllama
from langchain_core.messages import SystemMessage
from langgraph.graph import MessagesState

from app.services.retrieval_service import search_documents

llm = ChatOllama(
    model="llama3.2:3b"
)


def chat_node(state: MessagesState):
    user_question = state["messages"][-1].content

    retrieval_results = search_documents(user_question)

    documents = retrieval_results["documents"][0]

    if documents:
        context = "\n\n".join(documents)

        system_prompt = f"""
You are an AI Business Copilot.

Your first priority is to answer using the company knowledge provided below.

Rules:
1. If the company knowledge contains the answer, use it.
2. If the company knowledge only partially answers the question, use it first and then complete the answer using your general knowledge.
3. If the company knowledge does not contain the answer at all, answer using your own general knowledge.
4. Never reply with "I couldn't find that information in my knowledge base."
5. Do not mention whether information came from the company knowledge unless the user asks.

Company Knowledge:

{context}
"""
    else:
        system_prompt = """
You are an AI Business Copilot.

The company knowledge does not contain information related to this question.

Answer using your own general knowledge.

Be accurate, helpful, and professional.
"""

    messages = [
        SystemMessage(content=system_prompt),
        *state["messages"],
    ]

    response = llm.invoke(messages)

    return {
        "messages": [response]
    }