import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator, AnyHttpUrl
from app.models.application import ApplicationStatus
from app.schemas.job import JobOut
from app.schemas.user import UserOut


class ApplicationCreate(BaseModel):
    job_id: uuid.UUID
    cover_letter: str
    resume_url: Optional[str] = None
    resume_text: Optional[str] = None

    @field_validator("cover_letter")
    @classmethod
    def cover_letter_length(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 50:
            raise ValueError("Cover letter must be at least 50 characters")
        if len(v) > 5000:
            raise ValueError("Cover letter must not exceed 5000 characters")
        return v

    @field_validator("resume_text")
    @classmethod
    def resume_text_length(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and len(v) > 3000:
            raise ValueError("Resume text must not exceed 3000 characters")
        return v


class StatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationBriefOut(BaseModel):
    id: uuid.UUID
    job_id: uuid.UUID
    job_title: str
    status: ApplicationStatus
    applied_at: datetime

    model_config = {"from_attributes": True}


class ApplicationOut(BaseModel):
    id: uuid.UUID
    job: JobOut
    candidate: UserOut
    cover_letter: str
    resume_url: Optional[str]
    resume_text: Optional[str]
    status: ApplicationStatus
    applied_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ApplicationListOut(BaseModel):
    items: list[ApplicationOut]
    total: int
