from sqlalchemy import func, desc
from sqlalchemy.orm import Session

from models.User import User
from models.conversation import Conversation
from models.CompanyDocument import CompanyDocument
from models.AIUsage import AIUsage


def get_dashboard_stats(db: Session):
    return {
        "users": db.query(
            func.count(User.id)
        ).scalar(),

        "conversations": db.query(
            func.count(Conversation.id)
        ).scalar(),

        "documents": db.query(
            func.count(CompanyDocument.id)
        ).scalar(),

        "emails": db.query(
            func.count(AIUsage.id)
        ).filter(
            AIUsage.tool_name == "email"
        ).scalar(),

        "reports": db.query(
            func.count(AIUsage.id)
        ).filter(
            AIUsage.tool_name == "report"
        ).scalar(),

        "meetings": db.query(
            func.count(AIUsage.id)
        ).filter(
            AIUsage.tool_name == "meeting"
        ).scalar(),

        "support": db.query(
            func.count(AIUsage.id)
        ).filter(
            AIUsage.tool_name == "support"
        ).scalar(),

        "ai_requests": db.query(
            func.count(AIUsage.id)
        ).scalar(),
    }


def get_recent_activity(db: Session):
    activities = (
        db.query(AIUsage)
        .order_by(desc(AIUsage.created_at))
        .limit(5)
        .all()
    )

    return [
        {
            "tool": activity.tool_name,
            "created_at": activity.created_at,
        }
        for activity in activities
    ]