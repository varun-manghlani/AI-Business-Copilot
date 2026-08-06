from pydantic import BaseModel


class MeetingSummaryRequest(BaseModel):
    meeting_notes: str