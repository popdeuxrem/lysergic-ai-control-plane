"use client";

export function EmptyState({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-10 text-center">
      <p className="text-slate-400">{message}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
      >
        {actionLabel}
      </button>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-10 text-center">
      <p className="text-rose-300">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg border border-rose-400/50 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
      >
        Retry
      </button>
    </div>
  );
}
