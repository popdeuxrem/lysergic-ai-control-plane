const architectureLayers: ReadonlyArray<{
  name: string;
  items: ReadonlyArray<string>;
}> = [
  {
    name: "Client",
    items: ["Next.js 15 dashboard", "Tailwind CSS", "TypeScript (App Router)"],
  },
  {
    name: "API",
    items: ["FastAPI service", "Pydantic v2 schemas", "Structured logging", "CORS"],
  },
  {
    name: "Data",
    items: ["SQLite (Python stdlib)", "Repository layer (Sprint 1+)"],
  },
  {
    name: "Platform",
    items: ["Docker Compose", "AMD hardware target"],
  },
];

export default function ArchitectureOverview() {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
        Architecture Overview
      </h2>
      <p className="mt-1 text-sm text-slate-400">
        Layered topology of the control plane foundation.
      </p>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {architectureLayers.map((layer) => (
          <div
            key={layer.name}
            className="rounded-lg border border-slate-800 bg-slate-950/50 p-4"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {layer.name}
            </h3>
            <ul className="mt-3 space-y-2">
              {layer.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-200">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
