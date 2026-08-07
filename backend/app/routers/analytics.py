from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db

from app.services.analytics_service import get_analytics

from models.User import User
from app.services.auth.auth_dependency import get_current_admin

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    return get_analytics(db)