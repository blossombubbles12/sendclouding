import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Truck, Package, MapPin, CheckCircle2, Clock, ShieldCheck, Phone, Mail, User } from "lucide-react";
import type { Metadata } from "next";
import { getShipmentDetail } from "@/lib/shipments/detail";
import { getShipmentStatusLabel } from "@/lib/shipments/statuses";
import { SHIPMENT_STATUS_COLORS } from "@/lib/shipments/query";
import { ShipmentStatusUpdate } from "@/components/ops/shipments/shipment-status-update";

export const metadata: Metadata = {
  title: "Shipment Detail | Send Clouding Ops",
};

const STATUS_ICONS: Record<string, typeof CheckCircle2> = {
  created: Package,
  "pickup-scheduled": Clock,
  "picked-up": Truck,
  "in-transit": Truck,
  "out-for-delivery": MapPin,
  delivered: CheckCircle2,
  delayed: Clock,
  exception: ShieldCheck,
  cancelled: Package,
  returned: Package,
};

function formatDateTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="shrink-0 text-sm text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-800">{value}</dd>
    </div>
  );
}

export default async function ShipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shipment = await getShipmentDetail(id);

  if (!shipment) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/ops/shipments" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All shipments
        </Link>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-slate-900">
              {shipment.trackingNumber}
            </h1>
            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${SHIPMENT_STATUS_COLORS[shipment.status] ?? "bg-slate-100 text-slate-600"}`}>
              {getShipmentStatusLabel(shipment.status)}
            </span>
          </div>
          <Link href={`/ops/shipments/${shipment.id}/edit`} className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            Edit Shipment
          </Link>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Created {formatDateTime(shipment.createdAt)} · Updated {formatDateTime(shipment.updatedAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Route + status update */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Route</h2>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-4">
              <div className="text-center">
                <p className="text-sm text-slate-500">Origin</p>
                <p className="mt-0.5 font-semibold text-slate-900">{shipment.origin ?? "—"}</p>
              </div>
              <div className="flex-1 px-4">
                <div className="relative">
                  <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-slate-300" />
                  <Truck className="relative mx-auto h-5 w-5 text-primary" aria-hidden="true" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-500">Destination</p>
                <p className="mt-0.5 font-semibold text-slate-900">{shipment.destination ?? "—"}</p>
              </div>
            </div>
            <dl className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
              <InfoRow label="Current location" value={shipment.currentLocation ?? "—"} />
              <InfoRow label="Delivery service" value={shipment.deliveryService ?? "—"} />
              <InfoRow label="Estimated delivery" value={shipment.estimatedDelivery ? formatDateTime(shipment.estimatedDelivery) : "—"} />
            </dl>
            <div className="mt-6 border-t border-slate-100 pt-5">
              <ShipmentStatusUpdate shipmentId={shipment.id} currentStatus={shipment.status} />
            </div>
          </div>

          {/* Tracking timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tracking Timeline</h2>
            {shipment.trackingEvents.length === 0 ? (
              <p className="mt-6 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                No tracking events yet.
              </p>
            ) : (
              <ol className="mt-6 space-y-0">
                {shipment.trackingEvents.map((event, index) => {
                  const Icon = STATUS_ICONS[event.status] ?? Package;
                  const isLatest = index === 0;
                  return (
                    <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
                      {index < shipment.trackingEvents.length - 1 && (
                        <span className="absolute left-[15px] top-9 h-full w-px bg-slate-200" aria-hidden="true" />
                      )}
                      <span
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isLatest
                            ? "bg-primary text-white ring-4 ring-primary/15"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-medium text-slate-900">{getShipmentStatusLabel(event.status)}</p>
                          <time className="text-xs text-slate-400">{formatDateTime(event.dateTime)}</time>
                        </div>
                        {event.description && <p className="mt-1 text-sm text-slate-500">{event.description}</p>}
                        {event.location && (
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400">
                            <MapPin className="h-3 w-3" aria-hidden="true" />
                            {event.location}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <User className="h-4 w-4" aria-hidden="true" /> Sender
            </h2>
            <p className="mt-3 font-medium text-slate-900">{shipment.sender.name}</p>
            {shipment.sender.company && <p className="text-sm text-slate-500">{shipment.sender.company}</p>}
            <div className="mt-3 space-y-1.5 text-sm text-slate-600">
              <p className="inline-flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                {shipment.sender.phone}
              </p>
              {shipment.sender.email && (
                <p className="inline-flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  {shipment.sender.email}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <User className="h-4 w-4" aria-hidden="true" /> Recipient
            </h2>
            <p className="mt-3 font-medium text-slate-900">{shipment.recipient.name}</p>
            {shipment.recipient.company && <p className="text-sm text-slate-500">{shipment.recipient.company}</p>}
            <div className="mt-3 space-y-1.5 text-sm text-slate-600">
              <p className="inline-flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                {shipment.recipient.phone}
              </p>
              {shipment.recipient.email && (
                <p className="inline-flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                  {shipment.recipient.email}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <Package className="h-4 w-4" aria-hidden="true" /> Package
            </h2>
            <dl className="mt-3 divide-y divide-slate-100 text-sm">
              <InfoRow label="Description" value={shipment.package.description ?? "—"} />
              <InfoRow label="Content" value={shipment.package.content ?? "—"} />
              <InfoRow label="Quantity" value={shipment.package.quantity ?? "—"} />
              <InfoRow
                label="Weight"
                value={
                  shipment.package.weight != null
                    ? `${shipment.package.weight} ${shipment.package.weightUnit ?? "kg"}`
                    : "—"
                }
              />
              <InfoRow
                label="Declared value"
                value={shipment.package.declaredValue != null ? `€${shipment.package.declaredValue.toLocaleString()}` : "—"}
              />
              <InfoRow label="Reference" value={shipment.package.referenceNumber ?? "—"} />
              <InfoRow label="Fragile" value={shipment.package.isFragile ? "Yes" : "No"} />
            </dl>
          </div>

          {shipment.notes && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Notes</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{shipment.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}