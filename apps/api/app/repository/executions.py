import sqlite3
from collections.abc import Sequence

from app.database import get_connection
from app.models.execution import Execution


def _row_to_execution(row: sqlite3.Row) -> Execution:
    return Execution(
        id=row["id"],
        prompt=row["prompt"],
        response=row["response"],
        model=row["model"],
        latency_ms=row["latency_ms"],
        status=row["status"],
        created_at=row["created_at"],
    )


def create_execution(execution: Execution) -> None:
    with get_connection() as conn:
        conn.execute(
            """
            INSERT INTO executions (id, prompt, response, model, latency_ms, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                execution.id,
                execution.prompt,
                execution.response,
                execution.model,
                execution.latency_ms,
                execution.status,
                execution.created_at,
            ),
        )


def get_execution(execution_id: str) -> Execution | None:
    with get_connection() as conn:
        row = conn.execute(
            "SELECT * FROM executions WHERE id = ?", (execution_id,)
        ).fetchone()
    return _row_to_execution(row) if row else None


def list_executions(limit: int = 50) -> Sequence[Execution]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT * FROM executions ORDER BY rowid DESC LIMIT ?", (limit,)
        ).fetchall()
    return [_row_to_execution(row) for row in rows]
