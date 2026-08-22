"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { SHIPMENT_STATUSES, getShipmentStatusLabel } from "@/lib/shipments/statuses";

export function ShipmentFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const status = searchParams.get("status") ?? "all";

  function applyFilters(nextStatus: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }
    params.set("status", nextStatus);
    params.delete("page");
    router.push(`/ops/shipments?${params.toString()}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    applyFilters(status);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by tracking number…"
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Search shipments"
        />
      </div>
      <select
        value={status}
        onChange={(e) => applyFilters(e.target.value)}
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Filter by status"
      >
        <option value="all">All statuses</option>
        {SHIPMENT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {getShipmentStatusLabel(s)}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
      >
        Search
      </button>
    </form>
  );
}