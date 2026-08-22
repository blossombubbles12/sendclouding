import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  KeyRound,
  Webhook,
  Terminal,
  BellRing,
  Braces,
  Globe,
  Box,
  Zap,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "API Docs | Send Clouding",
  description:
    "Build with the Send Clouding API — create shipments, print labels, and stream live tracking events into your platform.",
  openGraph: {
    title: "API Docs | Send Clouding",
    description: "Developer documentation for the Send Clouding API.",
    type: "website",
  },
};

interface Endpoint {
  method: string;
  path: string;
  description: string;
}

const endpoints: Endpoint[] = [
  { method: "POST", path: "/v1/shipments", description: "Create a shipment and book a pickup." },
  { method: "GET", path: "/v1/shipments/:id", description: "Fetch a shipment and its current status." },
  { method: "PATCH", path: "/v1/shipments/:id", description: "Update a shipment — destination, window or service." },
  { method: "GET", path: "/v1/tracking/:trackingNumber", description: "Stream the full tracking timeline." },
  { method: "POST", path: "/v1/labels", description: "Generate a shipping label as PDF." },
  { method: "GET", path: "/v1/rates", description: "Retrieve live rates for a shipment." },
];

const steps = [
  { title: "Get an API key", description: "Create your key in the admin panel and store it securely as an environment variable." },
  { title: "Make your first request", description: "Create a test shipment against the sandbox and confirm it returns a tracking number." },
  { title: "Print a label", description: "Generate a label for your shipment and print it from our API response." },
  { title: "Listen for updates", description: "Subscribe to webhooks and receive live status events as your shipment moves." },
];

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-primary-950 p-1.5 ring-1 ring-white/10">
      <div className="flex items-center justify-between rounded-[calc(1.5rem-0.75rem)] bg-primary-950 px-5 py-3">
        <span className="text-xs font-medium uppercase tracking-wider text-white/40">{title}</span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-secondary/60" />
          <span className="h-2 w-2 rounded-full bg-accent/60" />
          <span className="h-2 w-2 rounded-full bg-highlight/60" />
        </span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-emerald-200/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function DocsPage() {
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
        <div aria-hidden="true" className="absolute -right-32 top-1/3 h-[26rem] w-[26rem] rounded-full bg-emerald-500/15 blur-[130px]" />

        <Container className="relative py-24 sm:py-32 lg:py-36">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-secondary-300">
                <Braces className="h-3 w-3" aria-hidden="true" />
                Developer API
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="text-hero mt-6">
                Logistics, <span className="text-secondary">as code.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">
                Create shipments, print labels and stream live tracking events into your platform
                with a clean, predictable REST API.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/services/api-integration"
                  className="group inline-flex w-fit items-center gap-3 rounded-full bg-secondary py-1.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Get API access
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 active:scale-[0.98]"
                >
                  Talk to an engineer
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Quickstart */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                  Quickstart
                </span>
                <h2 className="text-section-heading mt-5 text-foreground">Up and running in minutes</h2>
                <p className="mt-4 text-body">
                  One key, one request, one live shipment. Here&apos;s the whole flow.
                </p>
                <div className="mt-8 space-y-3">
                  {steps.map((step, index) => (
                    <div key={step.title} className="flex gap-4 rounded-2xl bg-muted/60 p-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-950 font-mono text-xs font-bold text-secondary">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{step.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="space-y-6 lg:col-span-7">
              <Reveal delay={80}>
                <CodeBlock
                  title="Create a shipment"
                  code={`curl -X POST https://api.sendclouding.com/v1/shipments \\\n  -H "Authorization: Bearer $SC_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "service": "same-day",\n    "pickup": { "postcode": "1012AB", "window": "13:00-15:00" },\n    "destination": { "postcode": "SW1A1AA", "name": "Acme Ltd" },\n    "package": { "weight": 2.5, "fragile": true }\n  }'`}
                />
              </Reveal>
              <Reveal delay={160}>
                <CodeBlock
                  title="Generate a label"
                  code={`curl -X POST https://api.sendclouding.com/v1/labels \\\n  -H "Authorization: Bearer $SC_API_KEY" \\\n  -d '{ "shipmentId": "SC-2026-004812", "format": "pdf" }' \\\n  --output label.pdf`}
                />
              </Reveal>
              <Reveal delay={240}>
                <CodeBlock
                  title="Tracking webhook payload"
                  code={`{\n  "event": "tracking.updated",\n  "shipmentId": "SC-2026-004812",\n  "status": "out-for-delivery",\n  "location": "London, UK",\n  "timestamp": "2026-08-22T16:40:00Z"\n}`}
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Endpoints */}
      <section className="bg-muted/40 py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                Endpoints
              </span>
              <h2 className="text-section-heading mt-5 text-foreground">Everything you need</h2>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-[2rem] bg-gradient-to-b from-primary-100/70 via-primary-50/40 to-primary-100/50 p-1.5 ring-1 ring-primary-200/60">
              <div className="rounded-[calc(2rem-0.75rem)] bg-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                <ul className="divide-y divide-primary-100/70">
                  {endpoints.map((endpoint) => (
                    <li key={endpoint.method + endpoint.path} className="flex flex-col gap-2 px-6 py-5 sm:flex-row sm:items-center sm:gap-5">
                      <span
                        className={
                          endpoint.method === "POST"
                            ? "inline-flex w-16 shrink-0 items-center justify-center rounded-full bg-secondary-50 px-2 py-1 font-mono text-xs font-bold text-secondary-700"
                            : endpoint.method === "GET"
                              ? "inline-flex w-16 shrink-0 items-center justify-center rounded-full bg-emerald-50 px-2 py-1 font-mono text-xs font-bold text-emerald-700"
                              : "inline-flex w-16 shrink-0 items-center justify-center rounded-full bg-amber-50 px-2 py-1 font-mono text-xs font-bold text-amber-700"
                        }
                      >
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-sm font-semibold text-foreground">{endpoint.path}</code>
                      <span className="text-sm text-muted-foreground sm:ml-auto">{endpoint.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Features */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: KeyRound, title: "Secure & scoped", description: "API keys with per-service scopes and rotation controls." },
              { icon: Webhook, title: "Real-time webhooks", description: "Signed events delivered to your endpoint within seconds." },
              { icon: BellRing, title: "Notifications built-in", description: "SMS, email and WhatsApp alerts for your customers." },
              { icon: Terminal, title: "SDKs & samples", description: "TypeScript, Python and cURL examples to copy and go." },
              { icon: Box, title: "Label & manifest", description: "ZPL and PDF labels with automated manifesting." },
              { icon: Globe, title: "Multi-region", description: "One API across the Netherlands and the UK." },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={(index % 3) * 80}>
                  <div className="h-full rounded-[1.75rem] bg-gradient-to-b from-primary-100/80 via-primary-50/40 to-primary-100/50 p-1.5 ring-1 ring-primary-200/60 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                    <div className="flex h-full flex-col rounded-[calc(1.75rem-0.75rem)] bg-white p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-950 text-secondary shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </span>
                      <h3 className="text-card-title mt-5 font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
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
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-secondary-300">
              <Zap className="h-3 w-3" aria-hidden="true" />
              Start building
            </span>
            <h2 className="text-page-title mx-auto mt-6 max-w-2xl">
              Put shipping on <span className="text-secondary">autopilot.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
              Get API access, a sandbox key and developer support — no minimums.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/services/api-integration"
                className="group inline-flex items-center gap-3 rounded-full bg-secondary py-1.5 pl-6 pr-1.5 text-base font-semibold text-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Request access
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
                </span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-base font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/10 active:scale-[0.98]"
              >
                Talk to an engineer
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}