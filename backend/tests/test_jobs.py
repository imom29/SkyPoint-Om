import pytest

JOBS_URL = "/api/v1/jobs"

JOB_PAYLOAD = {
    "title": "Backend Engineer",
    "description": "Build and maintain scalable backend systems using Python and FastAPI.",
    "location": "Remote",
    "job_type": "full_time",
    "salary_min": 80000,
    "salary_max": 120000,
}


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def test_list_jobs_public_no_auth(client, sample_job):
    res = client.get(JOBS_URL)
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 1
    assert len(data["items"]) >= 1


def test_list_jobs_filter_by_title(client, sample_job):
    res = client.get(JOBS_URL, params={"title": "Software"})
    assert res.status_code == 200
    assert any("Software" in item["title"] for item in res.json()["items"])


def test_list_jobs_filter_by_location(client, sample_job):
    res = client.get(JOBS_URL, params={"location": "Remote"})
    assert res.status_code == 200
    assert all(item["location"] == "Remote" for item in res.json()["items"])


def test_list_jobs_filter_by_type(client, sample_job):
    res = client.get(JOBS_URL, params={"job_type": "full_time"})
    assert res.status_code == 200
    assert all(item["job_type"] == "full_time" for item in res.json()["items"])


def test_list_jobs_pagination(client, sample_job):
    res = client.get(JOBS_URL, params={"page": 1, "page_size": 1})
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) <= 1
    assert "pages" in data


def test_get_job_by_id_exists(client, sample_job):
    res = client.get(f"{JOBS_URL}/{sample_job.id}")
    assert res.status_code == 200
    assert res.json()["id"] == str(sample_job.id)


def test_get_job_by_id_not_found_returns_404(client):
    res = client.get(f"{JOBS_URL}/00000000-0000-0000-0000-000000000000")
    assert res.status_code == 404


def test_create_job_as_hr_success(client, hr_token):
    res = client.post(JOBS_URL, json=JOB_PAYLOAD, headers=auth(hr_token))
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == JOB_PAYLOAD["title"]
    assert data["posted_by"]["role"] == "hr"


def test_create_job_as_candidate_returns_403(client, candidate_token):
    res = client.post(JOBS_URL, json=JOB_PAYLOAD, headers=auth(candidate_token))
    assert res.status_code == 403


def test_create_job_unauthenticated_returns_401(client):
    res = client.post(JOBS_URL, json=JOB_PAYLOAD)
    assert res.status_code == 401


def test_create_job_invalid_salary_range_returns_422(client, hr_token):
    bad_payload = {**JOB_PAYLOAD, "salary_min": 100000, "salary_max": 50000}
    res = client.post(JOBS_URL, json=bad_payload, headers=auth(hr_token))
    assert res.status_code == 422


def test_update_job_as_owner_hr_success(client, hr_token, sample_job):
    res = client.put(f"{JOBS_URL}/{sample_job.id}", json={"title": "Updated Title"}, headers=auth(hr_token))
    assert res.status_code == 200
    assert res.json()["title"] == "Updated Title"


def test_update_job_as_different_hr_returns_403(client, hr_token2, sample_job):
    res = client.put(f"{JOBS_URL}/{sample_job.id}", json={"title": "Hijacked"}, headers=auth(hr_token2))
    assert res.status_code == 403


def test_delete_job_as_owner_success(client, hr_token, sample_job):
    res = client.delete(f"{JOBS_URL}/{sample_job.id}", headers=auth(hr_token))
    assert res.status_code == 204


def test_delete_job_as_non_owner_returns_403(client, hr_token2, sample_job):
    res = client.delete(f"{JOBS_URL}/{sample_job.id}", headers=auth(hr_token2))
    assert res.status_code == 403


def test_get_my_jobs_as_hr(client, hr_token, sample_job):
    res = client.get(f"{JOBS_URL}/my", headers=auth(hr_token))
    assert res.status_code == 200
    assert any(j["id"] == str(sample_job.id) for j in res.json())


def test_get_my_jobs_as_candidate_returns_403(client, candidate_token):
    res = client.get(f"{JOBS_URL}/my", headers=auth(candidate_token))
    assert res.status_code == 403
