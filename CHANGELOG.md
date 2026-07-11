# Changelog

All notable changes to Lysergic Control Plane are documented here. The project follows
Sprint-based delivery for the AMD Developer Hackathon (Unicorn Track).

## [1.0.0] — Hackathon Submission

### Deployment & Codespaces hardening (this release)
- **CORS fix (critical):** the Docker Compose `APP_CORS_ORIGINS` default was wrapped in literal
  quotes (`"http://localhost:3000"`), so the API never echoed a valid `Access-Control-Allow-Origin`
  and every browser fetch was blocked. Removed the literal quotes.
- **Codespaces origins:** added `CORS_ORIGINS` to `.env` (and documented it in `.env.example`) so the
  dashboard is callable from the forwarded Codespaces web URL as well as `localhost` and the `web`
  service host.
- **Frontend API base URL:** the web `Dockerfile` now consumes the `NEXT_PUBLIC_API_URL` build arg
  (previously hardcoded to `http://localhost:8000` and ignoring `WEB_API_URL`). This lets the
  dashboard talk to the public backend URL when opened on an external device (e.g. a phone).
- **Model default consistency:** `docker-compose.yml` `FIREWORKS_MODEL` default now matches the code
  and `.env.example` (`accounts/fireworks/models/gpt-oss-120b`); previously it defaulted to
  `llama-v3p1-8b-instruct`, so a clean clone ran the wrong model.
- **Deterministic builds:** web image and CI now use `npm ci` instead of `npm install`; added
  `apps/web/.dockerignore` to keep the build context clean (excludes `node_modules`, `.next`, `.env`).
- **Screenshots:** generated `docs/screenshots/{dashboard,execute,history,detail}.png` via the existing
  Playwright capture script; fixed the detail-drawer capture step so it opens the execution drawer.

### Documentation
- `README.md` refreshed for accuracy (architecture, environment variables, Quick Start, Docker).
- `docs/AUDIT_REPORT.md` added (repository audit).
- `docs/RELEASE_NOTES.md` added (submission release notes).
- `CHANGELOG.md` added (this file).

## [Sprint 3] — Polish
- `README.md` diagrams, architecture overview, screenshots, demo storyboard, and submission assets.
- `docs/demo-script.md` — ≤3 minute demo storyboard.
- Playwright screenshot capture script under `docs/screenshots/`.

## [Sprint 2] — Observability Dashboard
- `hooks/useExecutions.ts` — 5s polling with in-flight guard and timer cleanup.
- `lib/api.ts` shared fetch helper and `lib/metrics.ts` aggregations.
- Dashboard: metrics cards, execution table, detail drawer, new-execution form, native SVG latency
  trend chart, skeletons, empty/error states, responsive dark theme.

## [Sprint 1] — AI Execution
- `services/fireworks.py` adapter (env key, configurable model/timeout, single retry on transient
  failures, latency measurement, structured logging).
- `POST /execute`, `GET /runs`, `GET /runs/{id}` endpoints.
- `Execution` model + `ExecutionOut`/`ExecutionCreate` schemas.
- SQLite repository layer (`app/repository/executions.py`) with `executions` table migration.
- Frontend execution panel (prompt, execute, response viewer, history, loading/error states).
- Tests for the repository layer and `/execute` endpoint (Fireworks mocked).

## [Sprint 0] — Foundation
- Monorepo scaffold (`apps/api`, `apps/web`, `packages`, `docs`, `docker`, `.github`).
- FastAPI app factory + `/health` (lifespan, structured JSON logging, CORS, SQLite init).
- Typed config via `pydantic-settings` (`APP_` prefix; unprefixed `FIREWORKS_*`).
- Next.js 15 App Router dashboard with live `/health` probe.
- `Dockerfile`s for api and web; `docker-compose.yml` (api + web, named volume, healthcheck).
- GitHub Actions CI (ruff + pytest, `next build`).
- `Makefile`, `.env.example`, `.gitignore`, and planning docs (`MASTER_PLAN`, `ARCHITECTURE`,
  `TASKS`, `DECISIONS`).
