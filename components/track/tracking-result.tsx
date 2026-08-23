"use client";

import * as React from "react";
import {
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Map,
  Phone,
  Mail,
  Building2,
  Box,
  Tag,
  Ruler,
  Scale,
  AlertTriangle,
  Barcode,
} from "lucide-react";
import { getShipmentStatusLabel } from "@/lib/shipments/statuses";
import { SHIPMENT_STATUS_COLORS } from "@/lib/shipments/statuses";
import type { PublicTrackingResult, PublicParty } from "@/lib/shipments/lookup";
import { TrackSearchForm } from "@/components/track/track-search-form";
import { Reveal } from "@/components/motion/reveal";

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

const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";

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

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function PartyCard({ title, party, accent }: { title: string; party: PublicParty; accent: string }) {
  return (
    <div className="relative rounded-[1.25rem] bg-muted/40 p-5 ring-1 ring-border/60 transition-colors duration-500 hover:bg-muted/70">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{title}</p>
      <p className="mt-2 text-base font-bold text-foreground">{party.name || "—"}</p>
      {party.company && (
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
          {party.company}
        </p>
      )}
      <div className="mt-3 space-y-1.5 border-t border-border/60 pt-3 text-sm">
        {party.phone && (
          <p className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Phone className={`h-3.5 w-3.5 ${accent}`} aria-hidden="true" />
            {party.phone}
          </p>
        )}
        {party.email && (
          <p className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Mail className={`h-3.5 w-3.5 ${accent}`} aria-hidden="true" />
            {party.email}
          </p>
        )}
      </div>
    </div>
  );
}

export function TrackingResult({ result }: { result: PublicTrackingResult }) {
  const { packageSummary: pkg } = result;

  return (
    <div className="mx-auto mt-14 max-w-5xl space-y-6">
      {/* Status banner — double bezel */}
      <Reveal>
        <div className="rounded-[2rem] bg-white/70 p-1.5 ring-1 ring-border/60 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.25)] backdrop-blur-sm">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Shipment
                </p>
                <p className="mt-2 font-mono text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {result.trackingNumber}
                </p>
              </div>
              <span
                className={`inline-flex w-fit rounded-full px-4 py-1.5 text-sm font-semibold ${SHIPMENT_STATUS_COLORS[result.status] ?? "bg-slate-100 text-slate-600"}`}
              >
                {getShipmentStatusLabel(result.status)}
              </span>
            </div>

            {/* Route */}
            <div className="mt-7 flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-5 ring-1 ring-border/60">
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Origin</p>
                <p className="mt-1 font-semibold text-foreground">{result.origin ?? "—"}</p>
              </div>
              <div className="flex flex-1 items-center justify-center px-4">
                <div className="relative w-full max-w-[180px]">
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />
                  <Truck className="relative mx-auto h-5 w-5 text-secondary" aria-hidden="true" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Destination</p>
                <p className="mt-1 font-semibold text-foreground">{result.destination ?? "—"}</p>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-1 divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="sm:px-4 sm:first:pl-0">
                <Field label="Current location" value={result.currentLocation ?? "—"} />
              </div>
              <div className="sm:px-4">
                <Field label="Delivery service" value={result.deliveryService ?? "—"} />
              </div>
              <div className="sm:px-4 sm:pr-0">
                <Field
                  label="Estimated delivery"
                  value={result.estimatedDelivery ? formatDateTime(result.estimatedDelivery) : "—"}
                />
              </div>
            </dl>
          </div>
        </div>
      </Reveal>

      {/* Shipment details + barcode — double bezel */}
      <Reveal delay={120}>
        <div className="rounded-[2rem] bg-white/70 p-1.5 ring-1 ring-border/60 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.25)] backdrop-blur-sm">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold tracking-tight text-foreground">Shipment details</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <Barcode className="h-3.5 w-3.5" aria-hidden="true" />
                {pkg.quantity ?? 1} package{pkg.quantity && pkg.quantity > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <PartyCard title="Sender" party={result.sender} accent="text-secondary" />
              <PartyCard title="Recipient" party={result.recipient} accent="text-accent" />
            </div>

            {/* Package details */}
            <div className="mt-4 rounded-[1.25rem] bg-muted/40 p-5 ring-1 ring-border/60">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                <Box className="h-3.5 w-3.5" aria-hidden="true" /> Package
              </p>
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
                {pkg.description && (
                  <p className="col-span-2 text-sm font-medium text-foreground sm:col-span-3">{pkg.description}</p>
                )}
                {pkg.content && (
                  <p className="col-span-2 text-sm text-muted-foreground sm:col-span-3">{pkg.content}</p>
                )}
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Scale className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                  {pkg.weight != null ? `${pkg.weight} ${pkg.weightUnit ?? "kg"}` : "—"}
                </p>
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Ruler className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                  {[pkg.length, pkg.width, pkg.height].some((d) => d != null)
                    ? `${[pkg.length, pkg.width, pkg.height].map((d) => d ?? "—").join(" × ")} cm`
                    : "—"}
                </p>
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Tag className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
                  {pkg.referenceNumber || "—"}
                </p>
                {pkg.declaredValue != null && (
                  <p className="text-sm font-semibold text-foreground">
                    Declared value · €{pkg.declaredValue.toLocaleString()}
                  </p>
                )}
                {pkg.isFragile && (
                  <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600">
                    <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" /> Fragile — handle with care
                  </p>
                )}
              </div>
            </div>

            {/* Barcode */}
            <div className="mt-4 flex flex-col items-center gap-3 rounded-[1.25rem] bg-white p-6 ring-1 ring-border/60">
              {result.barcodeSvg ? (
                <div
                  className="[&_svg]:h-auto [&_svg]:w-full max-w-[320px]"
                  dangerouslySetInnerHTML={{ __html: result.barcodeSvg }}
                />
              ) : (
                <p className="font-mono text-lg font-bold text-foreground">{result.trackingNumber}</p>
              )}
              <p className="text-center text-xs text-muted-foreground">
                Scan to track · <span className="font-mono font-semibold text-foreground">{result.trackingNumber}</span>
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Timeline — double bezel */}
      <Reveal delay={200}>
        <div className="rounded-[2rem] bg-white/70 p-1.5 ring-1 ring-border/60 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.25)] backdrop-blur-sm">
          <div className="rounded-[calc(2rem-0.375rem)] bg-white p-6 sm:p-8">
            <h2 className="text-lg font-bold tracking-tight text-foreground">Tracking timeline</h2>
            {result.events.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
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
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-700 ${EASE} ${
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
                          <time className="text-xs text-muted-foreground">{formatDateTime(event.dateTime)}</time>
                        </div>
                        {event.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                        )}
                        {event.location && (
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
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
        </div>
      </Reveal>

      {/* Search again */}
      <Reveal delay={280}>
        <div className="pt-4 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Track another shipment?
          </p>
          <TrackSearchForm />
        </div>
      </Reveal>
    </div>
  );
}