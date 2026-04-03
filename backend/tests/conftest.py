"""
Test configuration — uses an in-memory SQLite database so no running Postgres is needed.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app
from app.models.user import User, UserRole
from app.models.job import Job, JobType
from app.services.auth_service import get_password_hash, create_access_token

TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function", autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def db():
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture
def hr_user(db):
    user = User(
        email="hr@test.com",
        full_name="HR User",
        hashed_password=get_password_hash("Password@1"),
        role=UserRole.hr,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def hr_user2(db):
    user = User(
        email="hr2@test.com",
        full_name="HR User 2",
        hashed_password=get_password_hash("Password@1"),
        role=UserRole.hr,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def candidate_user(db):
    user = User(
        email="candidate@test.com",
        full_name="Candidate User",
        hashed_password=get_password_hash("Password@1"),
        role=UserRole.candidate,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def hr_token(hr_user):
    return create_access_token({"sub": str(hr_user.id), "role": "hr"})


@pytest.fixture
def hr_token2(hr_user2):
    return create_access_token({"sub": str(hr_user2.id), "role": "hr"})


@pytest.fixture
def candidate_token(candidate_user):
    return create_access_token({"sub": str(candidate_user.id), "role": "candidate"})


@pytest.fixture
def sample_job(db, hr_user):
    job = Job(
        title="Software Engineer",
        description="A great opportunity to work on exciting projects with a talented team.",
        location="Remote",
        job_type=JobType.full_time,
        salary_min=80000,
        salary_max=120000,
        posted_by_id=hr_user.id,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job
