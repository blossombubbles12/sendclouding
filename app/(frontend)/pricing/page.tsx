import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Truck,
  PackageCheck,
  Container as ContainerIcon,
  Check,
  Plus,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing | Send Clouding",
  description:
    "Transparent courier and logistics pricing across the Netherlands and the UK. Same-day, next-day, nationwide and freight rates with no hidden fees.",
  openGraph: {
    title: "Pricing | Send Clouding",
    description: "Transparent delivery pricing — no surprises, no hidden fees.",
    type: "website",
  },
};

interface Tier {
  icon: LucideIcon;
  name: string;
  tagline: string;
  price: string;
  features: string[];
  featured?: boolean;
}

const tiers: Tier[] = [
  {
    icon: Truck,
    name: "Same-Day Express",
    tagline: "For urgent, must-arrive-today shipments",
    price: "from €19.90",
    features: ["4–8 hour metro delivery", "Live GPS tracking", "Signature on delivery", "Booked in under a minute"],
  },
  {
    icon: PackageCheck,
    name: "Next-Day",
    tagline: "The everyday standard across NL & UK",
    price: "from €9.90",
    features: ["Next business day", "Nationwide NL & UK", "Evening collection", "Proof of delivery"],
    featured: true,
  },
  {
    icon: ContainerIcon,
    name: "Freight & Pallet",
    tagline: "For bulk, oversized and pallet loads",
    price: "custom quote",
    features: ["Pallet & bulk freight", "Tail-lift & two-man", "Dedicated account manager"],
  },
];

interface MatrixRow {
  zone: string;
  local: string;
  sameDay: string;
  nextDay: string;
  freight: string;
}

const matrix: MatrixRow[] = [
  { zone: "Amsterdam Metro", local: "€4.90", sameDay: "€19.90", nextDay: "€9.90", freight: "—" },
  { zone: "NL Nationwide", local: "—", sameDay: "€24.90", nextDay: "€9.90", freight: "from €89" },
  { zone: "London Metro", local: "€5.90", sameDay: "€22.90", nextDay: "€11.90", freight: "—" },
  { zone: "UK Nationwide", local: "—", sameDay: "€27.90", nextDay: "€11.90", freight: "from €99" },
  { zone: "NL ↔ UK (Cross-border)", local: "—", sameDay: "—", nextDay: "€29.90", freight: "from €129" },
];

interface Addon {
  name: string;
  price: string;
  description: string;
}

const addons: Addon[] = [
  { name: "Signature on delivery", price: "€2.50", description: "Digital capture at the doorstep for extra certainty." },
  { name: "Fragile handling", price: "€4.00", description: "Priority boarding, protective packaging and care flags." },
  { name: "Insurance up to €500", price: "€3.50", description: "Declared-value cover on your shipment." },
  { name: "Cold chain packaging", price: "€8.00", description: "Validated thermal packaging for temperature-sensitive goods." },
  { name: "Two-man / tail-lift", price: "€25.00", description: "Extra crew and lifting equipment for heavy items." },
];

const faqs = [
  {
    q: "When do I pay?",
    a: "Prepaid at booking for standard and same-day shipments. Business accounts can switch to consolidated monthly invoicing.",
  },
  {
    q: "Are there volume discounts?",
    a: "Yes. Once you ship more than 20 parcels a month, our team will set you up with negotiated volume rates — usually 10–35% off.",
  },
  {
    q: "What's included in the price?",
    a: "Every price includes pickup, delivery, live tracking and proof of delivery. Fuel surcharges are already baked in — there are no hidden fees.",
  },
  {
    q: "How is the delivery window calculated?",
    a: "Windows are calculated from your collection postcode and the destination zone, updated in real time as your courier moves.",
  },
];

