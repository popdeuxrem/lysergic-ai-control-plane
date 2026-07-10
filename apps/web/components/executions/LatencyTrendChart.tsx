"use client";

import type { Execution } from "@/lib/types";

import { Skeleton } from "@/components/shared/Skeleton";

const WIDTH = 100;
const HEIGHT = 36;
const PADDING = 3;

export default function LatencyTrendChart({
  executions,
  loading,
}: {
  executions: Execution[];
  loading: boolean;
}) {
  const points = [...executions].reverse();
  const hasData = points.length > 0;

  let linePath = "";
  let areaPath = "";

  if (hasData) {
    const latencies = points.map((e) => e.latency_ms);
    const max = Math.max(...latencies);
    const min = Math.min(...latencies);
    const range = max - min || 1;
    const count = points.length;

    const coords = points.map((e, i) => {
      const x = count <= 1 ? WIDTH / 2 : PADDING + (i / (count - 1)) * (WIDTH - 2 * PADDING);
      const y = HEIGHT - PADDING - ((e.latency_ms - min) / range) * (HEIGHT - 2 * PADDING);
      return [x, y] as const;
    });

    linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
    areaPath = `${linePath} L${coords[coords.length - 1][0].toFixed(2)},${HEIGHT} L${coords[0][0].toFixed(2)},${HEIGHT} Z`;
  }

  const latest = points[points.length - 1];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-400">
          Latency Trend
        </h2>
        <span className="text-xs text-slate-500">
          {hasData ? `latest ${latest.latency_ms} ms` : "no data"}
        </span>
      </div>

      <div className="mt-4 h-24 w-full">
        {loading && !hasData ? (
          <Skeleton className="h-full w-full" />
        ) : hasData ? (
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            className="h-full w-full"
            role="img"
            aria-label="Execution latency trend over time"
          >
            <path d={areaPath} fill="rgba(16,185,129,0.12)" stroke="none" />
            <path
              d={linePath}
              fill="none"
              stroke="#34d399"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-800 text-sm text-slate-500">
            No latency data yet.
          </div>
        )}
      </div>
    </div>
  );
}
