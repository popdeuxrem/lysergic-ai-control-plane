from app.models.execution import Execution
from app.repository import executions


def test_create_and_get_execution(db) -> None:
    execution = Execution(
        id="abc",
        prompt="hello",
        response="hi there",
        model="test-model",
        latency_ms=42,
        status="success",
        created_at="2026-01-01T00:00:00+00:00",
    )
    executions.create_execution(execution)

    stored = executions.get_execution("abc")
    assert stored is not None
    assert stored.prompt == "hello"
    assert stored.response == "hi there"
    assert stored.model == "test-model"
    assert stored.latency_ms == 42
    assert stored.status == "success"


def test_get_missing_execution_returns_none(db) -> None:
    assert executions.get_execution("missing") is None


def test_list_executions_returns_latest_first(db) -> None:
    for index in range(3):
        executions.create_execution(
            Execution(
                id=f"id-{index}",
                prompt=f"prompt-{index}",
                response=f"response-{index}",
                model="test-model",
                latency_ms=index,
                status="success",
                created_at=f"2026-01-01T00:00:0{index}+00:00",
            )
        )

    runs = executions.list_executions(limit=10)
    assert [run.id for run in runs] == ["id-2", "id-1", "id-0"]


def test_list_executions_respects_limit(db) -> None:
    for index in range(5):
        executions.create_execution(
            Execution(
                id=f"id-{index}",
                prompt=f"prompt-{index}",
                response="r",
                model="test-model",
                latency_ms=index,
                status="success",
                created_at="2026-01-01T00:00:00+00:00",
            )
        )

    assert len(executions.list_executions(limit=2)) == 2
