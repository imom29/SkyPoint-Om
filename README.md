# SkyPoint — Job Portal Platform

A full-stack job portal where **HR/Recruiters** can post and manage job listings, and **Candidates** can browse, search, and apply for jobs — with real-time application status tracking.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                                                         │
│  ┌─────────────┐     ┌─────────────┐   ┌─────────────┐ │
│  │  Frontend   │────▶│   Backend   │──▶│  PostgreSQL │ │
│  │  React/Vite │     │   FastAPI   │   │    DB       │ │
│  │  :5173      │     │   :8000     │   │   :5432     │ │
│  └─────────────┘     └─────────────┘   └─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

- **Frontend** — React 18 + Vite served on port `5173`. Communicates with the backend via REST API calls using Axios.
- **Backend** — FastAPI on port `8000`. Handles authentication (JWT), business logic, and all data operations via SQLAlchemy.
- **Database** — PostgreSQL 16. Persisted using a named Docker volume. Schema managed via Alembic migrations, applied automatically on startup.

On startup, Docker Compose:
1. Starts PostgreSQL and waits for it to be healthy
2. Starts the backend, runs `alembic upgrade head` (migrations) and the seed script (creates test users + sample jobs), then starts uvicorn
3. Starts the frontend once the backend health check passes

---

## How to Run

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/) installed

### Steps

```bash
git clone https://github.com/imom29/SkyPoint-Om.git
cd SkyPoint-Om

# Copy the environment file (defaults work out of the box)
cp .env.example .env

# Start everything
docker compose up --build
```

- **Frontend:** http://localhost:5173
- **Backend API docs:** http://localhost:8000/docs
- **Health check:** http://localhost:8000/api/v1/health

> First build takes a few minutes as Docker pulls images and installs dependencies. Subsequent starts are faster.

To stop:
```bash
docker compose down
```

To wipe the database volume:
```bash
docker compose down -v
```

---

## Test Credentials

These are created automatically by the seed script on every startup.

| Role | Email | Password |
|------|-------|----------|
| HR / Recruiter | admin@test.com | Admin@1234 |
| Candidate | user@test.com | User@1234 |

---

## Feature Walkthrough

### HR / Recruiter (`admin@test.com`)

| Feature | How to access |
|---------|---------------|
| View all posted jobs | Login → Dashboard |
| Post a new job | Dashboard → "Post a Job" button, or Navbar → "Post a Job" |
| Edit a job listing | Dashboard → "Edit" action on any job row |
| Delete a job listing | Dashboard → "Delete" → confirm in modal |
| View applicants for a job | Dashboard → "Applicants" action on any job row |
| Filter applicants by status | Applicants page → status tabs (All / Pending / Accepted / Rejected) |
| Accept or reject an applicant | Applicants page → status dropdown in each applicant row |

### Candidate (`user@test.com`)

| Feature | How to access |
|---------|---------------|
| Browse all active jobs | Navbar → "Browse Jobs" (also public, no login required) |
| Search by title, location, type | Job list page → filter bar at the top |
| View job details | Any job card → "View details" |
| Apply for a job | Job detail page → "Apply Now" → fill in cover letter + optional resume |
| Track application status | Navbar → "My Applications" |

### Both roles

| Feature | How to access |
|---------|---------------|
| View profile | Navbar → your name |
| Logout | Navbar → "Logout" |

---

## Running Tests

### Backend tests (pytest)

```bash
docker compose exec backend pytest tests/ -v
```

Or outside Docker (requires Python 3.12+ and dependencies installed):
```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

### Frontend tests (Vitest)

```bash
docker compose exec frontend npm test
```

Or outside Docker:
```bash
cd frontend
npm install
npm test
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 18 |
| Frontend build tool | Vite |
| Styling | Tailwind CSS |
| HTTP client | Axios |
| Form handling | React Hook Form |
| Routing | React Router v6 |
| Backend framework | FastAPI |
| ORM | SQLAlchemy 2.0 |
| DB migrations | Alembic |
| Validation | Pydantic v2 |
| Authentication | JWT via python-jose |
| Password hashing | passlib[bcrypt] |
| Rate limiting | slowapi |
| Database | PostgreSQL 16 |
| Backend testing | pytest + httpx |
| Frontend testing | Vitest + React Testing Library |
| Containerisation | Docker + Docker Compose |

---

## Project Structure

```
SkyPoint-Om/
├── backend/
│   ├── app/
│   │   ├── main.py              # App factory, CORS, routers
│   │   ├── config.py            # Settings from environment
│   │   ├── database.py          # SQLAlchemy engine + session
│   │   ├── models/              # ORM models (User, Job, Application)
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── routers/             # API route handlers
│   │   ├── services/            # Business logic layer
│   │   ├── dependencies/        # Auth dependency injection
│   │   └── seed.py              # Test data seeder
│   ├── migrations/              # Alembic migration files
│   ├── tests/                   # pytest test suite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios API clients
│   │   ├── context/             # AuthContext (token + user state)
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components by role
│   │   ├── hooks/               # useAuth, useDebounce
│   │   └── utils/               # formatDate, constants
│   └── src/test/                # Vitest component tests
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## Security

- Passwords hashed with **bcrypt** (never stored in plaintext)
- **JWT** tokens signed with HS256; expire after 60 minutes (configurable)
- **Role-based access control** enforced on every protected endpoint
- **Ownership checks** — HR can only edit/delete their own jobs; only the job's HR can view its applicants
- **Input validation** on both frontend (React Hook Form) and backend (Pydantic v2)
- **CORS** restricted to configured origins via environment variable
- **Rate limiting** on `/auth/login` (slowapi) to prevent credential stuffing
- Secrets managed via environment variables — no hardcoded credentials

---

## Known Limitations

- Resume upload is URL-based only (no file upload storage configured)
- No email notifications on application status changes
- No refresh token flow — users must log in again after the 60-minute JWT expires
- Frontend is served via Vite dev server (suitable for assessment; a production setup would use a built static bundle served by Nginx)
