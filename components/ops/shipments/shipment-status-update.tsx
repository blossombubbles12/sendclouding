"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { SHIPMENT_STATUSES, getShipmentStatusLabel } from "@/lib/shipments/query";

export function ShipmentStatusUpdate({
  shipmentId,
  currentStatus,
}: {
  shipmentId: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = React.useState(currentStatus);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (status === currentStatus) return;
    setLoading(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch(`/api/ops/shipments/${shipmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update status");
      }
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-3">
      <label className="block text-sm font-medium text-slate-700" htmlFor="shipment-status">
        Update status
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          id="shipment-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {SHIPMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {getShipmentStatusLabel(s)}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading || status === currentStatus}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : (
            "Save Status"
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && (
        <p className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Status updated — tracking event recorded.
        </p>
      )}
    </form>
  );
}