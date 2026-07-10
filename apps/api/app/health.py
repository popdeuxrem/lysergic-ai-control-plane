from app.schemas.health import HealthResponse

SERVICE_NAME = "api"


def get_health() -> HealthResponse:
    return HealthResponse(status="ok", service=SERVICE_NAME)
