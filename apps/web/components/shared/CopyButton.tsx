"use client";

import { useState } from "react";

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context); ignore.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md border border-slate-700 px-2.5 py-1 text-xs text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
