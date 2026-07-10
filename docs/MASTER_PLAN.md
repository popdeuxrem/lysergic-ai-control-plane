# Master Plan

This document tracks the delivery plan for the Lysergic Control Plane (AMD Developer
Hackathon — Unicorn Track).

## Vision

A deterministic, observable control plane for running and tracing AI workloads on AMD
hardware, with a clean operational dashboard and reproducible container-first deployment.

## Sprints

| Sprint | Scope | Status |
| ------ | ----- | ------ |
| Sprint 0 — Foundation | Monorepo scaffold, FastAPI `/health`, Next.js dashboard, Docker Compose, CI | Done |
| Sprint 1 — AI Execution | Fireworks adapter + `/execute`, `/runs`, SQLite persistence, dashboard execution panel | Done |
| Sprint 2 — Persistence polish | Richer execution history, filters, metrics | Planned |
| Sprint 3 — Polish | Dashboard metrics + submission assets | Planned |

## Definition of Done (per sprint)

- Everything builds (API tests + web build green in CI).
- No placeholder/TODO code ships.
- No invented APIs, libraries, or environment variables.
- Explicit error handling and structured logging present where relevant.
- Documentation updated to reflect the change.

## Non-goals (Sprint 0)

- AI inference / Fireworks integration.
- Authentication / authorization.
- Business logic beyond health reporting.
- Shared OpenAPI client (deferred — see `docs/DECISIONS.md`).

## Milestones

1. Repository scaffold and tooling wired (`make`, CI, Docker).
2. Backend service with `/health`, structured logging, CORS, SQLite init, graceful lifecycle.
3. Frontend dashboard (System Status, Backend Status, Architecture Overview).
4. Compose-based local deployment (`docker compose up`).
5. CI green on push/PR.
