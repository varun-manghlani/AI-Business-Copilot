from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db

from app.schemas.report import ReportRequest
from app.services.report_service import generate_report

from models.User import User
from app.services.auth.auth_dependency import get_current_user

router = APIRouter()


@router.post("/report/generate")
def report_generator(
    request: ReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
 return generate_report(
    report_type=request.report_type,
    project_name=request.project_name,
    details=request.details,
    audience=request.audience,
    db=db,
    user_id=current_user.id,
 )