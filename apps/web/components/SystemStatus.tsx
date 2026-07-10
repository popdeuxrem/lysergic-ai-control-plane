const systemItems: ReadonlyArray<{ label: string; value: string }> = [
  { label: "Control Plane", value: "Lysergic AI" },
  { label: "Environment", value: process.env.NODE_ENV === "production" ? "Production" : "Development" },
  { label: "Web", value: "Next.js 15" },
  { label: "API", value: "FastAPI · Python 3.12" },
  { label: "Database", value: "SQLite" },
  { label: "Runtime", value: "Docker Compose" },
];

export default function SystemStatus() {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
        System Status
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Control plane components and their current runtime configuration.
      </p>
      <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {systemItems.map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-950/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {item.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-100">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
