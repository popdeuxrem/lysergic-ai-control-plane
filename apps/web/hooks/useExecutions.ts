"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { fetchExecutions } from "@/lib/api";
import type { Execution } from "@/lib/types";

type UseExecutionsOptions = {
  limit?: number;
  pollIntervalMs?: number;
};

export function useExecutions(options: UseExecutionsOptions = {}) {
  const { limit = 500, pollIntervalMs = 5000 } = options;
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);

  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    try {
      const data = await fetchExecutions(limit);
      setExecutions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load executions");
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    load();
    const timer = setInterval(load, pollIntervalMs);
    return () => clearInterval(timer);
  }, [load, pollIntervalMs]);

  return { executions, loading, error, retry: load };
}
