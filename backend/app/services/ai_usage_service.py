from sqlalchemy.orm import Session

from app.crud.ai_usage_crud import log_ai_usage


def save_ai_usage(
    db: Session,
    user_id: int,
    tool_name: str,
):
    log_ai_usage(
        db=db,
        user_id=user_id,
        tool_name=tool_name,
    )