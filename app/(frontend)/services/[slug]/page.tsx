import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  MapPin,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils";
import { services, getServiceBySlug, type Service } from "@/lib/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return { title: "Service not found | Send Clouding" };
  }
  return {
    title: `${service.name} | Send Clouding`,
    description: service.description,
    openGraph: {
      title: `${service.name} | Send Clouding`,
      description: service.description,
      type: "website",
    },
  };
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative h-full rounded-[1.75rem] bg-gradient-to-b from-primary-100/80 via-primary-50/40 to-primary-100/50 p-1.5 ring-1 ring-primary-200/60 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
      <div className="flex h-full flex-col rounded-[calc(1.75rem-0.75rem)] bg-white p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-950 text-secondary shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <h3 className="text-card-title mt-5 font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = service.icon;
  const related = service.related
    .map((relatedSlug) => getServiceBySlug(relatedSlug))
    .filter((item): item is Service => Boolean(item));

  const featureCards: { icon: LucideIcon; title: string; description: string }[] = [
    { icon: service.icon, title: service.name, description: service.description },
    { icon: Check, title: "Booked in minutes", description: "Online, by phone or through our API — confirm a collection in under a minute." },
    { icon: MapPin, title: "Full journey visibility", description: "Live tracking, ETA updates and notifications at every milestone from pickup to delivery." },
    { icon: Sparkles, title: "Proof of delivery", description: "Digital signature or photo confirmation captured the moment your shipment arrives." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-primary-950 text-white">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={service.heroImage}
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

        <Container className="relative py-24 sm:py-28 lg:py-36">
          <Reveal>
            <Breadcrumbs
              items={[
                { label: "Services", href: "/services" },
                { label: service.name },
              ]}
              className="[&_*]:!text-white/60"
            />
          </Reveal>
          <div className="mt-10 grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-secondary-300">
                  <Icon className="h-3 w-3" aria-hidden="true" />
                  Courier Service
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="text-hero mt-6 max-w-3xl">{service.name}</h1>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">
                  {service.tagline}
                </p>
              </Reveal>
              <Reveal delay={220}>
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

            <Reveal delay={200} className="lg:col-span-4">
              <div className="rounded-[2rem] bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur-xl">
                <div className="rounded-[calc(2rem-0.5rem)] bg-primary-950/80 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] sm:p-8">
                  <p className="text-caption uppercase tracking-wider text-white/45">From</p>
                  <p className="mt-1 font-mono text-3xl font-bold tracking-tight text-white">{service.price}</p>
                  <div className="mt-6 space-y-2.5 border-t border-white/10 pt-6">
                    {service.includes.map((item) => (
                      <p key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                        <Check className="h-4 w-4 shrink-0 text-secondary" strokeWidth={2.25} />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Overview */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                  Overview
                </span>
                <h2 className="text-section-heading mt-5 text-foreground">
                  {service.name}, without the friction.
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={90}>
                <p className="text-body max-w-3xl text-lg">{service.description}</p>
                <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 rounded-2xl bg-muted/60 px-4 py-3.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={2.25} aria-hidden="true" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="bg-muted/40 py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                How it works
              </span>
              <h2 className="text-section-heading mt-5 text-foreground">Four steps to delivered</h2>
            </div>
          </Reveal>
          <ol className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, index) => (
              <Reveal key={step.title} delay={index * 90}>
                <li className="relative h-full rounded-[1.75rem] bg-white p-1.5 ring-1 ring-primary-200/60">
                  <div className="flex h-full flex-col rounded-[calc(1.75rem-0.75rem)] bg-white p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                    <span className="font-mono text-xs uppercase tracking-widest text-secondary">
                      Step {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-card-title mt-4 font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Feature cards */}
      <section className="bg-white py-24 sm:py-32">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map((card, index) => (
              <Reveal key={card.title} delay={index * 80}>
                <FeatureCard {...card} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Related services */}
      {related.length > 0 && (
        <section className="bg-muted/40 py-24 sm:py-28">
          <Container>
            <Reveal>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full bg-secondary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-secondary-700">
                    Explore more
                  </span>
                  <h2 className="text-section-heading mt-5 text-foreground">Related services</h2>
                </div>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-secondary-700"
                >
                  All services
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {related.map((item, index) => {
                const RelatedIcon = item.icon;
                return (
                  <Reveal key={item.slug} delay={index * 80}>
                    <Link
                      href={`/services/${item.slug}`}
                      className="group block h-full rounded-[1.75rem] bg-gradient-to-b from-primary-100/80 via-primary-50/40 to-primary-100/50 p-1.5 ring-1 ring-primary-200/60 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1"
                    >
                      <div className="flex h-full flex-col rounded-[calc(1.75rem-0.75rem)] bg-white p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-950 text-secondary shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                          <RelatedIcon className="h-5 w-5" strokeWidth={1.5} />
                        </span>
                        <h3 className="text-card-title mt-5 font-semibold text-foreground">{item.name}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.tagline}</p>
                        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-secondary">
                          Explore
                          <ArrowUpRight
                            className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            aria-hidden="true"
                          />
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className={cn("relative overflow-hidden bg-primary-950 py-24 text-white sm:py-32")}>
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={service.heroImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/85 to-primary-900/80" />
        </div>
        <Container className="relative text-center">
          <Reveal>
            <h2 className="text-page-title mx-auto max-w-3xl">
              Ready for {service.name.toLowerCase()}?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
              Book in minutes or talk to our team about volume and tailored requirements.
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