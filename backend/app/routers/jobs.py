import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.job import JobType
from app.schemas.job import JobCreate, JobUpdate, JobOut, JobListOut
from app.services import job_service
from app.dependencies.auth import get_current_user, require_hr

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=JobListOut)
def list_jobs(
    title: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    job_type: Optional[JobType] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    return job_service.list_jobs(db, title=title, location=location, job_type=job_type, page=page, page_size=page_size)


@router.get("/my", response_model=list[JobOut])
def get_my_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_hr),
):
    return job_service.get_my_jobs(db, hr_id=current_user.id)


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: uuid.UUID, db: Session = Depends(get_db)):
    return job_service.get_job(db, job_id)


@router.post("", response_model=JobOut, status_code=status.HTTP_201_CREATED)
def create_job(
    data: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_hr),
):
    return job_service.create_job(db, data, hr_id=current_user.id)


@router.put("/{job_id}", response_model=JobOut)
def update_job(
    job_id: uuid.UUID,
    data: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_hr),
):
    return job_service.update_job(db, job_id, data, hr_id=current_user.id)


@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_hr),
):
    job_service.delete_job(db, job_id, hr_id=current_user.id)
