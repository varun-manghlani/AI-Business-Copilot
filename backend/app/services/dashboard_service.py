from sqlalchemy.orm import Session

from app.crud.dashboard_crud import (
    get_dashboard_stats,
    get_recent_activity,
)


def get_user_dashboard_stats(
    db: Session,
    user_id: int,
):
    return get_dashboard_stats(
        db=db,
        user_id=user_id,
    )


def get_user_recent_activity(
    db: Session,
    user_id: int,
):
    return get_recent_activity(
        db=db,
        user_id=user_id,
        limit=5,
    )