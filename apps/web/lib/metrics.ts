import type { Execution } from "./types";

export type Metrics = {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
  averageLatencyMs: number;
};

export function computeMetrics(executions: Execution[]): Metrics {
  const total = executions.length;
  const successful = executions.filter((e) => e.status === "success").length;
  const failed = total - successful;
  const successRate = total === 0 ? 0 : (successful / total) * 100;
  const averageLatencyMs =
    total === 0
      ? 0
      : Math.round(executions.reduce((sum, e) => sum + e.latency_ms, 0) / total);

  return { total, successful, failed, successRate, averageLatencyMs };
}
