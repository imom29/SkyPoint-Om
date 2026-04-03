import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationOut, ApplicationListOut, StatusUpdate
from app.services import application_service
from app.dependencies.auth import get_current_user, require_hr, require_candidate

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def apply(
    data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate),
):
    return application_service.apply_to_job(db, data, candidate_id=current_user.id)


@router.get("/my", response_model=ApplicationListOut)
def my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate),
):
    return application_service.get_my_applications(db, candidate_id=current_user.id)


@router.get("/job/{job_id}", response_model=ApplicationListOut)
def job_applications(
    job_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_hr),
):
    return application_service.get_job_applications(db, job_id=job_id, hr_id=current_user.id)


@router.patch("/{app_id}/status", response_model=ApplicationOut)
def update_status(
    app_id: uuid.UUID,
    data: StatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_hr),
):
    return application_service.update_application_status(db, app_id=app_id, data=data, hr_id=current_user.id)


@router.get("/{app_id}", response_model=ApplicationOut)
def get_application(
    app_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return application_service.get_application_detail(
        db, app_id=app_id, user_id=current_user.id, user_role=current_user.role.value
    )
