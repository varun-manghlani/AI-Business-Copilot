from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db

from app.services.auth.auth_dependency import (
    get_current_user,
)

from app.services.dashboard_service import (
    get_user_dashboard_stats,
    get_user_recent_activity,
)

from models.User import User


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/stats")
def dashboard_stats(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    return get_user_dashboard_stats(
        db=db,
        user_id=current_user.id,
    )


@router.get("/activity")
def dashboard_activity(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):
    activities = get_user_recent_activity(
        db=db,
        user_id=current_user.id,
    )

    return [
        {
            "id": activity.id,
            "tool_name": activity.tool_name,
            "created_at": activity.created_at,
        }
        for activity in activities
    ]