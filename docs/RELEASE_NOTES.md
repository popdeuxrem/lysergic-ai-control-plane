# Release v1.0.0 — Lysergic Control Plane

Submitted to the **AMD Developer Hackathon — Unicorn Track**.

## What it is

Lysergic Control Plane is an operational control plane for reliable AI execution. It turns a prompt
into a recorded, measurable, replayable operation: submit a prompt, run it through Fireworks AI on AMD
Instinct-backed infrastructure, measure latency, and persist every execution to SQLite. A live
observability dashboard surfaces metrics, history, per-execution detail, and a latency-trend chart.

## Highlights

- **AI execution pipeline** — `POST /execute` runs a prompt through Fireworks AI and persists the result.
- **Persistent history** — every run (success or failure) is stored in SQLite.
- **Observability** — live metrics (total / successful / failed / success-rate / avg latency), searchable
  history, per-execution detail drawer, and a native SVG latency-trend chart, all polling every 5s.
- **Container-first deployment** — `docker compose up --build` brings up the full stack with a healthcheck
  and a volume-backed database.
- **Production-oriented design** — FastAPI + Pydantic v2, Next.js 15 (App Router, TypeScript strict),
  adapter-isolated provider access, structured JSON logging, explicit error handling.

## Stack

FastAPI · Next.js 15 · Docker Compose · SQLite · Fireworks AI (AMD Instinct GPUs) · Python 3.12 ·
TypeScript.

## Deploy

```bash
cp .env.example .env        # set FIREWORKS_API_KEY
docker compose up --build
```

- API: http://localhost:8000 (docs at `/docs`)
- Web: http://localhost:3000

For Codespaces / public access, see the README "Codespaces / public deployment" section.

## Verification

- `make ci` (ruff + pytest + `next build`) is green in CI.
- End-to-end verified: `/health`, `/execute` (real Fireworks inference), and `/runs` with persisted
  history including a genuine provider failure.

## Notes

- `npm audit` reports 2 moderate advisories in transitive dev dependencies; deferred to avoid a
  pre-submission breaking change.
- AMD technologies used: AMD Developer Cloud (target deployment), Fireworks AI (AMD Instinct-backed
  inference), containerized reproducible deployment.
