# Screenshots

Capture the four submission screenshots with a headless browser.

## Requirements

- A running stack (`docker compose up -d`) with `FIREWORKS_API_KEY` set so the history
  populates with real executions.
- [Playwright](https://playwright.dev/) with the Chromium browser.

## Run

```bash
# from the repo root
npm i -D playwright
npx playwright install chromium

node docs/screenshots/capture.mjs
```

The script seeds a few executions, waits for the 5s polling to refresh, and writes:

- `dashboard.png` — dashboard overview
- `execute.png` — prompt execution in progress
- `history.png` — execution history populated
- `detail.png` — execution detail drawer open

## Options

| Env var | Default | Purpose |
| --- | --- | --- |
| `WEB_URL` | `http://localhost:3000` | Dashboard base URL. |
| `API_URL` | `http://localhost:8000` | API base URL (used to seed history). |
| `SEED` | `true` | Set `SEED=false` to skip seeding. |
