from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db

from models.User import User
from app.services.auth.auth_dependency import get_current_user

from app.schemas.voice import VoiceRequest
from app.services.voice_service import detect_voice_intent
from app.services.agent_service import execute_agent

router = APIRouter()


@router.post("/voice/intent")
def voice_intent(
    request: VoiceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return detect_voice_intent(request)

@router.post("/voice/execute")
def voice_execute(
    request: VoiceRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    intent = detect_voice_intent(request)

    if not intent.get("success", False):
        return intent

    return execute_agent(
        intent=intent,
        db=db,
        user_id=current_user.id,
    )