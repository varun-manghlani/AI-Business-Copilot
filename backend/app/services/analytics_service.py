from sqlalchemy.orm import Session

from app.crud.analytics_crud import (
    get_dashboard_stats,
    get_recent_activity,
)


def get_analytics(db: Session):
    stats = get_dashboard_stats(db)

    stats["recent_activity"] = get_recent_activity(db)

    return stats