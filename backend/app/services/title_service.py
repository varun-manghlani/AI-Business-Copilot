from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="llama3.2:3b",
)


def generate_chat_title(message: str):
    prompt = f"""
Generate a very short title for this conversation.

Rules:
- Maximum 3 words.
- Prefer 2 words.
- Be concise.
- Return ONLY the title.
- No quotation marks.
- No punctuation.
- Return ONLY the title.
- Do not explain anything.
- Do not use markdown.

Conversation:

{message}
"""

    response = llm.invoke(prompt)

    title = response.content.strip()

    print("=" * 50)
    print("User Message :", message)
    print("AI Title     :", title)
    print("=" * 50)

    return title