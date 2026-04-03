import uuid
from typing import Optional
from sqlalchemy.orm import Session
from app.models.candidate_profile import CandidateProfile
from app.schemas.profile import ProfileUpdate


def get_or_create_profile(db: Session, user_id: uuid.UUID) -> CandidateProfile:
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == user_id).first()
    if not profile:
        profile = CandidateProfile(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


def get_candidate_profile(db: Session, candidate_id: uuid.UUID) -> Optional[CandidateProfile]:
    """Return a candidate's profile without creating one — for HR viewing."""
    return db.query(CandidateProfile).filter(CandidateProfile.user_id == candidate_id).first()


def update_profile(db: Session, user_id: uuid.UUID, data: ProfileUpdate) -> CandidateProfile:
    profile = get_or_create_profile(db, user_id)

    update_data = data.model_dump(exclude_unset=True)

    # Serialise nested Pydantic models to plain dicts for JSON storage
    if "experience" in update_data and update_data["experience"] is not None:
        update_data["experience"] = [
            item.model_dump() if hasattr(item, "model_dump") else item
            for item in data.experience
        ]
    if "projects" in update_data and update_data["projects"] is not None:
        update_data["projects"] = [
            item.model_dump() if hasattr(item, "model_dump") else item
            for item in data.projects
        ]

    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile
