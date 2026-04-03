import uuid
import math
from typing import Optional
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from app.models.job import Job
from app.models.application import Application
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate


def _base_query(db: Session):
    return db.query(Job).options(joinedload(Job.posted_by))


def _with_app_count(jobs: list[Job], db: Session) -> list[Job]:
    """Attach application_count as a dynamic attribute to each job."""
    if not jobs:
        return jobs
    job_ids = [j.id for j in jobs]
    counts = (
        db.query(Application.job_id, func.count(Application.id).label("cnt"))
        .filter(Application.job_id.in_(job_ids))
        .group_by(Application.job_id)
        .all()
    )
    count_map = {row.job_id: row.cnt for row in counts}
    for job in jobs:
        job.application_count = count_map.get(job.id, 0)  # type: ignore[attr-defined]
    return jobs


def list_jobs(
    db: Session,
    title: Optional[str] = None,
    location: Optional[str] = None,
    job_type: Optional[str] = None,
    page: int = 1,
    page_size: int = 20,
) -> dict:
    page_size = min(page_size, 50)
    query = _base_query(db).filter(Job.is_active == True)  # noqa: E712

    if title:
        query = query.filter(Job.title.ilike(f"%{title}%"))
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if job_type:
        query = query.filter(Job.job_type == job_type)

    total = query.count()
    jobs = query.order_by(Job.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()
    jobs = _with_app_count(jobs, db)

    return {
        "items": jobs,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pages": math.ceil(total / page_size) if total else 0,
    }


def get_job(db: Session, job_id: uuid.UUID) -> Job:
    job = _base_query(db).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    _with_app_count([job], db)
    return job


def get_my_jobs(db: Session, hr_id: uuid.UUID) -> list[Job]:
    jobs = _base_query(db).filter(Job.posted_by_id == hr_id).order_by(Job.created_at.desc()).all()
    return _with_app_count(jobs, db)


def create_job(db: Session, data: JobCreate, hr_id: uuid.UUID) -> Job:
    job = Job(**data.model_dump(), posted_by_id=hr_id)
    db.add(job)
    db.commit()
    db.refresh(job)
    # reload with relationship
    return get_job(db, job.id)


def update_job(db: Session, job_id: uuid.UUID, data: JobUpdate, hr_id: uuid.UUID) -> Job:
    job = _base_query(db).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if job.posted_by_id != hr_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorised to edit this job")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    db.commit()
    db.refresh(job)
    return get_job(db, job.id)


def delete_job(db: Session, job_id: uuid.UUID, hr_id: uuid.UUID) -> None:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if job.posted_by_id != hr_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorised to delete this job")
    db.delete(job)
    db.commit()
