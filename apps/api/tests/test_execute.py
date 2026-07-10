import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.fireworks import FireworksError, FireworksResult


def _fake_success(prompt: str) -> FireworksResult:
    return FireworksResult(text="generated text", model="test-model", latency_ms=15)


def _fake_failure(prompt: str) -> FireworksResult:
    raise FireworksError("upstream failure", latency_ms=20, transient=False)


def test_execute_creates_and_returns_execution(db, monkeypatch) -> None:
    monkeypatch.setattr("app.services.fireworks.generate", _fake_success)
    client = TestClient(app)

    response = client.post("/execute", json={"prompt": "hello"})
    assert response.status_code == 200

    body = response.json()
    assert body["response"] == "generated text"
    assert body["model"] == "test-model"
    assert body["latency_ms"] == 15
    assert body["status"] == "success"
    assert body["prompt"] == "hello"
    assert body["id"]

    detail = client.get(f"/runs/{body['id']}")
    assert detail.status_code == 200
    assert detail.json()["prompt"] == "hello"


def test_execute_persists_failure_and_returns_502(db, monkeypatch) -> None:
    monkeypatch.setattr("app.services.fireworks.generate", _fake_failure)
    client = TestClient(app)

    response = client.post("/execute", json={"prompt": "boom"})
    assert response.status_code == 502

    body = response.json()["detail"]
    assert body["status"] == "error"
    assert "upstream failure" in body["response"]

    runs = client.get("/runs").json()
    assert any(run["status"] == "error" for run in runs)


def test_execute_validation_error(db, monkeypatch) -> None:
    monkeypatch.setattr("app.services.fireworks.generate", _fake_success)
    client = TestClient(app)

    response = client.post("/execute", json={})
    assert response.status_code == 422


def test_get_run_not_found(db, monkeypatch) -> None:
    monkeypatch.setattr("app.services.fireworks.generate", _fake_success)
    client = TestClient(app)

    response = client.get("/runs/does-not-exist")
    assert response.status_code == 404
