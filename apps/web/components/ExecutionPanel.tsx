"use client";

import { useCallback, useEffect, useState } from "react";

type Execution = {
  id: string;
  prompt: string;
  response: string;
  model: string;
  latency_ms: number;
  status: string;
  created_at: string;
};

export default function ExecutionPanel() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latest, setLatest] = useState<Execution | null>(null);
  const [runs, setRuns] = useState<Execution[]>([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  const loadRuns = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/runs`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setRuns((await response.json()) as Execution[]);
    } catch {
      // History is non-critical; ignore load failures.
    }
  }, [apiUrl]);

  useEffect(() => {
    loadRuns();
  }, [loadRuns]);

  async function execute() {
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
      });
      const data = (await response.json()) as Execution & { detail?: Execution };
      if (!response.ok) {
        const message = data.detail?.response ?? data.response ?? `HTTP ${response.status}`;
        throw new Error(message);
      }
      setLatest(data);
      setPrompt("");
      await loadRuns();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
        AI Execution
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Submit a prompt to run inference through the Fireworks AI adapter.
      </p>

      <div className="mt-5">
        <label
          htmlFor="prompt"
          className="block text-xs font-medium uppercase tracking-wide text-slate-500"
        >
          Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          rows={3}
          placeholder="Ask the model something…"
          className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-500 disabled:opacity-60"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={execute}
            disabled={loading || !prompt.trim()}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Running…" : "Execute"}
          </button>
          {loading && (
            <span className="text-xs text-slate-400">Contacting inference service…</span>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {latest && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Response
            </h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                latest.status === "success"
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-rose-500/10 text-rose-400"
              }`}
            >
              {latest.status}
            </span>
          </div>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-100">
            {latest.response}
          </pre>
          <p className="mt-2 text-xs text-slate-500">
            Model: <span className="font-mono text-slate-300">{latest.model}</span> · Latency:{" "}
            {latest.latency_ms} ms
          </p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Execution History
        </h3>
        {runs.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">No executions yet.</p>
        ) : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-2 py-2">Time</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Model</th>
                  <th className="px-2 py-2">Latency</th>
                  <th className="px-2 py-2">Prompt</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr key={run.id} className="border-t border-slate-800">
                    <td className="px-2 py-2 text-slate-400">
                      {new Date(run.created_at).toLocaleString()}
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          run.status === "success"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-rose-500/10 text-rose-400"
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td className="px-2 py-2 font-mono text-xs text-slate-300">
                      {run.model}
                    </td>
                    <td className="px-2 py-2 text-slate-400">{run.latency_ms} ms</td>
                    <td className="max-w-xs truncate px-2 py-2 text-slate-300">
                      {run.prompt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
