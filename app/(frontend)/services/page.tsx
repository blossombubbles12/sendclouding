import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Truck,
  PackageCheck,
  Plane,
  Boxes,
  RefreshCw,
  Container as ContainerIcon,
  ShieldCheck,
  Snowflake,
  Gem,
  Warehouse,
  Workflow,
  Check,
  MapPin,
  MoveRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import { ServicesAnchor } from "./services-anchor";

export const metadata: Metadata = {
  title: "Services | Send Clouding",
  description:
    "Courier and logistics services across the Netherlands and the UK — same-day express, next-day nationwide, international shipping, e-commerce fulfilment, returns and freight.",
  openGraph: {
    title: "Services | Send Clouding",
    description: "Delivery services engineered for speed — same-day, next-day, international and freight.",
    type: "website",
  },
};

interface Service {
  type: string;
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  span: string;
}

const services: Service[] = [
  {
    type: "same-day",
    icon: Truck,
    title: "Same-Day Express",
    description:
      "Door-to-door courier delivery in 4–8 hours across major metros in the Netherlands and the UK.",
    features: ["Live GPS tracking on every stop", "Flexible pickup windows", "Signature & photo proof of delivery"],
    span: "lg:col-span-7",
  },
  {
    type: "express",
    icon: PackageCheck,
    title: "Next-Day Nationwide",
    description:
      "Guaranteed next-business-day delivery to more than 500 cities and towns across both countries.",
    features: ["Nationwide NL & UK coverage", "Evening collection", "Precise delivery windows"],
    span: "lg:col-span-5",
  },
  {
    type: "international",
    icon: Plane,
    title: "International Shipping",
    description:
      "Cross-border NL–UK and European freight with customs paperwork handled end to end.",
    features: ["Door-to-door EU & UK service", "Customs documentation included", "Trackable across borders"],
    span: "lg:col-span-5",
  },
  {
    type: "ecommerce",
    icon: Boxes,
    title: "E-commerce Fulfilment",
    description:
      "Pick, pack and ship your store orders with API automation and branded tracking pages.",
    features: ["REST API, webhooks & store plugins", "Branded tracking pages", "Automated carrier booking"],
    span: "lg:col-span-7",
  },
  {
    type: "returns",
    icon: RefreshCw,
    title: "Returns & Reverse Logistics",
    description:
      "Managed returns with inspection, restocking or disposal — visible in your dashboard.",
    features: ["Return labels generated in seconds", "Quality inspection on arrival", "Restock, repair or recycle flows"],
    span: "lg:col-span-7",
  },
  {
    type: "freight",
    icon: ContainerIcon,
    title: "Freight & Pallet",
    description:
      "Reliable pallet and bulk freight for larger consignments, booked in minutes.",
    features: ["Pallet & oversized consignments", "Tail-lift and two-man delivery", "Single point of contact"],
    span: "lg:col-span-5",
  },
];

