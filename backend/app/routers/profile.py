import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.profile import ProfileUpdate, ProfileOut
from app.services import profile_service
from app.dependencies.auth import require_candidate, require_hr

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=ProfileOut)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate),
):
    """Get the current candidate's profile, creating an empty one if it doesn't exist."""
    return profile_service.get_or_create_profile(db, user_id=current_user.id)


@router.put("", response_model=ProfileOut)
def update_profile(
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_candidate),
):
    """Create or update the current candidate's profile."""
    return profile_service.update_profile(db, user_id=current_user.id, data=data)


@router.get("/candidate/{candidate_id}", response_model=Optional[ProfileOut])
def get_candidate_profile(
    candidate_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_hr),
):
    """HR-only: fetch a candidate's profile. Returns null if the candidate hasn't built one yet."""
    return profile_service.get_candidate_profile(db, candidate_id=candidate_id)
