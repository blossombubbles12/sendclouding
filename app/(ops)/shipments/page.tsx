import Link from "next/link";
import { Plus, Package, ArrowUpDown } from "lucide-react";
import type { Metadata } from "next";
import { queryShipments, SHIPMENT_STATUS_COLORS, getShipmentStatusLabel } from "@/lib/shipments/query";
import { ShipmentFilters } from "@/components/ops/shipments/shipment-filters";

export const metadata: Metadata = {
  title: "Shipments | Send Clouding Ops",
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function ShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Number.parseInt(sp.page ?? "1", 10) || 1;

  const { docs, totalDocs, totalPages, page: currentPage } = await queryShipments({
    search: sp.search,
    status: sp.status,
    page,
  });

  function pageHref(nextPage: number) {
    const params = new URLSearchParams();
    if (sp.search) params.set("search", sp.search);
    if (sp.status && sp.status !== "all") params.set("status", sp.status);
    params.set("page", String(nextPage));
    return `/ops/shipments?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Shipments</h1>
          <p className="mt-1 text-sm text-slate-500">
            {totalDocs.toLocaleString()} total ·{" "}
            {sp.status && sp.status !== "all" ? getShipmentStatusLabel(sp.status) : "all statuses"}
          </p>
        </div>
        <Link
          href="/ops/shipments/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Shipment
        </Link>
      </div>

      <ShipmentFilters />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-medium">Tracking #</th>
                <th className="px-4 py-3 font-medium">Route</th>
                <th className="px-4 py-3 font-medium">Recipient</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Est. Delivery</th>
                <th className="px-4 py-3 text-right font-medium">
                  <span className="inline-flex items-center gap-1">
                    <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                    Created
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-slate-400">
                    <Package className="mx-auto mb-3 h-8 w-8 text-slate-300" aria-hidden="true" />
                    No shipments found
                  </td>
                </tr>
              )}
              {docs.map((doc) => (
                <tr key={doc.id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link href={`/ops/shipments/${doc.id}`} className="font-mono font-medium text-primary hover:underline">
                      {doc.trackingNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {doc.origin ?? "—"} <span className="text-slate-400">→</span> {doc.destination ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{doc.recipientName}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${SHIPMENT_STATUS_COLORS[doc.status] ?? "bg-slate-100 text-slate-600"}`}>
                      {getShipmentStatusLabel(doc.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(doc.estimatedDelivery)}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{formatDate(doc.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            {currentPage > 1 && (
              <Link href={pageHref(currentPage - 1)} className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Previous
              </Link>
            )}
            {currentPage < totalPages && (
              <Link href={pageHref(currentPage + 1)} className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}