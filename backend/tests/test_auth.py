import pytest


REGISTER_URL = "/api/v1/auth/register"
LOGIN_URL = "/api/v1/auth/login"


def test_register_hr_success(client):
    res = client.post(REGISTER_URL, json={
        "email": "newhr@test.com",
        "full_name": "New HR",
        "password": "Secure@123",
        "role": "hr",
    })
    assert res.status_code == 201
    data = res.json()
    assert data["email"] == "newhr@test.com"
    assert data["role"] == "hr"
    assert "hashed_password" not in data


def test_register_candidate_success(client):
    res = client.post(REGISTER_URL, json={
        "email": "newcandidate@test.com",
        "full_name": "New Candidate",
        "password": "Secure@123",
        "role": "candidate",
    })
    assert res.status_code == 201
    assert res.json()["role"] == "candidate"


def test_register_duplicate_email_returns_409(client):
    payload = {"email": "dup@test.com", "full_name": "Dup", "password": "Secure@123", "role": "hr"}
    client.post(REGISTER_URL, json=payload)
    res = client.post(REGISTER_URL, json=payload)
    assert res.status_code == 409


def test_register_weak_password_no_uppercase_returns_422(client):
    res = client.post(REGISTER_URL, json={
        "email": "weak@test.com",
        "full_name": "Weak",
        "password": "alllower1",
        "role": "candidate",
    })
    assert res.status_code == 422


def test_register_weak_password_no_digit_returns_422(client):
    res = client.post(REGISTER_URL, json={
        "email": "weak2@test.com",
        "full_name": "Weak",
        "password": "NoDigitPass",
        "role": "candidate",
    })
    assert res.status_code == 422


def test_register_short_password_returns_422(client):
    res = client.post(REGISTER_URL, json={
        "email": "short@test.com",
        "full_name": "Short",
        "password": "Ab1",
        "role": "candidate",
    })
    assert res.status_code == 422


def test_login_valid_credentials_returns_token(client, hr_user):
    res = client.post(LOGIN_URL, data={"username": "hr@test.com", "password": "Password@1"})
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["role"] == "hr"


def test_login_invalid_password_returns_401(client, hr_user):
    res = client.post(LOGIN_URL, data={"username": "hr@test.com", "password": "WrongPass@1"})
    assert res.status_code == 401


def test_login_nonexistent_email_returns_401(client):
    res = client.post(LOGIN_URL, data={"username": "ghost@test.com", "password": "Password@1"})
    assert res.status_code == 401


def test_get_me_authenticated(client, hr_user, hr_token):
    res = client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {hr_token}"})
    assert res.status_code == 200
    assert res.json()["email"] == "hr@test.com"


def test_get_me_unauthenticated(client):
    res = client.get("/api/v1/users/me")
    assert res.status_code == 401
