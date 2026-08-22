import type { Metadata } from "next";
import { SubpageHero } from "@/components/shared/subpage-hero";
import { ShipForm } from "@/components/ship/ship-form";

export const metadata: Metadata = {
  title: "Ship a Package | Send Clouding",
  description: "Book a shipment with Send Clouding. Enter your details, get an instant quote, and schedule pickup across the Netherlands and the UK.",
  openGraph: {
    title: "Ship a Package | Send Clouding",
    description: "Instant quotes, real-time tracking, and nationwide coverage. Book your shipment in under a minute.",
    type: "website",
  },
};

export default async function ShipPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; region?: string }>;
}) {
  const sp = await searchParams;

  return (
    <>
      <SubpageHero
        eyebrow="Ship a Package"
        title="Book your shipment in minutes"
        description="Enter sender and recipient details, choose your delivery speed, and get an instant transparent quote. No account required to start."
      />
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <ShipForm initialCity={sp.city ?? ""} initialRegion={sp.region ?? ""} />
        </div>
      </section>
    </>
  );
}