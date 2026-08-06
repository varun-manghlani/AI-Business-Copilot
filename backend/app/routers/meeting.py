from fastapi import APIRouter

from app.schemas.meeting import MeetingSummaryRequest
from app.services.meeting_service import generate_meeting_summary

router = APIRouter()


@router.post("/meeting/summarize")
def summarize_meeting(request: MeetingSummaryRequest):
    return generate_meeting_summary(request)