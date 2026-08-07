from sqlalchemy.orm import Session

from models.AIUsage import AIUsage


def log_ai_usage(
    db: Session,
    user_id: int,
    tool_name: str,
):
    usage = AIUsage(
        user_id=user_id,
        tool_name=tool_name,
    )

    db.add(usage)
    db.commit()