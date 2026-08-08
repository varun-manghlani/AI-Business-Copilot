from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from models.AIUsage import AIUsage
from models.conversation import Conversation


def get_dashboard_stats(
    db: Session,
    user_id: int,
):
    # ---------------------------------
    # Total AI Chats
    # ---------------------------------

    ai_chats = (
        db.query(Conversation)
        .filter(
            Conversation.user_id == user_id
        )
        .count()
    )

    # ---------------------------------
    # Total AI Tool Usage
    # ---------------------------------

    emails_generated = (
        db.query(AIUsage)
        .filter(
            AIUsage.user_id == user_id,
            AIUsage.tool_name == "email",
        )
        .count()
    )

    reports_generated = (
        db.query(AIUsage)
        .filter(
            AIUsage.user_id == user_id,
            AIUsage.tool_name == "report",
        )
        .count()
    )

    meetings_summarized = (
        db.query(AIUsage)
        .filter(
            AIUsage.user_id == user_id,
            AIUsage.tool_name == "meeting",
        )
        .count()
    )

    # ---------------------------------
    # Today's usage
    # ---------------------------------

    today = datetime.utcnow().date()

    tomorrow = today + timedelta(days=1)

    start_of_today = datetime.combine(
        today,
        datetime.min.time(),
    )

    start_of_tomorrow = datetime.combine(
        tomorrow,
        datetime.min.time(),
    )

    # Conversation currently does not have
    # created_at, so today's chat count
    # cannot be calculated yet.
    ai_chats_today = (
        db.query(Conversation)
        .filter(
            Conversation.user_id == user_id,
        )
        .count()
    )

    emails_today = (
        db.query(AIUsage)
        .filter(
            AIUsage.user_id == user_id,
            AIUsage.tool_name == "email",
            AIUsage.created_at >= start_of_today,
            AIUsage.created_at < start_of_tomorrow,
        )
        .count()
    )

    reports_today = (
        db.query(AIUsage)
        .filter(
            AIUsage.user_id == user_id,
            AIUsage.tool_name == "report",
            AIUsage.created_at >= start_of_today,
            AIUsage.created_at < start_of_tomorrow,
        )
        .count()
    )

    meetings_today = (
        db.query(AIUsage)
        .filter(
            AIUsage.user_id == user_id,
            AIUsage.tool_name == "meeting",
            AIUsage.created_at >= start_of_today,
            AIUsage.created_at < start_of_tomorrow,
        )
        .count()
    )

    return {
        "ai_chats": ai_chats,
        "emails_generated": emails_generated,
        "reports_generated": reports_generated,
        "meetings_summarized": meetings_summarized,
        "ai_chats_today": ai_chats_today,
        "emails_today": emails_today,
        "reports_today": reports_today,
        "meetings_today": meetings_today,
    }


# ---------------------------------
# Recent Activity
# ---------------------------------

def get_recent_activity(
    db: Session,
    user_id: int,
    limit: int = 5,
):
    activities = (
        db.query(AIUsage)
        .filter(
            AIUsage.user_id == user_id
        )
        .order_by(
            AIUsage.created_at.desc()
        )
        .limit(limit)
        .all()
    )

    return activities