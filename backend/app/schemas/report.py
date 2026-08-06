from pydantic import BaseModel


class ReportRequest(BaseModel):
    report_type: str
    project_name: str
    details: str
    audience: str