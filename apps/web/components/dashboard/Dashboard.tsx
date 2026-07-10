"use client";

import { useState } from "react";

import ExecutionDetail from "@/components/executions/ExecutionDetail";
import ExecutionTable from "@/components/executions/ExecutionTable";
import LatencyTrendChart from "@/components/executions/LatencyTrendChart";
import NewExecutionForm from "@/components/executions/NewExecutionForm";
import MetricsCards from "@/components/metrics/MetricsCards";
import { EmptyState, ErrorState } from "@/components/shared/StatePanel";
import { MetricsSkeleton, TableSkeleton } from "@/components/shared/Skeleton";
import { useExecutions } from "@/hooks/useExecutions";
import type { Execution } from "@/lib/types";

import Header from "./Header";

export default function Dashboard() {
  const { executions, loading, error, retry } = useExecutions({
    limit: 500,
    pollIntervalMs: 5000,
  });
  const [selected, setSelected] = useState<Execution | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  const showSkeleton = loading && executions.length === 0;
  const showError = !loading && error !== null && executions.length === 0;
  const showEmpty = !loading && !error && executions.length === 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Header healthy={error === null} onNew={() => setComposerOpen(true)} />

      {composerOpen && <NewExecutionForm onClose={() => setComposerOpen(false)} />}

      <section className="mt-6">
        {showSkeleton ? <MetricsSkeleton /> : <MetricsCards executions={executions} />}
      </section>

      <section className="mt-6">
        <LatencyTrendChart executions={executions} loading={showSkeleton} />
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-300">
            Execution History
          </h2>
          {!showSkeleton && !showError && !showEmpty && (
            <span className="text-xs text-slate-500">auto-refresh · 5s</span>
          )}
        </div>

        {showSkeleton && <TableSkeleton />}
        {showError && (
          <ErrorState message={`Unable to load executions: ${error}`} onRetry={retry} />
        )}
        {showEmpty && (
          <EmptyState
            message="No executions yet."
            actionLabel="Run your first prompt"
            onAction={() => setComposerOpen(true)}
          />
        )}
        {!showSkeleton && !showError && !showEmpty && (
          <ExecutionTable
            executions={executions}
            onSelect={setSelected}
            selectedId={selected?.id}
          />
        )}
      </section>

      <ExecutionDetail execution={selected} onBack={() => setSelected(null)} />
    </main>
  );
}
