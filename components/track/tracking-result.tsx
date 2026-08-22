"use client";

import * as React from "react";
import { Package, Truck, MapPin, CheckCircle2, Clock, ShieldCheck, Map } from "lucide-react";
import { getShipmentStatusLabel } from "@/lib/shipments/statuses";
import { SHIPMENT_STATUS_COLORS } from "@/lib/shipments/query";
import type { PublicTrackingResult } from "@/lib/shipments/lookup";
import { TrackSearchForm } from "@/components/track/track-search-form";

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

export function TrackingResult({ result }: { result: PublicTrackingResult }) {
  return (
    <div className="mx-auto mt-12 max-w-4xl">
      {/* Status banner */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-caption uppercase tracking-wide text-muted-foreground">Shipment</p>
            <p className="mt-1 font-mono text-2xl font-bold text-foreground">
              {result.trackingNumber}
            </p>
          </div>
          <span className={`inline-flex w-fit rounded-full px-4 py-1.5 text-sm font-semibold ${SHIPMENT_STATUS_COLORS[result.status] ?? "bg-slate-100 text-slate-600"}`}>
            {getShipmentStatusLabel(result.status)}
          </span>
        </div>

        {/* Route */}
        <div className="mt-6 flex items-center justify-between rounded-xl bg-muted/50 px-4 py-4">
          <div className="text-center">
            <p className="text-caption text-muted-foreground">Origin</p>
            <p className="mt-0.5 font-semibold text-foreground">{result.origin ?? "—"}</p>
          </div>
          <div className="flex flex-1 items-center justify-center px-4">
            <div className="relative w-full max-w-[180px]">
              <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />
              <Truck className="relative mx-auto h-5 w-5 text-secondary" aria-hidden="true" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-caption text-muted-foreground">Destination</p>
            <p className="mt-0.5 font-semibold text-foreground">{result.destination ?? "—"}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border p-3 text-center">
            <p className="text-caption text-muted-foreground">Current location</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">{result.currentLocation ?? "—"}</p>
          </div>
          <div className="rounded-xl border border-border p-3 text-center">
            <p className="text-caption text-muted-foreground">Delivery service</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">{result.deliveryService ?? "—"}</p>
          </div>
          <div className="rounded-xl border border-border p-3 text-center">
            <p className="text-caption text-muted-foreground">Estimated delivery</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {result.estimatedDelivery ? formatDateTime(result.estimatedDelivery) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-card-title font-semibold text-foreground">Tracking timeline</h2>
        {result.events.length === 0 ? (
          <p className="mt-6 rounded-xl bg-muted/50 px-4 py-6 text-center text-sm text-muted-foreground">
            No tracking events yet.
          </p>
        ) : (
          <ol className="mt-6">
            {result.events.map((event, index) => {
              const Icon = STATUS_ICONS[event.status] ?? Package;
              const isLatest = index === 0;
              return (
                <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {index < result.events.length - 1 && (
                    <span className="absolute left-[15px] top-9 h-full w-px bg-border" aria-hidden="true" />
                  )}
                  <span
                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isLatest
                        ? "bg-secondary text-white ring-4 ring-secondary/15"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-semibold text-foreground">{getShipmentStatusLabel(event.status)}</p>
                      <time className="text-caption text-muted-foreground">{formatDateTime(event.dateTime)}</time>
                    </div>
                    {event.description && (
                      <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                    )}
                    {event.location && (
                      <p className="mt-1 inline-flex items-center gap-1 text-caption text-muted-foreground">
                        <Map className="h-3 w-3" aria-hidden="true" />
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

      {/* Search again */}
      <div className="mt-10 text-center">
        <p className="text-caption text-muted-foreground">Track another shipment?</p>
        <TrackSearchForm />
      </div>
    </div>
  );
}