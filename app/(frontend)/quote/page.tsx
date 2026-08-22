import type { Metadata } from "next";
import { SubpageHero } from "@/components/shared/subpage-hero";
import { QuoteForm } from "@/components/quote/quote-form";

export const metadata: Metadata = {
  title: "Get a Quote | Send Clouding",
  description: "Get an instant shipping quote from Send Clouding. Transparent pricing across the Netherlands and the UK — no hidden fees.",
  openGraph: {
    title: "Get a Quote | Send Clouding",
    description: "Instant, transparent shipping quotes. Compare delivery services and prices in seconds.",
    type: "website",
  },
};

export default function QuotePage() {
  return (
    <>
      <SubpageHero
        eyebrow="Instant Quote"
        title="Know the price before you ship"
        description="Compare delivery services and get transparent pricing in seconds. No account needed, no hidden fees, no surprises."
      />
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <QuoteForm />
        </div>
      </section>
    </>
  );
}