interface Specialized {
  type: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const specialized: Specialized[] = [
  { type: "fragile", icon: ShieldCheck, title: "Fragile Items", description: "Careful handling plans for breakables" },
  { type: "cold-chain", icon: Snowflake, title: "Cold Chain", description: "Temperature-controlled transit" },
  { type: "high-value", icon: Gem, title: "High Value", description: "Insured, priority handling" },
  { type: "bulk", icon: Warehouse, title: "Bulk Shipping", description: "Volume pricing & scheduled drops" },
  { type: "api", icon: Workflow, title: "API Integration", description: "Plug straight into our platform" },
];

const stats = [
  { value: "500+", label: "Cities & Towns" },
  { value: "30+", label: "Sorting Hubs" },
  { value: "4–8 hrs", label: "Same-Day Metro" },
  { value: "98.7%", label: "On-Time Delivery" },
];

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

function LiveShipmentCard() {
  const steps = [
    { label: "Picked up — Amsterdam", done: true },
    { label: "In transit — NL hub", done: true },
    { label: "Out for delivery — London", done: true, active: true },
    { label: "Delivered", done: false },
  ];

  return (
    <div className="relative rounded-[2.25rem] bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur-xl">
      <div className="rounded-[calc(2.25rem-0.5rem)] bg-primary-950/80 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-secondary-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Live shipment
          </span>
          <span className="font-mono text-xs text-white/50">SC-2026-004812</span>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-caption text-white/45">Origin</p>
            <p className="mt-1 font-mono text-sm font-semibold text-white">AMS</p>
          </div>
          <div className="relative h-px flex-1 bg-gradient-to-r from-secondary/60 via-secondary/40 to-emerald-400/60">
            <span className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-secondary text-white">
              <Truck className="h-3.5 w-3.5" strokeWidth={1.75} />
            </span>
          </div>
          <div>
            <p className="text-caption text-right text-white/45">Destination</p>
            <p className="mt-1 font-mono text-right text-sm font-semibold text-white">LON</p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">Out for delivery</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
              <MoveRight className="h-3 w-3" />
              ETA 16:40
            </span>
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-secondary to-emerald-400" />
          </div>
          <div className="mt-5 space-y-3.5">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1",
                    step.done
                      ? "bg-emerald-400/20 text-emerald-300 ring-emerald-400/40"
                      : "bg-white/5 text-white/30 ring-white/15"
                  )}
                >
                  {step.done ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                </span>
                <p
                  className={cn(
                    "text-sm",
                    step.done ? "text-white/85" : "text-white/35",
                    step.active && "font-semibold text-white"
                  )}
                >
                  {step.label}
                </p>
                {i < steps.length - 1 && (
                  <span className={cn("h-px flex-1", step.done ? "bg-white/15" : "bg-white/5")} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  return (
    <div
      id={`service-${service.type}`}
      className="group relative h-full rounded-[2rem] bg-gradient-to-b from-primary-100/80 via-primary-50/40 to-primary-100/50 p-1.5 ring-1 ring-primary-200/60 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1.5"
    >
      <div className="flex h-full flex-col rounded-[calc(2rem-0.75rem)] bg-white p-7 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] sm:p-9">
        <div className="flex items-center justify-between">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-950 text-secondary shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-primary-300">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <h3 className="text-card-title mt-6 text-xl font-semibold text-foreground">{service.title}</h3>
        <p className="mt-3 text-body">{service.description}</p>
        <ul className="mt-5 space-y-2.5">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={2.25} />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-9">
          <Link
            href="/quote"
            className="group/btn inline-flex items-center gap-3 rounded-full bg-primary-950 py-1.5 pl-5 pr-1.5 text-sm font-medium text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.97]"
          >
            Book this service
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
              <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function SpecializedCard({ item }: { item: Specialized }) {
  const Icon = item.icon;
  return (
    <div
      id={`special-${item.type}`}
      className="h-full rounded-[1.5rem] bg-white/70 p-1 ring-1 ring-primary-200/50 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1"
    >
      <div className="flex h-full flex-col rounded-[calc(1.5rem-0.5rem)] bg-white p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary-700">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <p className="mt-4 text-sm font-semibold text-foreground">{item.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
      </div>
    </div>
  );
}

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
              tier.featured
                ? "bg-secondary text-white"
                : "bg-primary-950 text-white"
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

export default function ServicesPage() {
  return (
    <>
      <Suspense fallback={null}>
        <ServicesAnchor />
      </Suspense>

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
          <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-secondary-300">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Courier &amp; Logistics
                </span>
              </Reveal>
              <Reveal delay={90}>
                <h1 className="text-hero mt-6 max-w-2xl">
                  Delivery services engineered for <span className="text-secondary">speed.</span>
                </h1>
              </Reveal>
              <Reveal delay={170}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
                  Same-day, next-day, international and e-commerce fulfilment — tracked live from
                  pickup to doorstep across the Netherlands and the UK.
                </p>
              </Reveal>
              <Reveal delay={250}>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <Link
                    href="/quote"
                    className="group inline-flex w-fit items-center gap-3 rounded-full bg-secondary py-1.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    Get a quote
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                    </span>
                  </Link>
                  <Link
                    href="/track"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 active:scale-[0.98]"
                  >
                    <MapPin className="h-4 w-4 text-secondary-300" strokeWidth={1.75} aria-hidden="true" />
                    Track a shipment
                  </Link>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={220}>
                <LiveShipmentCard />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Services bento */}
      <section id="services-grid" className="scroll-mt-24 bg-white py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="What we deliver"
              title="Six services. One seamless network."
              description="Every shipment moves on the same tracked infrastructure, whether it is a single parcel or a pallet across borders."
            />
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            {services.map((service, index) => (
              <Reveal key={service.type} delay={(index % 3) * 90} className={service.span}>
                <ServiceCard service={service} index={index} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Specialized */}
      <section className="bg-muted/40 py-24 sm:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionHeading
                  align="left"
                  eyebrow="Specialized"
                  title="Built for the edge cases"
                  description="Fragile, cold-chain, insured or bulk — we handle the consignments that need extra care, with the same live visibility."
                />
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3">
                {specialized.map((item, index) => (
                  <Reveal key={item.type} delay={index * 60}>
                    <SpecializedCard item={item} />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats band */}
      <section className="relative overflow-hidden bg-primary-950 py-24 text-white sm:py-32">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/coveragebg.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/80 to-primary-950/90" />
        </div>
        <Container className="relative">
          <div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 80} className="text-center">
                <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm text-white/60">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Tiers */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Choose your speed"
              title="Delivery tiers that scale with you"
              description="From urgent single parcels to scheduled freight — pick a level of service, and we handle the rest."
            />
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

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary-950 py-28 text-white sm:py-36">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/coveragebg.png"
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
              Ready to ship <span className="text-secondary">faster?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
              Get a quote in under two minutes. No account, no paperwork — just a courier at your door.
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
