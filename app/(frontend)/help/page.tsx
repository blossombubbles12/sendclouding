import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Search,
  Rocket,
  Truck,
  MapPin,
  CreditCard,
  RefreshCw,
  User,
  MessageCircle,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Help Center | Send Clouding",
  description:
    "Guides and answers for shipping, tracking, billing and returns with Send Clouding. Find help fast or talk to our support team.",
  openGraph: {
    title: "Help Center | Send Clouding",
    description: "Everything you need to ship with confidence.",
    type: "website",
  },
};

interface HelpCategory {
  icon: LucideIcon;
  title: string;
  description: string;
  links: { label: string; href: string }[];
}

const categories: HelpCategory[] = [
  {
    icon: Rocket,
    title: "Getting Started",
    description: "Create an account, book your first shipment and set up a business profile.",
    links: [
      { label: "Create your account", href: "/auth/register" },
      { label: "Book your first shipment", href: "/ship" },
      { label: "Set up a business account", href: "/contact" },
    ],
  },
  {
    icon: Truck,
    title: "Shipping & Delivery",
    description: "Pickup windows, packaging, delivery speeds and everything in between.",
    links: [
      { label: "Delivery services overview", href: "/services" },
      { label: "Packing your parcel", href: "/guide" },
      { label: "Delivery speeds & pricing", href: "/pricing" },
    ],
  },
  {
    icon: MapPin,
    title: "Tracking",
    description: "Follow your shipment live, update recipients and understand statuses.",
    links: [
      { label: "Track a shipment", href: "/track" },
      { label: "Tracking status meanings", href: "/help" },
      { label: "Delivery notifications", href: "/help" },
    ],
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    description: "Prepaid, invoicing, volume pricing and payment methods for business accounts.",
    links: [
      { label: "Payment methods", href: "/pricing" },
      { label: "Volume pricing", href: "/pricing" },
      { label: "Invoices for business", href: "/help" },
    ],
  },
  {
    icon: RefreshCw,
    title: "Returns",
    description: "Return labels, inspection and the reverse logistics flow for e-commerce.",
    links: [
      { label: "Returns service", href: "/services/returns-logistics" },
      { label: "Generate a return label", href: "/help" },
      { label: "Restock or disposal", href: "/help" },
    ],
  },
  {
    icon: User,
    title: "Account & Security",
    description: "Manage your profile, addresses, preferences and account security.",
    links: [
      { label: "Manage your account", href: "/account" },
      { label: "Password & security", href: "/account/settings" },
    ],
  },
];

const popularTopics = [
  "How long does same-day delivery take?",
  "What happens if my parcel is damaged?",
  "How do I track multiple shipments?",
  "Can I change the delivery address?",
  "What items can't be shipped?",
  "How do I get a business account?",
];

export default function HelpPage() {
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
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-secondary-300">
                <HelpCircle className="h-3 w-3" aria-hidden="true" />
                Help Center
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-hero mt-6">How can we help?</h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
                Guides, answers and a support team that responds in minutes.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mx-auto mt-10 max-w-xl">
                <div className="group flex items-center gap-3 rounded-full border border-white/15 bg-white/10 p-1.5 pl-5 backdrop-blur-xl transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] focus-within:border-secondary/60">
                  <Search className="h-4 w-4 text-white/50" strokeWidth={1.75} aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Search for answers…"
                    aria-label="Search help articles"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97]"
                  >
                    Search
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                Browse by topic
              </span>
              <h2 className="text-section-heading mt-5 text-foreground">What do you need help with?</h2>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Reveal key={category.title} delay={(index % 3) * 80}>
                  <div className="group h-full rounded-[1.75rem] bg-gradient-to-b from-primary-100/80 via-primary-50/40 to-primary-100/50 p-1.5 ring-1 ring-primary-200/60 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                    <div className="flex h-full flex-col rounded-[calc(1.75rem-0.75rem)] bg-white p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-950 text-secondary shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <h3 className="text-card-title mt-5 font-semibold text-foreground">{category.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{category.description}</p>
                      <ul className="mt-5 space-y-1 border-t border-primary-100 pt-4">
                        {category.links.map((link) => (
                          <li key={link.label}>
                            <Link
                              href={link.href}
                              className="group/link flex items-center gap-1.5 rounded-lg py-1.5 text-sm font-medium text-secondary transition-colors hover:text-secondary-700"
                            >
                              {link.label}
                              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover/link:translate-x-0.5 group-hover/link:opacity-100" aria-hidden="true" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Popular topics */}
      <section className="bg-muted/40 py-24 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                  Popular topics
                </span>
                <h2 className="text-section-heading mt-5 text-foreground">Asked most often</h2>
                <p className="mt-4 text-body">
                  Quick answers to the questions our support team gets every day.
                </p>
                <Link
                  href="/faq"
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-primary-950 py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.97]"
                >
                  View full FAQ
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </span>
                </Link>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <div className="space-y-3">
                {popularTopics.map((topic, index) => (
                  <Reveal key={topic} delay={index * 50}>
                    <Link
                      href="/faq"
                      className="group flex items-center justify-between gap-4 rounded-2xl bg-white p-1.5 ring-1 ring-primary-200/60 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
                    >
                      <span className="flex items-center gap-3 rounded-[calc(1.5rem-0.5rem)] px-4 py-3 text-sm font-medium text-foreground">
                        <HelpCircle className="h-4 w-4 shrink-0 text-secondary" strokeWidth={1.75} aria-hidden="true" />
                        {topic}
                      </span>
                      <span className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-950 text-secondary transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
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
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <h2 className="text-page-title max-w-xl">
                  Still need a <span className="text-secondary">human?</span>
                </h2>
                <p className="mt-5 max-w-lg text-lg text-white/70">
                  Our support team answers within minutes during business hours — by chat, phone or email.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={100}>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-3 rounded-full bg-secondary py-1.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    Contact support
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <MessageCircle className="h-5 w-5" strokeWidth={2} />
                    </span>
                  </Link>
                  <Link
                    href="/claims"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 active:scale-[0.98]"
                  >
                    File a claim
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}