import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, field_validator


class ExperienceItem(BaseModel):
    company: str
    role: str
    start_year: int
    end_year: Optional[int] = None  # None means "present"
    description: Optional[str] = None

    @field_validator("company", "role")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field cannot be empty")
        return v.strip()


class ProjectItem(BaseModel):
    name: str
    description: Optional[str] = None
    url: Optional[str] = None

    @field_validator("name")
    @classmethod
    def not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Project name cannot be empty")
        return v.strip()


class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    resume_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    years_of_experience: Optional[int] = None
    skills: Optional[list[str]] = None
    experience: Optional[list[ExperienceItem]] = None
    projects: Optional[list[ProjectItem]] = None

    @field_validator("bio")
    @classmethod
    def bio_max_length(cls, v: Optional[str]) -> Optional[str]:
        if v and len(v) > 1000:
            raise ValueError("Bio must not exceed 1000 characters")
        return v

    @field_validator("years_of_experience")
    @classmethod
    def experience_non_negative(cls, v: Optional[int]) -> Optional[int]:
        if v is not None and v < 0:
            raise ValueError("Years of experience must be non-negative")
        return v

    @field_validator("skills")
    @classmethod
    def skills_max(cls, v: Optional[list]) -> Optional[list]:
        if v and len(v) > 30:
            raise ValueError("Maximum 30 skills allowed")
        return v


class ProfileOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    bio: Optional[str]
    phone: Optional[str]
    location: Optional[str]
    resume_url: Optional[str]
    linkedin_url: Optional[str]
    github_url: Optional[str]
    years_of_experience: Optional[int]
    skills: Optional[list[str]]
    experience: Optional[list[ExperienceItem]]
    projects: Optional[list[ProjectItem]]
    updated_at: datetime

    model_config = {"from_attributes": True}
