"use client";

import type { Execution } from "@/lib/types";

import { CopyButton } from "@/components/shared/CopyButton";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-200">{value}</dd>
    </div>
  );
}

export default function ExecutionDetail({
  execution,
  onBack,
}: {
  execution: Execution | null;
  onBack: () => void;
}) {
  if (!execution) return null;

  const ok = execution.status === "success";

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onBack}
        aria-hidden="true"
      />
      <div className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-slate-800 bg-slate-900 p-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-slate-400 transition hover:text-slate-100"
          >
            ← Back
          </button>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              ok ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {execution.status}
          </span>
        </div>

        <h2 className="mt-4 text-lg font-semibold text-white">Execution Detail</h2>
        <p className="mt-1 break-all font-mono text-xs text-slate-500">{execution.id}</p>

        <dl className="mt-6 space-y-4">
          <Field label="Status" value={execution.status} />
          <Field label="Model" value={execution.model} />
          <Field label="Latency" value={`${execution.latency_ms} ms`} />
          <Field label="Timestamp" value={formatTime(execution.created_at)} />
        </dl>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">Prompt</h3>
            <CopyButton value={execution.prompt} label="Copy Prompt" />
          </div>
          <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-100">
            {execution.prompt}
          </pre>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Response
            </h3>
            <CopyButton value={execution.response} label="Copy Response" />
          </div>
          <pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-100">
            {execution.response}
          </pre>
        </div>
      </div>
    </div>
  );
}
