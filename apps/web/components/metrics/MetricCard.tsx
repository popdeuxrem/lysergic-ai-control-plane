export function MetricCard({
  label,
  value,
  accent = "slate",
}: {
  label: string;
  value: string;
  accent?: "emerald" | "rose" | "slate";
}) {
  const color =
    accent === "rose"
      ? "text-rose-400"
      : accent === "emerald"
        ? "text-emerald-400"
        : "text-slate-100";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}
