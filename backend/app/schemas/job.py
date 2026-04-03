import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator, model_validator
from app.models.job import JobType
from app.schemas.user import UserOut


class JobCreate(BaseModel):
    title: str
    description: str
    location: str
    job_type: JobType
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None

    @field_validator("title")
    @classmethod
    def title_length(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3:
            raise ValueError("Title must be at least 3 characters")
        return v

    @field_validator("description")
    @classmethod
    def description_length(cls, v: str) -> str:
        if len(v.strip()) < 20:
            raise ValueError("Description must be at least 20 characters")
        return v.strip()

    @field_validator("location")
    @classmethod
    def location_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Location is required")
        return v.strip()

    @model_validator(mode="after")
    def salary_range_valid(self) -> "JobCreate":
        if self.salary_min is not None and self.salary_max is not None:
            if self.salary_max < self.salary_min:
                raise ValueError("salary_max must be greater than or equal to salary_min")
        return self


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[JobType] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    is_active: Optional[bool] = None

    @field_validator("title")
    @classmethod
    def title_length(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if len(v) < 3:
                raise ValueError("Title must be at least 3 characters")
        return v

    @field_validator("description")
    @classmethod
    def description_length(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and len(v.strip()) < 20:
            raise ValueError("Description must be at least 20 characters")
        return v


class JobOut(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    location: str
    job_type: JobType
    salary_min: Optional[int]
    salary_max: Optional[int]
    is_active: bool
    posted_by: UserOut
    application_count: int = 0
    pending_count: int = 0
    accepted_count: int = 0
    rejected_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class JobListOut(BaseModel):
    items: list[JobOut]
    total: int
    page: int
    page_size: int
    pages: int
