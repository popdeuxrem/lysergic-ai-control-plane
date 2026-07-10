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
