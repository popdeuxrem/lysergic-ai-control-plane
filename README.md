# Lysergic Control Plane

> AMD Developer Hackathon — Unicorn Track submission.

Production infrastructure for reliable AI execution. This repository contains a
container-first monorepo with a FastAPI backend, a Next.js operational dashboard, and a
Docker Compose deployment. The core capability is **AI Execution**: the dashboard submits a
prompt, the API runs it through the Fireworks AI adapter, persists the execution to SQLite,
and returns the result.

## Architecture

```
Browser
  └── Next.js 15 dashboard (apps/web)        :3000
        │  HTTP /execute, /runs
        ▼
      FastAPI service (apps/api)             :8000
        ├── services/fireworks.py  ─────────▶  Fireworks AI
        └── SQLite (Python stdlib)           /data/lysergic.db
```

- **Web** — Next.js 15 (App Router), TypeScript, Tailwind CSS with an operational observability dashboard.
- **API** — FastAPI, Pydantic v2, Uvicorn, Python 3.12.
- **Inference** — Fireworks AI, accessed only through the `services/fireworks.py` adapter.
- **Data** — SQLite, accessed through a repository layer (`app/repository`).
- **Platform** — Docker Compose orchestrating both services.

The dashboard exposes: live metrics (total / successful / failed / success-rate / average
latency), an execution history table with a detail drawer, a native latency-trend chart, and a
prompt composer — all polling `GET /runs` every 5 seconds.

## API

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET`  | `/health` | Service health check. |
| `POST` | `/execute` | Run a prompt through Fireworks AI and persist the execution. |
| `GET`  | `/runs` | List the latest executions (most recent first). |
| `GET`  | `/runs/{id}` | Fetch a single execution by id. |

`POST /execute` request:

```json
{ "prompt": "Explain AMD ROCm in one sentence." }
```

`POST /execute` response:

```json
{
  "id": "9f2c…",
  "prompt": "Explain AMD ROCm in one sentence.",
  "response": "ROCm is AMD's open GPU compute platform…",
  "model": "accounts/fireworks/models/llama-v3p1-8b-instruct",
  "latency_ms": 412,
  "status": "success",
  "created_at": "2026-07-10T22:00:00.000000+00:00"
}
```

On a provider failure the API persists an `error` execution and returns `502`.

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

Open http://localhost:3000. The dashboard probes `http://localhost:8000/health` and calls
`/execute` and `/runs` on the same API. Set `FIREWORKS_API_KEY` in the environment before
running the backend so executions reach the provider.

### Docker

```bash
cp .env.example .env       # set FIREWORKS_API_KEY
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

Environment variables: API settings use the `APP_` prefix (see `.env.example`); provider
credentials use `FIREWORKS_API_KEY` / `FIREWORKS_MODEL`; the web client uses
`NEXT_PUBLIC_API_URL`.

## Roadmap

- **Sprint 0 — Foundation**: scaffold, `/health`, dashboard, Docker, CI.
- **Sprint 1 — AI Execution** (current): Fireworks AI adapter + `/execute`, `/runs`, SQLite persistence, dashboard execution panel.
- **Sprint 2 — Persistence polish**: richer execution history, filters, metrics.
- **Sprint 3 — Polish**: Dashboard metrics + submission assets.

See [`docs/`](./docs) for the master plan, architecture detail, task tracking, and
decision log.
