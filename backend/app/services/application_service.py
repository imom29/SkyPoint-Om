import uuid
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status
from app.models.application import Application, ApplicationStatus
from app.models.job import Job
from app.schemas.application import ApplicationCreate, StatusUpdate
from app.services.job_service import _with_app_count


def _load_application(db: Session, app_id: uuid.UUID) -> Application:
    app = (
        db.query(Application)
        .options(
            joinedload(Application.job).joinedload(Job.posted_by),
            joinedload(Application.candidate),
        )
        .filter(Application.id == app_id)
        .first()
    )
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return app


def apply_to_job(db: Session, data: ApplicationCreate, candidate_id: uuid.UUID) -> Application:
    job = db.query(Job).filter(Job.id == data.job_id).first()
    if not job or not job.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found or no longer active")

    application = Application(
        job_id=data.job_id,
        candidate_id=candidate_id,
        cover_letter=data.cover_letter,
        resume_url=data.resume_url,
        resume_text=data.resume_text,
    )
    db.add(application)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already applied to this job",
        )
    return _load_application(db, application.id)


def get_my_applications(db: Session, candidate_id: uuid.UUID) -> dict:
    apps = (
        db.query(Application)
        .options(
            joinedload(Application.job).joinedload(Job.posted_by),
            joinedload(Application.candidate),
        )
        .filter(Application.candidate_id == candidate_id)
        .order_by(Application.applied_at.desc())
        .all()
    )
    # attach app counts to jobs
    jobs = [a.job for a in apps]
    _with_app_count(jobs, db)
    return {"items": apps, "total": len(apps)}


def get_job_applications(db: Session, job_id: uuid.UUID, hr_id: uuid.UUID) -> dict:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    if job.posted_by_id != hr_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorised to view these applications")

    apps = (
        db.query(Application)
        .options(
            joinedload(Application.job).joinedload(Job.posted_by),
            joinedload(Application.candidate),
        )
        .filter(Application.job_id == job_id)
        .order_by(Application.applied_at.desc())
        .all()
    )
    _with_app_count([job], db)
    for app in apps:
        app.job.application_count = job.application_count  # type: ignore[attr-defined]
    return {"items": apps, "total": len(apps)}


def update_application_status(
    db: Session, app_id: uuid.UUID, data: StatusUpdate, hr_id: uuid.UUID
) -> Application:
    app = _load_application(db, app_id)
    if app.job.posted_by_id != hr_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorised to update this application")
    app.status = data.status
    db.commit()
    db.refresh(app)
    return _load_application(db, app_id)


def get_application_detail(
    db: Session, app_id: uuid.UUID, user_id: uuid.UUID, user_role: str
) -> Application:
    app = _load_application(db, app_id)
    if user_role == "candidate" and app.candidate_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorised")
    if user_role == "hr" and app.job.posted_by_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorised")
    _with_app_count([app.job], db)
    return app
