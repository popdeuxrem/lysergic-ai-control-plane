# Lysergic AI Control Plane

> AMD Developer Hackathon — Unicorn Track submission.

A production-quality foundation for orchestrating and observing AI workloads across AMD
hardware. This repository currently contains **Sprint 0 (Foundation)**: a buildable,
container-first monorepo with a FastAPI backend, a Next.js operational dashboard, and a
Docker Compose deployment.

## Architecture

```
Browser
  └── Next.js 15 dashboard (apps/web)        :3000
        │  HTTP /health
        ▼
      FastAPI service (apps/api)             :8000
        └── SQLite (Python stdlib)           /data/lysergic.db
```

- **Web** — Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **API** — FastAPI, Pydantic v2, Uvicorn, Python 3.12.
- **Data** — SQLite, accessed through a thin `database.py` layer.
- **Platform** — Docker Compose orchestrating both services.

The dashboard exposes: System Status, Backend Status (live `/health` probe), and an
Architecture Overview. No AI inference, authentication, or business logic is implemented
yet — those arrive in later sprints.

## Quick Start

### Local (without Docker)

Backend:

```bash
cd apps/api
pip install -r requirements.txt -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000
```

Frontend (separate terminal):

```bash
cd apps/web
npm install
npm run dev
```

Open http://localhost:3000. The dashboard probes `http://localhost:8000/health`.

### Docker

```bash
cp .env.example .env   # optional, defaults work out of the box
docker compose up --build
```

- API: http://localhost:8000 (docs at `/docs`)
- Web: http://localhost:3000

## Development

Common tasks are wrapped in a `Makefile`:

```bash
make install-api   # install Python deps
make install-web   # install frontend deps
make dev-api       # run API with hot reload
make dev-web       # run web with hot reload
make test          # run API tests
make lint          # ruff + next build
make build         # docker compose build
make up            # docker compose up
make logs          # tail logs
```

Environment variables are prefixed with `APP_` for the API (see `.env.example`) and
`NEXT_PUBLIC_API_URL` for the web client.

## Roadmap

- **Sprint 0 — Foundation** (current): scaffold, `/health`, dashboard, Docker, CI.
- **Sprint 1**: Fireworks AI integration + `/execute` endpoint.
- **Sprint 2**: Execution history + SQLite persistence.
- **Sprint 3**: Dashboard metrics + submission assets.

See [`docs/`](./docs) for the master plan, architecture detail, task tracking, and
decision log.
