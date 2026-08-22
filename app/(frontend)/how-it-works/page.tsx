import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package, MapPin, Truck, ShieldCheck, Zap, Map, Globe, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "How It Works | Send Clouding",
  description: "Learn how Send Clouding makes shipping simple: enter details, schedule pickup, track in real-time, and get proof of delivery. Four steps to delivered.",
  openGraph: {
    title: "How It Works | Send Clouding",
    description: "Simple logistics: Ship → Track → Deliver. Real-time tracking, instant quotes, nationwide coverage.",
    type: "website",
  },
};

const steps = [
  {
    step: "01",
    icon: Package,
    title: "Enter Details & Get Quote",
    description: "Tell us pickup and delivery locations, package weight & dimensions, and preferred speed. Get an instant, transparent price with no hidden fees. Choose from Express, Same-Day, Standard, or Economy service.",
    highlights: ["Instant pricing", "No account needed", "All service levels compared"],
  },
  {
    step: "02",
    icon: MapPin,
    title: "Schedule Pickup",
    description: "Pick a convenient 2-hour pickup window (8AM-12PM, 12PM-4PM, 4PM-7PM). Our driver arrives, scans your package, and you instantly receive a tracking link via SMS and WhatsApp. Same-day pickup available in major metros if booked before 11 AM.",
    highlights: ["2-hour windows", "Driver calls 30 min before", "Instant tracking link"],
  },
  {
    step: "03",
    icon: Map,
    title: "Track in Real-Time",
    description: "Watch your shipment move on the live map. See every scan: pickup, hub departure, in-transit, out for delivery. Get SMS/WhatsApp notifications at each milestone. Predictive ETA updates dynamically based on live traffic and route conditions.",
    highlights: ["Live GPS map", "Milestone notifications", "Predictive ETA"],
  },
  {
    step: "04",
    icon: ShieldCheck,
    title: "Delivered & Confirmed",
    description: "Driver calls recipient before arrival. Digital signature capture, photo of delivered package, and GPS coordinates recorded. Proof of Delivery (POD) available instantly in your tracking and account. Free €150 insurance on every shipment.",
    highlights: ["Digital signature + photo", "GPS proof of delivery", "€150 free coverage"],
  },
];