function TierCard({ tier }: { tier: Tier }) {
  const Icon = tier.icon;
  return (
    <div
      className={cn(
        "group relative h-full rounded-[2rem] p-1.5 ring-1 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5",
        tier.featured
          ? "bg-gradient-to-b from-secondary/25 via-secondary/10 to-secondary/15 ring-secondary/30"
          : "bg-gradient-to-b from-primary-100/70 via-primary-50/40 to-primary-100/50 ring-primary-200/60"
      )}
    >
      <div className="relative flex h-full flex-col rounded-[calc(2rem-0.75rem)] bg-white p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
        {tier.featured && (
          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-secondary px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            Most popular
          </span>
        )}
        <span
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]",
            tier.featured ? "bg-secondary" : "bg-primary-950"
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <h3 className="text-card-title mt-6 text-xl font-semibold text-foreground">{tier.name}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{tier.tagline}</p>
        <p className="mt-5 font-mono text-2xl font-bold tracking-tight text-foreground">{tier.price}</p>
        <ul className="mt-6 space-y-3 border-t border-primary-100 pt-6">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Check className="h-4 w-4 shrink-0 text-secondary" strokeWidth={2.25} />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-9">
          <Link
            href="/quote"
            className={cn(
              "group/btn inline-flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-sm font-semibold transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.97]",
              tier.featured ? "bg-secondary text-white" : "bg-primary-950 text-white"
            )}
          >
            Get a quote
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary-950 text-white">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/coveragebg.png"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-950/80 to-primary-900/85" />
        </div>
        <div aria-hidden="true" className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-secondary/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute -right-32 top-1/3 h-[30rem] w-[30rem] rounded-full bg-emerald-500/15 blur-[130px]" />

        <Container className="relative py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-secondary-300">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Transparent Pricing
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-hero mt-6">
                One price. <span className="text-secondary">No surprises.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
                Every rate includes pickup, delivery, live tracking and proof of delivery. No
                hidden fees, no fuel surcharges at the door.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/quote"
                  className="group inline-flex w-fit items-center gap-3 rounded-full bg-secondary py-1.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Calculate your rate
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 active:scale-[0.98]"
                >
                  Talk to sales
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Tiers */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                Delivery tiers
              </span>
              <h2 className="text-section-heading mt-5 text-foreground">Pick a speed, pay one price</h2>
              <p className="mt-4 text-body">
                Three levels of service, one transparent rate. Volume discounts kick in automatically for business accounts.
              </p>
            </div>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-8">
            {tiers.map((tier, index) => (
              <Reveal key={tier.name} delay={index * 90} className={tier.featured ? "md:-mt-4" : ""}>
                <TierCard tier={tier} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Rate matrix */}
      <section className="bg-muted/40 py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                Rate matrix
              </span>
              <h2 className="text-section-heading mt-5 text-foreground">From prices by zone</h2>
              <p className="mt-4 text-body">
                Indicative rates for a standard 5kg parcel. Final pricing is confirmed at booking based on size, weight and window.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="mx-auto mt-14 max-w-4xl rounded-[2rem] bg-gradient-to-b from-primary-100/70 via-primary-50/40 to-primary-100/50 p-1.5 ring-1 ring-primary-200/60">
              <div className="overflow-hidden rounded-[calc(2rem-0.75rem)] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left">
                    <thead>
                      <tr className="border-b border-primary-100">
                        <th className="px-6 py-5 text-sm font-semibold text-foreground">Zone</th>
                        <th className="px-6 py-5 text-sm font-semibold text-muted-foreground">Local</th>
                        <th className="px-6 py-5 text-sm font-semibold text-muted-foreground">Same-Day</th>
                        <th className="px-6 py-5 text-sm font-semibold text-muted-foreground">Next-Day</th>
                        <th className="px-6 py-5 text-sm font-semibold text-muted-foreground">Freight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matrix.map((row) => (
                        <tr key={row.zone} className="border-b border-primary-100/60 last:border-0">
                          <td className="px-6 py-5 text-sm font-medium text-foreground">{row.zone}</td>
                          <td className="px-6 py-5 font-mono text-sm text-foreground">{row.local}</td>
                          <td className="px-6 py-5 font-mono text-sm text-foreground">{row.sameDay}</td>
                          <td className="px-6 py-5 font-mono text-sm font-semibold text-secondary">{row.nextDay}</td>
                          <td className="px-6 py-5 font-mono text-sm text-foreground">{row.freight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Add-ons */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                Add-ons
              </span>
              <h2 className="text-section-heading mt-5 text-foreground">Optional extras, priced up front</h2>
            </div>
          </Reveal>
          <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addons.map((addon, index) => (
              <Reveal key={addon.name} delay={(index % 3) * 80}>
                <div className="h-full rounded-[1.5rem] bg-muted/60 p-1.5 ring-1 ring-primary-200/50">
                  <div className="flex h-full flex-col rounded-[calc(1.5rem-0.5rem)] bg-white p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary-50 text-secondary-700">
                        <Plus className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="font-mono text-sm font-bold text-foreground">{addon.price}</span>
                    </div>
                    <h3 className="text-card-title mt-4 font-semibold text-foreground">{addon.name}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{addon.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="bg-muted/40 py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                  Pricing FAQ
                </span>
                <h2 className="text-section-heading mt-5 text-foreground">Questions, answered</h2>
                <p className="mt-4 text-body">
                  Still unsure? Our team responds within minutes during business hours.
                </p>
                <Link
                  href="/contact"
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-primary-950 py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  Ask a question
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </span>
                </Link>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Reveal key={faq.q} delay={index * 60}>
                    <div className="rounded-2xl bg-white p-1.5 ring-1 ring-primary-200/60">
                      <div className="rounded-[calc(1.5rem-0.5rem)] bg-white p-6">
                        <h3 className="text-card-title font-semibold text-foreground">{faq.q}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary-950 py-28 text-white sm:py-36">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/homectafooter.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/85 to-primary-900/80" />
        </div>
        <div aria-hidden="true" className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-secondary/15 blur-[120px]" />

        <Container className="relative text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-secondary-300">
              Let&apos;s move
            </span>
            <h2 className="text-page-title mx-auto mt-6 max-w-3xl">
              Ship smarter, <span className="text-secondary">pay less.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
              Get an instant rate or talk to our team about volume pricing for your business.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/quote"
                className="group inline-flex items-center gap-3 rounded-full bg-secondary py-1.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Get a quote
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                </span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 active:scale-[0.98]"
              >
                Talk to sales
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}