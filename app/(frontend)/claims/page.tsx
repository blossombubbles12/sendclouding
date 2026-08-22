import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  ShieldX,
  PackageX,
  Timer,
  Check,
  FileText,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Claims | Send Clouding",
  description:
    "File a claim for a damaged, lost or delayed shipment with Send Clouding. Find out what's covered, the limits and how to get reimbursed.",
  openGraph: {
    title: "Claims | Send Clouding",
    description: "Damaged, lost or delayed — here's how claims work.",
    type: "website",
  },
};

interface ClaimType {
  icon: LucideIcon;
  title: string;
  description: string;
  window: string;
}

const claimTypes: ClaimType[] = [
  {
    icon: ShieldX,
    title: "Damaged",
    description: "Your parcel arrived damaged or with contents broken in transit.",
    window: "Report within 48 hours of delivery",
  },
  {
    icon: PackageX,
    title: "Lost",
    description: "Your shipment is marked delivered but never arrived, or has been lost in transit.",
    window: "Report from 5 days after the ETA",
  },
  {
    icon: Timer,
    title: "Delayed",
    description: "Your delivery missed its committed window on an eligible service level.",
    window: "Automatic on same-day & express tiers",
  },
];

interface CoverageItem {
  label: string;
  covered: boolean;
}

const coverage: CoverageItem[] = [
  { label: "Damage visible at delivery", covered: true },
  { label: "Parcel lost in transit", covered: true },
  { label: "Missing contents (weight-checked)", covered: true },
  { label: "Delayed delivery on same-day / express", covered: true },
  { label: "Pre-existing damage or poor packaging", covered: false },
  { label: "Prohibited or incorrectly declared items", covered: false },
  { label: "Extreme weather or force majeure", covered: false },
];

const steps = [
  { title: "Gather evidence", description: "Photos of the parcel, packaging and contents, plus your tracking number." },
  { title: "Submit the form", description: "File your claim online with the delivery details and supporting photos." },
  { title: "We investigate", description: "Our team reviews the transit data and evidence within 2 business days." },
  { title: "Get reimbursed", description: "Approved claims are refunded to the original payment method or account credit." },
];

export default function ClaimsPage() {
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
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                Claims
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-hero mt-6">
                We&apos;ve got you <span className="text-secondary">covered.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
                Every shipment includes basic protection. Here&apos;s how to file a claim if
                something goes wrong — quickly and without the runaround.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/contact"
                  className="group inline-flex w-fit items-center gap-3 rounded-full bg-secondary py-1.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  File a claim
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                  </span>
                </Link>
                <Link
                  href="/track"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 active:scale-[0.98]"
                >
                  Track your shipment
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Claim types */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                What you can claim
              </span>
              <h2 className="text-section-heading mt-5 text-foreground">Three situations, one simple process</h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {claimTypes.map((claim, index) => {
              const Icon = claim.icon;
              return (
                <Reveal key={claim.title} delay={index * 80}>
                  <div className="h-full rounded-[1.75rem] bg-gradient-to-b from-primary-100/80 via-primary-50/40 to-primary-100/50 p-1.5 ring-1 ring-primary-200/60 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                    <div className="flex h-full flex-col rounded-[calc(1.75rem-0.75rem)] bg-white p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-950 text-secondary shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <h3 className="text-card-title mt-5 font-semibold text-foreground">{claim.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{claim.description}</p>
                      <p className="mt-auto pt-5 text-xs font-medium text-secondary-700">
                        {claim.window}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Coverage */}
      <section className="bg-muted/40 py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                  What&apos;s covered
                </span>
                <h2 className="text-section-heading mt-5 text-foreground">Coverage at a glance</h2>
                <p className="mt-4 text-body">
                  Standard protection covers up to €100 per shipment. Add enhanced insurance for
                  higher declared values on eligible services.
                </p>
                <Link
                  href="/services/high-value"
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-primary-950 py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  High-value handling
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </span>
                </Link>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={80}>
                <div className="overflow-hidden rounded-[2rem] bg-gradient-to-b from-primary-100/70 via-primary-50/40 to-primary-100/50 p-1.5 ring-1 ring-primary-200/60">
                  <div className="rounded-[calc(2rem-0.75rem)] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                    <ul className="divide-y divide-primary-100/70">
                      {coverage.map((item) => (
                        <li key={item.label} className="flex items-center gap-4 px-6 py-4">
                          <span
                            className={
                              item.covered
                                ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                                : "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600"
                            }
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
                          </span>
                          <span className="text-sm font-medium text-foreground">{item.label}</span>
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

      {/* How to file */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                How to file
              </span>
              <h2 className="text-section-heading mt-5 text-foreground">Four steps to reimbursement</h2>
            </div>
          </Reveal>
          <ol className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 90}>
                <li className="relative h-full rounded-[1.75rem] bg-muted/60 p-1.5 ring-1 ring-primary-200/50">
                  <div className="flex h-full flex-col rounded-[calc(1.75rem-0.5rem)] bg-white p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary-50 text-secondary-700">
                      <FileText className="h-5 w-5" strokeWidth={1.5} />
                    </span>
                    <span className="mt-5 font-mono text-xs uppercase tracking-widest text-secondary">
                      Step {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-card-title mt-3 font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
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
              Something went <span className="text-secondary">wrong?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
              Start a claim and our team will resolve it within 2 business days.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-secondary py-1.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                File a claim
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <MessageCircle className="h-5 w-5" strokeWidth={2} />
                </span>
              </Link>
              <Link
                href="/help"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 active:scale-[0.98]"
              >
                Visit help center
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}