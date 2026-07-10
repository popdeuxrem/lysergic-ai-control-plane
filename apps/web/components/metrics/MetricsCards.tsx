import { computeMetrics } from "@/lib/metrics";
import type { Execution } from "@/lib/types";

import { MetricCard } from "./MetricCard";

export default function MetricsCards({ executions }: { executions: Execution[] }) {
  const m = computeMetrics(executions);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <MetricCard label="Total Executions" value={String(m.total)} />
      <MetricCard label="Successful" value={String(m.successful)} accent="emerald" />
      <MetricCard
        label="Failed"
        value={String(m.failed)}
        accent={m.failed > 0 ? "rose" : "slate"}
      />
      <MetricCard label="Success Rate" value={`${m.successRate.toFixed(1)}%`} accent="emerald" />
      <MetricCard label="Avg Latency" value={`${m.averageLatencyMs} ms`} />
    </div>
  );
}
