from sqlalchemy.orm import Session

from app.services.email_service import generate_email
from app.services.report_service import generate_report
from app.services.meeting_service import generate_meeting_summary


def execute_agent(
    intent: dict,
    db: Session,
    user_id: int,
):
    action = intent.get("action")

    # =========================
    # Email Generator
    # =========================
    if action == "email":
        email_result = generate_email(
            recipient=intent.get("recipient", ""),
            subject=intent.get("subject", ""),
            purpose=intent.get("purpose", ""),
            tone=intent.get("tone", "Professional"),
            db=db,
            user_id=user_id,
        )

        return {
            "success": True,
            "action": "email",
            "page": "email-generator",
            "recipient": intent.get("recipient", ""),
            "subject": intent.get("subject", ""),
            "purpose": intent.get("purpose", ""),
            "tone": intent.get("tone", "Professional"),
            "email": email_result["email"],
        }

    # =========================
    # Report Generator
    # =========================
    if action == "report":
        report_result = generate_report(
            report_type=intent.get("report_type", ""),
            project_name=intent.get("project_name", ""),
            details=intent.get("details", ""),
            audience=intent.get("audience", ""),
            db=db,
            user_id=user_id,
        )

        return {
            "success": True,
            "action": "report",
            "page": "report-generator",
            "report_type": intent.get("report_type", ""),
            "project_name": intent.get("project_name", ""),
            "details": intent.get("details", ""),
            "audience": intent.get("audience", ""),
            "report": report_result["report"],
        }

    # =========================
    # Meeting Summary
    # =========================
    if action == "meeting":
        meeting_result = generate_meeting_summary(
            meeting_notes=intent.get("meeting_notes", ""),
            db=db,
            user_id=user_id,
        )

        return {
            "success": True,
            "action": "meeting",
            "page": "meeting-summary",
            "meeting_notes": intent.get("meeting_notes", ""),
            "summary": meeting_result["summary"],
        }

    return {
        "success": False,
        "message": "I don't know how to perform that action yet."
    }