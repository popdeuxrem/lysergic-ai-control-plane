from dataclasses import dataclass


@dataclass
class Execution:
    id: str
    prompt: str
    response: str
    model: str
    latency_ms: int
    status: str
    created_at: str
