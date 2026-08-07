from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db

from app.schemas.meeting import MeetingSummaryRequest
from app.services.meeting_service import generate_meeting_summary

from models.User import User
from app.services.auth.auth_dependency import get_current_user

router = APIRouter()


@router.post("/meeting/summarize")
def meeting_summary(
    request: MeetingSummaryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return generate_meeting_summary(
        meeting_notes=request.meeting_notes,
        db=db,
        user_id=current_user.id,
    )