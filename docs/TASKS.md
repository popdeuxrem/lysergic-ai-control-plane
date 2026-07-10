# Tasks

Tracked status: `[x]` done · `[~]` in progress · `[ ]` planned.

## Sprint 0 — Foundation

- [x] Repository structure (apps, packages, docs, docker, .github)
- [x] Backend: FastAPI app factory + `/health`
- [x] Backend: typed config (`pydantic-settings`, `APP_` prefix)
- [x] Backend: structured JSON logging
- [x] Backend: CORS configuration
- [x] Backend: SQLite initialization + connection helper
- [x] Backend: graceful startup/shutdown (lifespan)
- [x] Backend: pytest smoke tests for `/health`
- [x] Frontend: Next.js 15 App Router scaffold
- [x] Frontend: dashboard (System Status, Backend Status, Architecture Overview)
- [x] Frontend: live `/health` probe component
- [x] Docker: `Dockerfile` for api and web
- [x] Docker: `docker-compose.yml` (api + web, volume, healthcheck)
- [x] CI: GitHub Actions (ruff + pytest, next build)
- [x] Docs: MASTER_PLAN, ARCHITECTURE, TASKS, DECISIONS
- [x] Tooling: Makefile, `.env.example`, `.gitignore`

## Sprint 1 — Fireworks AI integration

- [ ] Fireworks client/service
- [ ] `POST /execute` endpoint + schema
- [ ] Error handling for provider failures

## Sprint 2 — Persistence

- [ ] Execution history schema + migrations
- [ ] Repository layer over SQLite
- [ ] History query endpoints

## Sprint 3 — Polish

- [ ] Dashboard metrics (counts, latency)
- [ ] Submission assets (demo script, screenshots)
