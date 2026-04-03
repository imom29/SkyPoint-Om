import pytest
from app.models.application import Application, ApplicationStatus

APPS_URL = "/api/v1/applications"

APPLY_PAYLOAD = {
    "cover_letter": "I am very excited about this role and believe my experience in Python development makes me an excellent fit for your team.",
    "resume_url": "https://example.com/resume.pdf",
}


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def test_apply_to_job_as_candidate_success(client, candidate_token, sample_job):
    res = client.post(APPS_URL, json={**APPLY_PAYLOAD, "job_id": str(sample_job.id)}, headers=auth(candidate_token))
    assert res.status_code == 201
    data = res.json()
    assert data["status"] == "pending"
    assert data["job"]["id"] == str(sample_job.id)


def test_apply_to_job_as_hr_returns_403(client, hr_token, sample_job):
    res = client.post(APPS_URL, json={**APPLY_PAYLOAD, "job_id": str(sample_job.id)}, headers=auth(hr_token))
    assert res.status_code == 403


def test_apply_to_job_unauthenticated_returns_401(client, sample_job):
    res = client.post(APPS_URL, json={**APPLY_PAYLOAD, "job_id": str(sample_job.id)})
    assert res.status_code == 401


def test_apply_to_same_job_twice_returns_409(client, candidate_token, sample_job):
    payload = {**APPLY_PAYLOAD, "job_id": str(sample_job.id)}
    client.post(APPS_URL, json=payload, headers=auth(candidate_token))
    res = client.post(APPS_URL, json=payload, headers=auth(candidate_token))
    assert res.status_code == 409


def test_apply_to_nonexistent_job_returns_404(client, candidate_token):
    res = client.post(
        APPS_URL,
        json={**APPLY_PAYLOAD, "job_id": "00000000-0000-0000-0000-000000000000"},
        headers=auth(candidate_token),
    )
    assert res.status_code == 404


def test_apply_cover_letter_too_short_returns_422(client, candidate_token, sample_job):
    res = client.post(
        APPS_URL,
        json={"job_id": str(sample_job.id), "cover_letter": "Too short"},
        headers=auth(candidate_token),
    )
    assert res.status_code == 422


def test_get_my_applications_as_candidate(client, candidate_token, sample_job):
    client.post(APPS_URL, json={**APPLY_PAYLOAD, "job_id": str(sample_job.id)}, headers=auth(candidate_token))
    res = client.get(f"{APPS_URL}/my", headers=auth(candidate_token))
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 1
    assert data["items"][0]["job"]["id"] == str(sample_job.id)


def test_get_my_applications_as_hr_returns_403(client, hr_token):
    res = client.get(f"{APPS_URL}/my", headers=auth(hr_token))
    assert res.status_code == 403


def test_get_job_applications_as_hr_owner(client, hr_token, candidate_token, sample_job):
    client.post(APPS_URL, json={**APPLY_PAYLOAD, "job_id": str(sample_job.id)}, headers=auth(candidate_token))
    res = client.get(f"{APPS_URL}/job/{sample_job.id}", headers=auth(hr_token))
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 1


def test_get_job_applications_as_non_owner_hr_returns_403(client, hr_token2, candidate_token, sample_job):
    client.post(APPS_URL, json={**APPLY_PAYLOAD, "job_id": str(sample_job.id)}, headers=auth(candidate_token))
    res = client.get(f"{APPS_URL}/job/{sample_job.id}", headers=auth(hr_token2))
    assert res.status_code == 403


def test_update_status_to_accepted(client, hr_token, candidate_token, sample_job):
    apply_res = client.post(APPS_URL, json={**APPLY_PAYLOAD, "job_id": str(sample_job.id)}, headers=auth(candidate_token))
    app_id = apply_res.json()["id"]
    res = client.patch(f"{APPS_URL}/{app_id}/status", json={"status": "accepted"}, headers=auth(hr_token))
    assert res.status_code == 200
    assert res.json()["status"] == "accepted"


def test_update_status_to_rejected(client, hr_token, candidate_token, sample_job):
    apply_res = client.post(APPS_URL, json={**APPLY_PAYLOAD, "job_id": str(sample_job.id)}, headers=auth(candidate_token))
    app_id = apply_res.json()["id"]
    res = client.patch(f"{APPS_URL}/{app_id}/status", json={"status": "rejected"}, headers=auth(hr_token))
    assert res.status_code == 200
    assert res.json()["status"] == "rejected"


def test_update_status_as_candidate_returns_403(client, candidate_token, hr_token, sample_job):
    apply_res = client.post(APPS_URL, json={**APPLY_PAYLOAD, "job_id": str(sample_job.id)}, headers=auth(candidate_token))
    app_id = apply_res.json()["id"]
    res = client.patch(f"{APPS_URL}/{app_id}/status", json={"status": "accepted"}, headers=auth(candidate_token))
    assert res.status_code == 403


def test_get_application_detail_as_owner_candidate(client, candidate_token, sample_job):
    apply_res = client.post(APPS_URL, json={**APPLY_PAYLOAD, "job_id": str(sample_job.id)}, headers=auth(candidate_token))
    app_id = apply_res.json()["id"]
    res = client.get(f"{APPS_URL}/{app_id}", headers=auth(candidate_token))
    assert res.status_code == 200
    assert res.json()["id"] == app_id


def test_get_application_detail_as_different_candidate_returns_403(client, candidate_token, sample_job, db):
    from app.models.user import User, UserRole
    from app.services.auth_service import get_password_hash, create_access_token

    other = User(
        email="other@test.com",
        full_name="Other",
        hashed_password=get_password_hash("Password@1"),
        role=UserRole.candidate,
    )
    db.add(other)
    db.commit()
    other_token = create_access_token({"sub": str(other.id), "role": "candidate"})

    apply_res = client.post(APPS_URL, json={**APPLY_PAYLOAD, "job_id": str(sample_job.id)}, headers=auth(candidate_token))
    app_id = apply_res.json()["id"]
    res = client.get(f"{APPS_URL}/{app_id}", headers=auth(other_token))
    assert res.status_code == 403
