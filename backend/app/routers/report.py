from fastapi import APIRouter

from app.schemas.report import ReportRequest
from app.services.report_service import generate_report

router = APIRouter()


@router.post("/report/generate")
def report_generator(request: ReportRequest):
    return generate_report(request)