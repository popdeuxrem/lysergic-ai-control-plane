# Architecture

## Overview

The control plane is a two-tier system orchestrated by Docker Compose:

```
┌──────────────┐      HTTP /health      ┌──────────────────┐
│  Next.js 15  │ ───────────────────▶  │  FastAPI (Python │
│  Dashboard   │                        │  3.12)           │
│  :3000       │                        │  :8000           │
└──────────────┘                        └────────┬─────────┘
                                                 │ sqlite3
                                                 ▼
                                        ┌──────────────────┐
                                        │  SQLite          │
                                        │  /data/lysergic. │
                                        │  db              │
                                        └──────────────────┘
```

## Components

### Web (`apps/web`)

- Next.js 15 with the App Router and TypeScript.
- Tailwind CSS for a clean operational dashboard layout.
- Three dashboard regions:
  - **System Status** — static runtime configuration.
  - **Backend Status** — client-side live probe of `GET /health`.
  - **Architecture Overview** — layered topology of the system.
- Built as a standalone image (`output: "standalone"`) for a minimal runtime.

### API (`apps/api`)

- FastAPI application with a single `create_app()` factory for testability.
- Layered, modular layout:
  - `config.py` — typed settings via `pydantic-settings` (env prefix `APP_`).
  - `logging.py` — structured JSON logging to stdout.
  - `database.py` — SQLite lifecycle + connection helper (Python stdlib).
  - `health.py` — health reporting logic.
  - `schemas/` — Pydantic request/response models (`health`, `execution`).
  - `routers/` — API routes (`health`, `executions`).
  - `services/fireworks.py` — the only module that talks to the Fireworks AI provider.
  - `repository/executions.py` — SQLite access for executions (no SQL in routers).
  - `models/execution.py` — domain `Execution` dataclass.
- Graceful startup/shutdown via the FastAPI `lifespan` context manager.
- CORS configured from settings.

### AI Execution flow

```
POST /execute
  → routers/executions.py
  → services/fireworks.generate(prompt)
       → POST https://api.fireworks.ai/inference/v1/chat/completions
       → retry once on transient failure (429/5xx/network)
       → measures latency_ms
  → repository.create_execution(...)
  → return ExecutionOut
```

- `GET /runs` returns the latest executions ordered by insertion (most recent first).
- `GET /runs/{id}` returns a single execution or `404`.
- On a provider failure the execution is still persisted with `status="error"` and the
  endpoint returns `502`, so the dashboard can show failures in history.

### Data

- SQLite accessed through the Python standard library (`sqlite3`).
- A single `init_db()` call ensures the database file, directory, and the `executions` table
  exist; connection helper `get_connection()` yields a `sqlite3.Row`-backed connection.
- All execution SQL lives in `app/repository/executions.py`; routers never contain SQL.

### Platform

- Docker Compose defines `api` and `web` services with a named volume (`api-data`) for the
  database, a healthcheck on the API, and a `depends_on` link so the web service waits for a
  healthy API.

## Communication

- The browser reaches the API on `localhost:8000` (mapped by Compose).
- The web container references the API by service name (`http://web:3000`) for CORS, while
  the browser uses `http://localhost:8000`.
- `NEXT_PUBLIC_API_URL` is inlined at build time and defaults to `http://localhost:8000`.

## Design principles applied

- **Deterministic over clever** — explicit config, no hidden magic.
- **Observable over opaque** — structured JSON logs, a health endpoint, live status.
- **Reversible over destructive** — SQLite file behind a volume; no destructive commands.
- **Modular over monolithic** — clear package boundaries, factory-based app creation.
- **Typed over dynamic** — Pydantic schemas, TypeScript strict mode.
- **Minimal dependencies** — SQLite via stdlib, no shared client yet.
