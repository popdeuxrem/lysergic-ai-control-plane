import ArchitectureOverview from "@/components/ArchitectureOverview";
import BackendStatus from "@/components/BackendStatus";
import ExecutionPanel from "@/components/ExecutionPanel";
import SystemStatus from "@/components/SystemStatus";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
          AMD Developer Hackathon · Unicorn Track
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
          Lysergic Control Plane
        </h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Production infrastructure for reliable AI execution. Orchestrate and observe
          inference workloads across AMD hardware.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <SystemStatus />
        <BackendStatus />
      </div>

      <div className="mt-6">
        <ExecutionPanel />
      </div>

      <div className="mt-6">
        <ArchitectureOverview />
      </div>
    </main>
  );
}
