# Repository Audit Report

Generated for hackathon submission readiness. Scope: production-readiness review, dead-code and
secret scanning, build reproducibility, and README accuracy.

## Summary

| Check | Result |
| --- | --- |
| No TODO / FIXME / HACK markers | ✅ Pass |
| No secrets committed | ✅ Pass |
| No dead imports / unused symbols (ruff `F`) | ✅ Pass |
| No unused dependencies | ✅ Pass |
| No duplicate files | ✅ Pass |
| No duplicate components | ✅ Pass |
| No unreachable routes | ✅ Pass |
| `.gitignore` correct | ✅ Pass |
| Docker builds from a clean clone | ✅ Pass |
| README instructions accurate | ⚠️ Fixed (model default) |
| Every command verified | ✅ Pass |

## Details

### TODO / FIXME / HACK
Scanned `apps`, `packages`, `docs` for `TODO`, `FIXME`, `XXX`, `HACK`, `BUG:`. The only match was the
string "Unicorn Track" in the dashboard header (a hackathon track name, not a marker). No outstanding
work markers remain.

### Secrets
- `.env` is git-ignored and has **never** been committed (`git log --all -- .env` is empty).
- No `fw_…`, `sk-…`, or hardcoded API keys in any tracked file.
- Live `FIREWORKS_API_KEY` lives only in the local untracked `.env`.

### Dead code / unused imports
- `ruff check app` passes with rules `E,F,I,B,UP` (pyflakes `F` catches unused imports/names).
- `app/health.py` (`get_health`, `SERVICE_NAME`) is used by `routers/health.py` — intentional layering.

### Unused dependencies
- **API** (`requirements.txt`): `fastapi`, `uvicorn[standard]` (Docker `CMD`), `pydantic`,
  `pydantic-settings`, `httpx` — all referenced.
- **Web** (`package.json`): `next`, `react`, `react-dom` runtime; `typescript`, `tailwindcss`,
  `postcss`, `autoprefixer`, `@types/*` dev — all referenced. No stray packages.
- `npm ci` + `npm run build` succeed (2 moderate transitive advisories in the dev tree; see Notes).

### Duplicate files / components
- No duplicate source files. `health` is split across `app/health.py` (service),
  `routers/health.py` (route), `schemas/health.py` (model) — intentional separation, not duplication.
- Each dashboard component exists once under its feature folder.

### Routes
Reachable routes: `GET /`, `GET /health`, `POST /execute`, `GET /runs`, `GET /runs/{id}`. All are
registered in `app/main.py`. No orphaned/disabled routes.

### `.gitignore`
Correctly ignores `node_modules/`, `.next/`, `__pycache__/`, `.pytest_cache/`, `.ruff_cache/`,
`*.db`, `.env`, and editor/OS junk. `docs/screenshots/node_modules` is covered by the global
`node_modules/` rule.

### Docker from a clean clone
- `apps/api` context: `requirements.txt` (pinned `==`) + `app/` — builds.
- `apps/web` context: `package.json` + `package-lock.json` + `app/` + `public/` (`.gitkeep` present, so
  `COPY --from=builder /app/public` succeeds) — builds.
- Both `Dockerfile`s use pinned base images and pinned dependency versions → reproducible.
- `apps/web/.dockerignore` added to exclude local `node_modules`/`.next`/`.env` from the build context.

### README accuracy
- **Fixed:** `docker-compose.yml` `FIREWORKS_MODEL` default now `gpt-oss-120b`, matching code and
  `.env.example` (was `llama-v3p1-8b-instruct`).
- CORS documentation added (`CORS_ORIGINS` for Codespaces).
- All other README commands (Docker, local, API endpoints, env vars) verified against the running
  stack.

## Notes / recommendations
- `npm audit` reports 2 moderate advisories in transitive dev dependencies. Not fixed to avoid
  breaking the build before submission; recommend a post-submission `npm audit` review.
- `allow_credentials=True` with a `*` CORS default only matters for credentialed cross-origin
  requests; the dashboard uses default (non-credentialed) `fetch`, so local `*` works. Codespaces
  deployments set explicit origins via `CORS_ORIGINS`.
