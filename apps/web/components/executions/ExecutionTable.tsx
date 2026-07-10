"use client";

import type { Execution } from "@/lib/types";

function formatTime(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

function StatusBadge({ status }: { status: string }) {
  const ok = status === "success";
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        ok ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
      }`}
    >
      {status}
    </span>
  );
}

function shortModel(model: string): string {
  const parts = model.split("/");
  return parts[parts.length - 1] || model;
}

export default function ExecutionTable({
  executions,
  onSelect,
  selectedId,
}: {
  executions: Execution[];
  onSelect: (execution: Execution) => void;
  selectedId?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-slate-500">
          <tr className="border-b border-slate-800">
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Latency</th>
            <th className="px-4 py-3 font-medium">Model</th>
            <th className="px-4 py-3 font-medium">Prompt</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {executions.map((execution) => (
            <tr
              key={execution.id}
              onClick={() => onSelect(execution)}
              className={`cursor-pointer border-b border-slate-800/60 transition hover:bg-slate-800/40 ${
                selectedId === execution.id ? "bg-slate-800/40" : ""
              }`}
            >
              <td className="px-4 py-3">
                <StatusBadge status={execution.status} />
              </td>
              <td className="px-4 py-3 text-slate-400">{formatTime(execution.created_at)}</td>
              <td className="px-4 py-3 text-slate-300">{execution.latency_ms} ms</td>
              <td className="px-4 py-3 font-mono text-xs text-slate-300">
                {shortModel(execution.model)}
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-slate-200">
                {execution.prompt}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(execution);
                  }}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
