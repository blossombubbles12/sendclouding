"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, Package } from "lucide-react";

export function TrackSearchForm() {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = React.useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tn = trackingNumber.trim().toUpperCase();
    if (!tn) return;
    router.push(`/track?tn=${encodeURIComponent(tn)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
    >
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
          placeholder="Enter tracking number, e.g. SC-2026-000001"
          className="h-14 w-full rounded-2xl border border-border bg-white pl-12 pr-4 font-mono text-base shadow-xl outline-none transition-colors focus:border-secondary focus:ring-2 focus:ring-secondary/20"
          aria-label="Tracking number"
          autoFocus
        />
      </div>
      <button
        type="submit"
        className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-secondary px-8 text-base font-semibold text-white shadow-lg shadow-secondary/25 transition-all hover:bg-secondary-600 active:scale-[0.98]"
      >
        <Package className="h-5 w-5" aria-hidden="true" />
        Track
      </button>
    </form>
  );
}