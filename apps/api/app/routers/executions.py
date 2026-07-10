import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, HTTPException, status

from app.config import settings
from app.models.execution import Execution
from app.repository import executions
from app.schemas.execution import ExecutionCreate, ExecutionOut
from app.services import fireworks

router = APIRouter(tags=["executions"])


@router.post("/execute", response_model=ExecutionOut, status_code=status.HTTP_200_OK)
def execute(payload: ExecutionCreate) -> ExecutionOut:
    created_at = datetime.now(UTC).isoformat()

    try:
        result = fireworks.generate(payload.prompt)
        execution = Execution(
            id=uuid.uuid4().hex,
            prompt=payload.prompt,
            response=result.text,
            model=result.model,
            latency_ms=result.latency_ms,
            status="success",
            created_at=created_at,
        )
    except fireworks.FireworksError as exc:
        execution = Execution(
            id=uuid.uuid4().hex,
            prompt=payload.prompt,
            response=exc.message,
            model=settings.fireworks_model,
            latency_ms=exc.latency_ms,
            status="error",
            created_at=created_at,
        )
        executions.create_execution(execution)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=ExecutionOut.model_validate(execution.__dict__).model_dump(),
        ) from None

    executions.create_execution(execution)
    return ExecutionOut.model_validate(execution.__dict__)


@router.get("/runs", response_model=list[ExecutionOut])
def list_runs(limit: int = 50) -> list[ExecutionOut]:
    bounded_limit = min(max(limit, 1), 500)
    runs = executions.list_executions(bounded_limit)
    return [ExecutionOut.model_validate(run.__dict__) for run in runs]


@router.get("/runs/{execution_id}", response_model=ExecutionOut)
def get_run(execution_id: str) -> ExecutionOut:
    execution = executions.get_execution(execution_id)
    if execution is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Execution not found")
    return ExecutionOut.model_validate(execution.__dict__)
