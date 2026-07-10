"use client";

import { useState } from "react";

import { executePrompt } from "@/lib/api";

export default function NewExecutionForm({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    const trimmed = prompt.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    try {
      await executePrompt(trimmed);
      setPrompt("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Execution failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
          New Execution
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          Close
        </button>
      </div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
        rows={3}
        placeholder="Ask the model something…"
        className="mt-3 w-full rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-500 disabled:opacity-60"
      />
      {error && (
        <p className="mt-2 text-sm text-rose-400">{error}</p>
      )}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={run}
          disabled={loading || !prompt.trim()}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Running…" : "Execute"}
        </button>
        {loading && <span className="text-xs text-slate-400">Contacting inference…</span>}
      </div>
    </div>
  );
}
