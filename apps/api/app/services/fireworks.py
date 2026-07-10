import logging
import time
from dataclasses import dataclass

import httpx

from app.config import settings

logger = logging.getLogger("api.fireworks")

FIREWORKS_URL = "https://api.fireworks.ai/inference/v1/chat/completions"
TRANSIENT_STATUS_CODES = frozenset({429, 500, 502, 503, 504})
DEFAULT_MAX_TOKENS = 1024
DEFAULT_TEMPERATURE = 0.7


class FireworksError(Exception):
    def __init__(self, message: str, latency_ms: int = 0, transient: bool = False) -> None:
        super().__init__(message)
        self.message = message
        self.latency_ms = latency_ms
        self.transient = transient


@dataclass
class FireworksResult:
    text: str
    model: str
    latency_ms: int


def generate(prompt: str) -> FireworksResult:
    api_key = settings.fireworks_api_key
    if not api_key:
        raise FireworksError("FIREWORKS_API_KEY is not configured", latency_ms=0, transient=False)

    model = settings.fireworks_model
    timeout = settings.fireworks_timeout
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": DEFAULT_TEMPERATURE,
        "max_tokens": DEFAULT_MAX_TOKENS,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    last_error: FireworksError | None = None
    latency_ms = 0

    for attempt in range(2):
        start = time.perf_counter()
        try:
            with httpx.Client(timeout=timeout) as client:
                response = client.post(FIREWORKS_URL, json=payload, headers=headers)
            latency_ms = int((time.perf_counter() - start) * 1000)

            if response.status_code == 200:
                data = response.json()
                text = data["choices"][0]["message"]["content"]
                logger.info(
                    "fireworks inference succeeded",
                    extra={"model": model, "latency_ms": latency_ms, "attempt": attempt},
                )
                return FireworksResult(text=text.strip(), model=model, latency_ms=latency_ms)

            if response.status_code in TRANSIENT_STATUS_CODES and attempt == 0:
                last_error = FireworksError(
                    f"transient upstream error {response.status_code}",
                    latency_ms=latency_ms,
                    transient=True,
                )
                logger.warning(
                    "fireworks transient failure, retrying",
                    extra={"status": response.status_code, "attempt": attempt},
                )
                continue

            last_error = FireworksError(
                f"upstream error {response.status_code}: {response.text[:200]}",
                latency_ms=latency_ms,
                transient=False,
            )
            break
        except httpx.RequestError as exc:
            latency_ms = int((time.perf_counter() - start) * 1000)
            if attempt == 0:
                last_error = FireworksError(
                    f"transient network error: {exc}",
                    latency_ms=latency_ms,
                    transient=True,
                )
                logger.warning(
                    "fireworks network error, retrying",
                    extra={"attempt": attempt, "error": str(exc)},
                )
                continue
            last_error = FireworksError(
                f"network error: {exc}",
                latency_ms=latency_ms,
                transient=False,
            )
            break

    logger.error(
        "fireworks inference failed",
        extra={"model": model, "latency_ms": latency_ms},
    )
    raise last_error
