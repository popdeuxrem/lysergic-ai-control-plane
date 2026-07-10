# Decisions

Recorded architectural decisions and their rationale. Update as the project evolves.

## D-001 — Monorepo layout

**Decision:** Single repository with `apps/api`, `apps/web`, `packages/*`, `docker/`, and
top-level Compose.

**Rationale:** Simplest reproducible setup for a hackathon; one `docker compose up` brings up
the whole system; no workspace tooling required.

## D-002 — No shared OpenAPI client (yet)

**Decision:** Do not generate a shared typed client between frontend and backend in Sprint 0.

**Rationale:** Adds complexity for limited value during the foundation sprint. The frontend
talks to a single, stable `/health` endpoint; a shared client can be introduced later in
`packages/shared` or `packages/types` if the surface grows.

## D-003 — `pydantic-settings` for configuration

**Decision:** Use `pydantic-settings` with the `APP_` env prefix.

**Rationale:** Typed, deterministic environment loading consistent with Pydantic v2; avoids
hand-rolled `os.environ` parsing.

## D-004 — SQLite via Python standard library

**Decision:** Use `sqlite3` directly rather than an ORM such as SQLAlchemy.

**Rationale:** Minimal dependencies, full control, and sufficient for the MVP. A repository
layer isolates access so an ORM could be adopted later without touching callers.

## D-005 — Structured JSON logging

**Decision:** Custom `JsonFormatter` writing JSON to stdout.

**Rationale:** Observable, machine-parseable logs without an extra dependency.

## D-006 — Tailwind CSS v3

**Decision:** Use Tailwind CSS v3 (not v4) for the dashboard.

**Rationale:** Stable, well-understood toolchain with the classic PostCSS pipeline, reducing
build-risk for the submission.

## D-007 — Next.js standalone output

**Decision:** Build the web image with `output: "standalone"`.

**Rationale:** Minimal production runtime image; only `server.js`, `.next/static`, and
`public` are copied into the runner stage.

## D-008 — NEXT_PUBLIC_API_URL inlined at build time

**Decision:** The API base URL is set at build time (default `http://localhost:8000`).

**Rationale:** The browser always talks to the host-mapped API port; runtime config via env
is unnecessary for this topology.

## D-009 — Fireworks as an adapter behind `services/fireworks.py`

**Decision:** All provider communication lives in `app/services/fireworks.py`. Routers and the
rest of the app call `fireworks.generate(prompt)` and never touch the Fireworks API directly.

**Rationale:** Isolates the external dependency, makes the provider swappable, and keeps the
endpoint logic about the domain (persist + respond), not transport. The adapter reads
`FIREWORKS_API_KEY`, uses a configurable `FIREWORKS_MODEL` and `FIREWORKS_TIMEOUT`, retries once
on transient failures (429/5xx/network errors), measures `latency_ms`, and returns a
normalized `FireworksResult`.

## D-010 — Provider env vars are unprefixed

**Decision:** Provider credentials use `FIREWORKS_API_KEY` / `FIREWORKS_MODEL` /
`FIREWORKS_TIMEOUT` (no `APP_` prefix); app settings keep the `APP_` prefix.

**Rationale:** Provider keys are conventionally unprefixed secrets; `pydantic-settings`
`validation_alias` with `AliasChoices` reads the unprefixed name while preserving `APP_`
fallbacks.

## D-011 — Persist failures too

**Decision:** A failed provider call is persisted as an execution with `status="error"` and
the endpoint returns `502`.

**Rationale:** Observable over opaque — the execution history should reflect reality (both
successes and failures), and the dashboard can render error states from real records.

## D-012 — Sprint 2 metrics computed client-side from `GET /runs`

**Decision:** The dashboard metrics (total / successful / failed / success-rate / average
latency) and the latency-trend chart are computed in the browser from the `GET /runs` payload.
Sprint 2 made no backend changes.

**Rationale:** Keeps the execution pipeline untouched and ships the observability layer as a
pure frontend concern. Trade-off: metrics reflect the fetched window (default 50, raised to
500 via the `limit` query param), not a global aggregate — acceptable for the MVP demo and
called out as a known limitation.

## D-013 — Latency chart uses native SVG, no chart dependency

**Decision:** `LatencyTrendChart` renders an SVG polyline/area with `vectorEffect` scaling; no
charting library is added.

**Rationale:** Minimal dependencies; the chart is small, themeable, and updates automatically
with the 5s polling data.
