# docker/

This directory holds shared Docker and Compose helpers that are reused across services.

Per-service `Dockerfile`s live next to their applications:

- `apps/api/Dockerfile` — FastAPI service image
- `apps/web/Dockerfile` — Next.js standalone image

`docker-compose.yml` at the repository root wires the services together.
