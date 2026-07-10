import type { Execution } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function fetchJson<T>(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const data = (await response.json().catch(() => null)) as unknown;
    if (!response.ok) {
      const message =
        (data as { detail?: Execution })?.detail?.response ??
        (data as Execution)?.response ??
        `HTTP ${response.status}`;
      throw new Error(message);
    }
    return data as T;
  } finally {
    clearTimeout(timer);
  }
}

export function fetchExecutions(limit = 500, timeoutMs = 5000): Promise<Execution[]> {
  return fetchJson<Execution[]>(
    `${API_BASE_URL}/runs?limit=${limit}`,
    {},
    timeoutMs,
  );
}

export function executePrompt(prompt: string, timeoutMs = 60000): Promise<Execution> {
  return fetchJson<Execution>(
    `${API_BASE_URL}/execute`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    },
    timeoutMs,
  );
}
