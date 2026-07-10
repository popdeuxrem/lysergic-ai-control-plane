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

## Sprint 1 — AI Execution

- [x] `services/fireworks.py` adapter (env key, configurable model/timeout, retry-once, latency, logging)
- [x] `POST /execute` endpoint (request → Fireworks → persist → respond)
- [x] `GET /runs` (latest executions) and `GET /runs/{id}`
- [x] `Execution` model + `ExecutionOut` schema
- [x] Repository layer over SQLite (`app/repository/executions.py`)
- [x] `executions` table migration in `database.init_db`
- [x] Frontend execution panel (prompt, execute, response viewer, history, loading/error)
- [x] Tests: repository layer + `/execute` endpoint
- [x] Docs + `.env.example` updated for Fireworks

## Sprint 2 — Observability dashboard

- [x] `hooks/useExecutions.ts` — 5s polling, no duplicate requests, timer cleanup
- [x] `lib/api.ts` shared fetch helper (executions + execute, timeout/abort)
- [x] `lib/metrics.ts` — total/successful/failed/success-rate/avg-latency
- [x] `components/dashboard/Dashboard.tsx` + `Header.tsx`
- [x] `components/metrics/MetricsCards.tsx` + `MetricCard.tsx`
- [x] `components/executions/ExecutionTable.tsx` (newest first, row → detail)
- [x] `components/executions/ExecutionDetail.tsx` (drawer: copy prompt/response, back)
- [x] `components/executions/NewExecutionForm.tsx` (run a prompt)
- [x] `components/executions/LatencyTrendChart.tsx` (native SVG, no deps)
- [x] `components/shared/` — Skeleton, StatePanel (empty/error), CopyButton
- [x] Loading skeletons, empty state, error/retry state
- [x] Responsive dark operational theme

## Sprint 3 — Polish

- [ ] README diagrams + screenshots
- [ ] Demo video
- [ ] Submission assets
