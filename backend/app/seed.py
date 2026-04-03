"""
Idempotent seed script — safe to run on every container start.
Creates test users and sample job listings if they don't already exist.
"""
from app.database import SessionLocal
from app.models.user import User, UserRole
from app.models.job import Job, JobType
from app.services.auth_service import get_password_hash


SAMPLE_JOBS = [
    {
        "title": "Senior Python Developer",
        "description": (
            "We are looking for an experienced Python developer to join our backend team. "
            "You will design and implement scalable REST APIs, work closely with product and "
            "data teams, and mentor junior engineers. Strong knowledge of FastAPI or Django, "
            "PostgreSQL, and cloud infrastructure is expected."
        ),
        "location": "Remote",
        "job_type": JobType.full_time,
        "salary_min": 90000,
        "salary_max": 130000,
    },
    {
        "title": "React Frontend Engineer",
        "description": (
            "Join our product team to build modern, responsive web applications. "
            "You will own the frontend architecture, collaborate with designers, and "
            "implement pixel-perfect UIs using React 18, TypeScript, and Tailwind CSS. "
            "Experience with state management libraries and testing is a plus."
        ),
        "location": "New York, NY",
        "job_type": JobType.contract,
        "salary_min": 75000,
        "salary_max": 110000,
    },
    {
        "title": "DevOps Engineer",
        "description": (
            "We need a DevOps engineer to manage our cloud infrastructure on AWS, "
            "build and maintain CI/CD pipelines, and ensure system reliability. "
            "You will work with Docker, Kubernetes, Terraform, and GitHub Actions. "
            "Strong Linux and scripting skills are required."
        ),
        "location": "San Francisco, CA",
        "job_type": JobType.full_time,
        "salary_min": 100000,
        "salary_max": 150000,
    },
    {
        "title": "Data Analyst",
        "description": (
            "We are seeking a data analyst to turn raw data into actionable insights. "
            "You will build dashboards in Metabase or Tableau, write complex SQL queries, "
            "and work with the engineering team to instrument new features. "
            "Experience with Python for data wrangling is desirable."
        ),
        "location": "Austin, TX",
        "job_type": JobType.part_time,
        "salary_min": 50000,
        "salary_max": 70000,
    },
    {
        "title": "QA Engineer",
        "description": (
            "Help us ship high-quality software by designing and executing test plans, "
            "writing automated tests with Playwright and pytest, and participating in "
            "code reviews. You will work across web and API layers and own the quality "
            "gate in our CI pipeline."
        ),
        "location": "Remote",
        "job_type": JobType.full_time,
        "salary_min": 65000,
        "salary_max": 95000,
    },
]


def seed() -> None:
    db = SessionLocal()
    try:
        # --- HR user ---
        hr = db.query(User).filter(User.email == "admin@test.com").first()
        if not hr:
            hr = User(
                email="admin@test.com",
                full_name="Admin HR",
                hashed_password=get_password_hash("Admin@1234"),
                role=UserRole.hr,
            )
            db.add(hr)
            db.flush()
            print("  Created HR user: admin@test.com")
        else:
            print("  HR user already exists, skipping.")

        # --- Candidate user ---
        candidate = db.query(User).filter(User.email == "user@test.com").first()
        if not candidate:
            candidate = User(
                email="user@test.com",
                full_name="Test Candidate",
                hashed_password=get_password_hash("User@1234"),
                role=UserRole.candidate,
            )
            db.add(candidate)
            db.flush()
            print("  Created Candidate user: user@test.com")
        else:
            print("  Candidate user already exists, skipping.")

        # --- Sample jobs (only if none exist) ---
        if db.query(Job).count() == 0:
            for job_data in SAMPLE_JOBS:
                job = Job(**job_data, posted_by_id=hr.id)
                db.add(job)
            print(f"  Created {len(SAMPLE_JOBS)} sample job listings.")
        else:
            print("  Jobs already exist, skipping.")

        db.commit()
        print("Seed complete.")
    except Exception as exc:
        db.rollback()
        print(f"Seed failed: {exc}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
