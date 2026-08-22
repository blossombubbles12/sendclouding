import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Package,
  CalendarClock,
  Printer,
  MapPin,
  BadgeCheck,
  Boxes,
  Ban,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Shipping Guide | Send Clouding",
  description:
    "Everything you need to ship with Send Clouding — booking, packaging, labels, tracking and what you can and can't send.",
  openGraph: {
    title: "Shipping Guide | Send Clouding",
    description: "How to ship a package, step by step.",
    type: "website",
  },
};

interface GuideStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: GuideStep[] = [
  {
    icon: Package,
    title: "Prepare your parcel",
    description: "Use a sturdy box, cushion fragile items and seal every seam with quality tape.",
  },
  {
    icon: CalendarClock,
    title: "Book a pickup",
    description: "Choose your service and pickup window. A courier collects from your door.",
  },
  {
    icon: Printer,
    title: "Print your label",
    description: "Generate and print the label instantly — or let the courier bring one.",
  },
  {
    icon: MapPin,
    title: "Track live",
    description: "Follow the journey with GPS, ETA updates and notifications at every stop.",
  },
  {
    icon: BadgeCheck,
    title: "Delivered & confirmed",
    description: "Signature or photo proof of delivery, captured the moment it lands.",
  },
];

const packagingTips = [
  "Use a double-wall box for anything over 5kg",
  "Wrap fragile items individually with 5cm of cushioning",
  "Leave no empty space — fill gaps with packing material",
  "Seal all seams with 48mm-wide packing tape",
  "Remove old labels and barcodes from reused boxes",
  "Write 'Fragile' and 'This way up' on the outside if needed",
];

interface ProhibitedItem {
  name: string;
  note: string;
}

const prohibited: ProhibitedItem[] = [
  { name: "Flammables & aerosols", note: "Sprays, solvents, lighter fluid" },
  { name: "Weapons & ammunition", note: "Including replicas and parts" },
  { name: "Illegal substances", note: "Drugs and unlicensed medicines" },
  { name: "Lithium batteries", note: "Restricted — small cells in devices only" },
  { name: "Perishable food", note: "Unless booked as cold chain" },
  { name: "Cash & precious metals", note: "Use our high-value service instead" },
];

export default function GuidePage() {
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
        <div aria-hidden="true" className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-secondary/20 blur-[130px]" />

        <Container className="relative py-24 sm:py-32 lg:py-36">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-secondary-300">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Shipping Guide
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-hero mt-6">
                Ship like a <span className="text-secondary">pro.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
                A practical, no-nonsense guide to getting your parcel ready, booked and delivered.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/ship"
                  className="group inline-flex w-fit items-center gap-3 rounded-full bg-secondary py-1.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Ship a package
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* How to ship */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                Step by step
              </span>
              <h2 className="text-section-heading mt-5 text-foreground">How to ship a package</h2>
            </div>
          </Reveal>
          <ol className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title} delay={index * 80}>
                  <li className="h-full rounded-[1.75rem] bg-gradient-to-b from-primary-100/80 via-primary-50/40 to-primary-100/50 p-1.5 ring-1 ring-primary-200/60 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                    <div className="flex h-full flex-col rounded-[calc(1.75rem-0.75rem)] bg-white p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                      <div className="flex items-center justify-between">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-950 text-secondary shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                          <Icon className="h-5 w-5" strokeWidth={1.5} />
                        </span>
                        <span className="font-mono text-[11px] uppercase tracking-widest text-primary-300">
                          Step {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="text-card-title mt-5 font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </Container>
      </section>

      {/* Packaging */}
      <section className="bg-muted/40 py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                  Packaging
                </span>
                <h2 className="text-section-heading mt-5 text-foreground">Pack it right, first time</h2>
                <p className="mt-4 text-body">
                  Good packaging is the cheapest insurance you can buy. Follow these rules and your
                  parcel will survive the journey.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-primary-100/70 via-primary-50/40 to-primary-100/50 p-1.5 ring-1 ring-primary-200/60">
                  <div className="rounded-[calc(2rem-0.75rem)] bg-white p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                    <div className="flex items-center gap-3">
                      <Boxes className="h-6 w-6 text-secondary" strokeWidth={1.5} aria-hidden="true" />
                      <h3 className="text-card-title font-semibold text-foreground">Packaging checklist</h3>
                    </div>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {packagingTips.map((tip) => (
                        <li key={tip} className="flex items-start gap-3 rounded-xl bg-muted/60 px-4 py-3">
                          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={2} aria-hidden="true" />
                          <span className="text-sm text-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Prohibited items */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                Good to know
              </span>
              <h2 className="text-section-heading mt-5 text-foreground">What you can&apos;t send</h2>
              <p className="mt-4 text-body">
                These items can&apos;t travel on standard services. Some can be shipped on specialist
                services — reach out if you&apos;re unsure.
              </p>
            </div>
          </Reveal>
          <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {prohibited.map((item, index) => (
              <Reveal key={item.name} delay={(index % 3) * 70}>
                <div className="h-full rounded-[1.5rem] bg-muted/60 p-1.5 ring-1 ring-primary-200/50">
                  <div className="flex h-full flex-col rounded-[calc(1.5rem-0.5rem)] bg-white p-5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <Ban className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <h3 className="text-card-title font-semibold text-foreground">{item.name}</h3>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{item.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-primary-950 py-24 text-white sm:py-32">
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
        <Container className="relative text-center">
          <Reveal>
            <h2 className="text-page-title mx-auto max-w-2xl">
              Ready to send <span className="text-secondary">your first parcel?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
              Book a pickup in under a minute — no account, no paperwork.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/ship"
                className="group inline-flex items-center gap-3 rounded-full bg-secondary py-1.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Ship a package
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                </span>
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}