from pydantic import BaseModel


class ExecutionCreate(BaseModel):
    prompt: str


class ExecutionOut(BaseModel):
    id: str
    prompt: str
    response: str
    model: str
    latency_ms: int
    status: str
    created_at: str
