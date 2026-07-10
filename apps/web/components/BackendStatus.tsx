"use client";

import { useEffect, useState } from "react";

type Health = {
  status: string;
  service: string;
};

type State =
  | { kind: "loading" }
  | { kind: "ok"; data: Health }
  | { kind: "error"; message: string };

export default function BackendStatus() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

    fetch(`${baseUrl}/health`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json() as Promise<Health>;
      })
      .then((data) => setState({ kind: "ok", data }))
      .catch((error: unknown) =>
        setState({
          kind: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
      );
  }, []);

  const badge =
    state.kind === "ok" ? (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Operational
      </span>
    ) : state.kind === "error" ? (
      <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-400">
        <span className="h-2 w-2 rounded-full bg-rose-400" />
        Unreachable
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 rounded-full bg-slate-500/10 px-3 py-1 text-xs font-medium text-slate-400">
        <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400" />
        Checking
      </span>
    );

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Backend Status
        </h2>
        {badge}
      </div>
      <p className="mt-1 text-sm text-slate-400">
        Live health probe against the FastAPI service.
      </p>
      <div className="mt-5 space-y-3">
        {state.kind === "ok" && (
          <>
            <Row label="Status" value={state.data.status} />
            <Row label="Service" value={state.data.service} />
          </>
        )}
        {state.kind === "error" && (
          <Row label="Error" value={state.message} />
        )}
        {state.kind === "loading" && <Row label="State" value="Connecting to API…" />}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</span>
      <span className="font-mono text-sm text-slate-100">{value}</span>
    </div>
  );
}
