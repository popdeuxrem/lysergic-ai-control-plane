from contextlib import asynccontextmanager
from logging import getLogger

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.logging import configure_logging
from app.routers.executions import router as executions_router
from app.routers.health import router as health_router

logger = getLogger("api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging(settings.log_level)
    logger.info("api starting", extra={"environment": settings.environment})
    init_db()
    logger.info("database initialized", extra={"database_url": settings.database_url})
    try:
        yield
    finally:
        logger.info("api shutting down")


def create_app() -> FastAPI:
    app = FastAPI(
        title="Lysergic Control Plane API",
        version="0.2.0",
        description="Operational API for the Lysergic Control Plane (Sprint 1: AI execution).",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health_router)
    app.include_router(executions_router)

    @app.get("/", tags=["root"])
    def root() -> dict[str, str]:
        return {"service": "api", "docs": "/docs"}

    return app


app = create_app()
