import json

from langchain_ollama import ChatOllama

llm = ChatOllama(
    model="llama3.2:3b",
)

PAGE_MAP = {
    "chat": "chat",
    "analytics": "analytics",
    "knowledge": "knowledge",
    "settings": "settings",
    "email": "email-generator",
    "report": "report-generator",
    "meeting": "meeting-summary",
    "support": "customer-support",
}


def detect_voice_intent(request):
    prompt = f"""
You are an AI intent classifier and information extractor.

Your job is to understand the user's voice command.

Return ONLY valid JSON.

Supported actions:

- navigate
- email
- report
- meeting
- support
- unknown

Supported pages (RETURN THESE VALUES EXACTLY):

chat
analytics
knowledge
settings
email-generator
report-generator
meeting-summary
customer-support

For email actions extract:

recipient
subject
purpose
tone

If a value is missing, return an empty string.

Do NOT invent information.

For report actions extract:

report_type
project_name
details
audience

If the user does not explicitly provide report details, infer a short description from the request.

Do not leave "details" empty unless there is absolutely no information available.

Do NOT invent information.

For meeting actions extract:

meeting_notes

If the user gives meeting content, put the complete meeting text into
meeting_notes.

Do not summarize it.

Return the original meeting notes.

If nothing is provided, return an empty string.

Examples:

User:
Open analytics

Response:
{{
    "action":"navigate",
    "page":"analytics"
}}

User:
Take me to settings

Response:
{{
    "action":"navigate",
    "page":"settings"
}}

User:
Write an email to John regarding tomorrow's client meeting in a professional tone.

Response:
{{
    "action":"email",
    "recipient":"John",
    "subject":"Tomorrow's Client Meeting",
    "purpose":"Discuss tomorrow's client meeting",
    "tone":"Professional"
}}

User:
Draft an email to Sarah thanking her for attending today's meeting in a friendly tone.

Response:
{{
    "action":"email",
    "recipient":"Sarah",
    "subject":"Thank You for Today's Meeting",
    "purpose":"Thank Sarah for attending today's meeting",
    "tone":"Friendly"
}}

User:
Generate a weekly sales report for Project Phoenix for the management team.

Response:
Response:
{{
"action":"report",
"report_type":"Weekly Sales Report",
"project_name":"Project Phoenix",
"details":"Sales performance for the week",
"audience":"Management Team"
}}

User:
Create a financial report for AI Business Copilot for investors.

Response:
{{
"action":"report",
"report_type":"Financial Report",
"project_name":"AI Business Copilot",
"details":"",
"audience":"Investors"
}}

User:
Generate a weekly sales report for Project Phoenix for the management team.

Response:
{{
"action":"report",
"report_type":"Weekly Sales Report",
"project_name":"Project Phoenix",
"details":"Weekly sales performance for Project Phoenix",
"audience":"Management Team"
}}

User:
Summarize this meeting.

John completed the frontend.
Sarah finished the backend.
The deployment is scheduled for Friday.

Response:
{{
"action":"meeting",
"meeting_notes":"John completed the frontend. Sarah finished the backend. The deployment is scheduled for Friday."
}}

User:
Reply to my customer

Response:
{{
    "action":"support"
}}

If the command is not supported, return:

{{
    "action":"unknown"
}}

User:

{request.transcript}

Return ONLY valid JSON.
"""

    response = llm.invoke(prompt)

    try:
        result = json.loads(response.content)
    except Exception:
        return {
            "success": False,
            "message": "Sorry, I couldn't understand your request.",
        }

    action = result.get("action")

    if action == "navigate":
        page = result.get("page")

        if page not in PAGE_MAP.values():
            return {
                "success": False,
                "message": f"Sorry, '{page}' is not available in AI Business Copilot.",
            }

    elif action in PAGE_MAP:
        result["page"] = PAGE_MAP[action]

    elif action == "unknown":
        return {
            "success": False,
            "message": "Sorry, I don't support that command yet.",
        }

    else:
        return {
            "success": False,
            "message": "Sorry, I couldn't understand your request.",
        }

    result["success"] = True

    return result  
