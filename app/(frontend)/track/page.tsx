import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { SubpageHero } from "@/components/shared/subpage-hero";
import { TrackSearchForm } from "@/components/track/track-search-form";
import { TrackingResult } from "@/components/track/tracking-result";
import { lookupShipmentByTrackingNumber } from "@/lib/shipments/lookup";

export const metadata: Metadata = {
  title: "Track Your Shipment | Send Clouding",
  description: "Track your Send Clouding shipment in real time. Enter your tracking number for live status updates, milestone history, and estimated delivery.",
  openGraph: {
    title: "Track Your Shipment | Send Clouding",
    description: "Real-time tracking with every milestone — pickup, in transit, out for delivery, delivered.",
    type: "website",
  },
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ tn?: string }>;
}) {
  const sp = await searchParams;
  const tn = sp.tn?.trim().toUpperCase() ?? "";

  let result = null;
  let searched = false;
  if (tn) {
    searched = true;
    result = await lookupShipmentByTrackingNumber(tn);
  }

  return (
    <>
      <SubpageHero
        eyebrow="Live Tracking"
        title="Track your shipment"
        description="Enter your tracking number for real-time status updates and the full journey history."
      />

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {!tn && (
            <div className="mx-auto max-w-2xl text-center">
              <PackageSearch className="mx-auto h-12 w-12 text-secondary" aria-hidden="true" />
              <TrackSearchForm />
              <p className="mt-4 text-caption text-muted-foreground">
                Your tracking number looks like <span className="font-mono">SC-2026-000001</span>. Find it in your
                SMS/WhatsApp confirmation or email.
              </p>
            </div>
          )}

          {searched && !result && (
            <div className="mx-auto max-w-2xl text-center">
              <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
                <h2 className="mt-4 text-section-heading text-foreground">Shipment not found</h2>
                <p className="mt-3 text-body text-muted-foreground">
                  We couldn&apos;t find a shipment with tracking number{" "}
                  <span className="font-mono font-medium text-foreground">{tn}</span>. Please double-check the number
                  or contact our support team.
                </p>
              </div>
              <TrackSearchForm />
            </div>
          )}

          {result && <TrackingResult result={result} />}
        </div>
      </section>
    </>
  );
}