const features = [
  { icon: Zap, title: "Instant Quotes", description: "No back-and-forth. Enter details, see price, book in 60 seconds." },
  { icon: Globe, title: "European Coverage", description: "500+ cities, Netherlands & UK, 30+ sorting hubs." },
  { icon: MapPin, title: "Live Tracking", description: "GPS location, milestone history, predictive ETA — all in one view." },
  { icon: ShieldCheck, title: "Secure Delivery", description: "Digital signature, photo POD, GPS coords, €150 free insurance." },
  { icon: CheckCircle2, title: "Business Ready", description: "API, volume discounts, monthly invoicing, analytics dashboard." },
  { icon: Truck, title: "Flexible Pickup", description: "2-hour windows, same-day option, driver calls before arrival." },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[440px] items-center overflow-hidden bg-primary sm:min-h-[520px]">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/coveragebg.png"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-30"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-800 to-primary-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,transparent_70%)]" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="animate-fade-up [animation-fill-mode:forwards] motion-reduce:animate-none">
            <Breadcrumbs items={[{ label: "How It Works" }]} className="[&_*]:!text-white/70" />
          </div>
          <h1 className="text-page-title mt-6 max-w-3xl text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] sm:text-hero">
            Four steps to <span className="text-secondary">delivered</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl">
            No complex logistics. No hidden fees. Just enter details, schedule pickup, track live, and confirm delivery.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-secondary text-white hover:bg-secondary-600" asChild>
              <Link href="/ship">Ship a Package <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/quote">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Process Workflow Section */}
      <Section background="white" spacing="lg" pattern="route">
        <Container>
          <div className="flex flex-col gap-20 lg:gap-28">
            {steps.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.step}
                  className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16"
                >
                  {/* Left Column / Content Side */}
                  <Reveal className={cn(isEven ? "" : "lg:order-2")}>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-extrabold tracking-tight text-secondary/30">
                        {item.step}
                      </span>
                      <Chip variant="default" className="text-xs uppercase tracking-widest">
                        Step {item.step}
                      </Chip>
                    </div>

                    <h2 className="text-section-heading mt-4 text-foreground">
                      {item.title}
                    </h2>
                    <p className="text-body mt-5 text-lg leading-relaxed">
                      {item.description}
                    </p>
                    <ul className="mt-6 space-y-3">
                      {item.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                          <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" aria-hidden="true" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  {/* Right Column / Visual Side */}
                  <Reveal delay={120} className={cn(isEven ? "lg:order-2" : "lg:order-1")}>
                    <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-secondary-50/50 via-white to-accent-50/50" />
                      <div className="relative h-full w-full flex items-center justify-center p-8">
                        <div className="text-center">
                          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-white/50">
                            <item.icon className="h-12 w-12 text-secondary" aria-hidden="true" />
                          </div>
                          <div className="space-y-3 text-sm font-medium text-foreground">
                            {index === 0 && (
                              <>
                                <span className="flex items-center justify-center gap-2 rounded-full bg-secondary-50 px-4 py-2 text-secondary">
                                  <Package className="h-4 w-4" aria-hidden="true" />
                                  Enter Details
                                </span>
                                <span className="text-muted-foreground">→</span>
                                <span className="flex items-center justify-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sky-700">
                                  <Zap className="h-4 w-4" aria-hidden="true" />
                                  Instant Quote
                                </span>
                              </>
                            )}
                            {index === 1 && (
                              <>
                                <span className="flex items-center justify-center gap-2 rounded-full bg-secondary-50 px-4 py-2 text-secondary">
                                  <MapPin className="h-4 w-4" aria-hidden="true" />
                                  Schedule
                                </span>
                                <span className="text-muted-foreground">→</span>
                                <span className="flex items-center justify-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sky-700">
                                  <Truck className="h-4 w-4" aria-hidden="true" />
                                  Driver Arrives
                                </span>
                                <span className="text-muted-foreground">→</span>
                                <span className="flex items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-emerald-700">
                                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                  Tracking Link
                                </span>
                              </>
                            )}
                            {index === 2 && (
                              <>
                                <span className="flex items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-emerald-700">
                                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                                  Picked Up
                                </span>
                                <span className="text-muted-foreground">→</span>
                                <span className="flex items-center justify-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sky-700">
                                  <Truck className="h-4 w-4" aria-hidden="true" />
                                  In Transit
                                </span>
                                <span className="text-muted-foreground">→</span>
                                <span className="flex items-center justify-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-orange-700">
                                  <MapPin className="h-4 w-4" aria-hidden="true" />
                                  Out for Delivery
                                </span>
                              </>
                            )}
                            {index === 3 && (
                              <>
                                <span className="flex items-center justify-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-orange-700">
                                  <MapPin className="h-4 w-4" aria-hidden="true" />
                                  Out for Delivery
                                </span>
                                <span className="text-muted-foreground">→</span>
                                <span className="flex items-center justify-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-emerald-700">
                                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                                  Delivered
                                </span>
                                <span className="text-muted-foreground">→</span>
                                <span className="flex items-center justify-center gap-2 rounded-full bg-secondary-50 px-4 py-2 text-secondary">
                                  <Package className="h-4 w-4" aria-hidden="true" />
                                  POD Received
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Key Features */}
      <Section background="muted" spacing="lg" pattern="dots">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-section-heading text-foreground">Why choose Send Clouding?</h2>
              <p className="text-body mt-4 text-muted-foreground">Built for modern logistics — technology, network, and care in every delivery.</p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Reveal key={feature.title} delay={index * 70}>
                  <div className="card-premium text-center p-6">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <feature.icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    <h3 className="text-card-title text-foreground">{feature.title}</h3>
                    <p className="text-body mt-2">{feature.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* CTA */}
      <Section background="primary" spacing="lg" pattern="band" className="text-white">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-page-title text-white">Ready to ship smarter?</h2>
            <p className="text-body mt-4 text-white/80">Join thousands of Europeans who trust Send Clouding for fast, reliable, and transparent delivery.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-secondary text-white hover:bg-secondary-600 w-full sm:w-auto" asChild>
                <Link href="/ship">Start Shipping <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto" asChild>
                <Link href="/quote">Get a Quote</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}