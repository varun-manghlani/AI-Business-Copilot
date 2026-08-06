from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="llama3.2:3b"
)


def generate_meeting_summary(request):

    prompt = f"""
You are an expert business meeting assistant.

Summarize the following meeting notes.

Meeting Notes:

{request.meeting_notes}

Return your answer in this format:

# Meeting Summary

## Summary

## Key Decisions

## Action Items

## Next Steps

Keep the response professional and concise.
"""

    response = llm.invoke(prompt)

    return {
        "summary": response.content
    }