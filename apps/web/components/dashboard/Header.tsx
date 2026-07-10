"use client";

export default function Header({
  healthy,
  onNew,
}: {
  healthy: boolean;
  onNew: () => void;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
          AMD Developer Hackathon · Unicorn Track
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Lysergic Control Plane
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          AI execution observability — live metrics, history, and latency.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 text-xs text-slate-400">
          <span
            className={`h-2 w-2 rounded-full ${
              healthy ? "bg-emerald-400" : "bg-rose-400"
            }`}
          />
          {healthy ? "API online" : "API unreachable"}
        </span>
        <button
          type="button"
          onClick={onNew}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          New Execution
        </button>
      </div>
    </header>
  );
}
