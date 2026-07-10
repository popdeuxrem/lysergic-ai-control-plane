# Demo Video — Storyboard (≤ 3 minutes)

Record at 1440×900, dark theme, browser at a comfortable zoom. Keep narration calm and
engineering-focused.

## 0:00 – 0:20 — The problem

> "Most AI demos stop at 'prompt in, response out.' But real systems need observability,
> persistence, and operational insight. Lysergic Control Plane is built for that."

- Show the dashboard landing view.
- Emphasize: history, latency, failures are invisible in typical LLM demos.

## 0:20 – 1:00 — The dashboard

Walk through the four regions:

- **Metrics** — total executions, successful, failed, success rate, average latency.
- **Execution history** — status, created, latency, model, prompt preview; newest first.
- **Latency trend** — native SVG chart that updates with polling.
- **Execution detail** — open a row; show prompt, response, model, latency, status,
  timestamp, and the copy actions.

## 1:00 – 2:00 — Run a prompt live

- Click **New Execution**, type a prompt, click **Execute**.
- Show the loading state, then the returned response.
- Show the history row appear and the latency chart update automatically (5s polling).

## 2:00 – 2:40 — Docker deployment

Open a terminal and run:

```bash
cp .env.example .env
docker compose up --build
```

Show the API and web containers starting, then reload the dashboard to prove it runs from
containers end-to-end.

## 2:40 – 3:00 — Close

> "Lysergic Control Plane — operational infrastructure for reliable AI execution. Built for
> the AMD Developer Hackathon using FastAPI, Next.js, Docker, SQLite, and Fireworks AI."

- End on the dashboard with a populated history.
