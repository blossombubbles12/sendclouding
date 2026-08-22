import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Globe2, Truck, Building2, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { SubpageHero } from "@/components/shared/subpage-hero";
import { Reveal } from "@/components/motion/reveal";
import { CoverageChecker } from "@/components/coverage/coverage-checker";

export const metadata: Metadata = {
  title: "Coverage | Send Clouding",
  description: "Check Send Clouding delivery coverage across the Netherlands and the United Kingdom. 500+ cities and towns, 30+ sorting hubs.",
  openGraph: {
    title: "Coverage | Send Clouding",
    description: "Nationwide delivery across the Netherlands and the UK. Check if we deliver to your area.",
    type: "website",
  },
};

const stats = [
  { icon: MapPin, value: "500+", label: "Cities & Towns" },
  { icon: Building2, value: "30+", label: "Sorting Hubs" },
  { icon: Truck, value: "4–8 hrs", label: "Same-Day Metro" },
  { icon: Globe2, value: "2", label: "Countries (NL & UK)" },
];

const regions = [
  {
    name: "Amsterdam Region",
    areas: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],
    color: "bg-blue-500",
  },
  {
    name: "London Region",
    areas: ["London", "Birmingham", "Leeds", "Bristol", "Manchester"],
    color: "bg-emerald-500",
  },
  {
    name: "NL Nationwide",
    areas: ["North Holland", "South Holland", "Utrecht", "North Brabant", "Flevoland", "Gelderland"],
    color: "bg-purple-500",
  },
  {
    name: "UK Nationwide",
    areas: ["Greater London", "Greater Manchester", "West Midlands", "West Yorkshire", "Merseyside", "Tyne and Wear"],
    color: "bg-orange-500",
  },
];

export default function CoveragePage() {
  return (
    <>
      <SubpageHero
        eyebrow="Coverage Map"
        title="We deliver everywhere"
        description="From the canals of Amsterdam to the city centres of Manchester and London. Check your area below."
      />

      <section className="bg-white py-16 sm:py-24">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-section-heading text-foreground">Is your city covered?</h2>
              <p className="mt-3 text-body text-muted-foreground">
                Enter your destination to see which delivery zone it belongs to and what services are available.
              </p>
              <div className="mt-8">
                <CoverageChecker />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-primary py-20 text-white sm:py-28 lg:py-32">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src="/coveragebg.png"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary-800/70 to-primary-900/85" />
        </div>
        <Container className="relative">
          <Reveal>
            <SectionHeading
              tone="dark"
              eyebrow="Our Network"
              title="The numbers behind the network"
              description="A logistics network engineered for speed, reliability, and reach."
            />
          </Reveal>
          <Grid cols={4} gap="md" className="mt-14">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 70}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
                  <stat.icon className="mx-auto mb-3 h-8 w-8 text-secondary" aria-hidden="true" />
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/70">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </Grid>
        </Container>
      </section>

      <Section background="white" spacing="lg" pattern="dots">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Regions"
              title="Where we operate"
              description="Major metro hubs and nationwide coverage across both countries."
            />
          </Reveal>
          <Grid cols={2} gap="lg" className="mt-14">
            {regions.map((region, index) => (
              <Reveal key={region.name} delay={index * 70}>
                <div className="card-premium h-full p-6 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${region.color}`}>
                      <MapPin className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                    <h3 className="text-card-title font-semibold text-foreground">{region.name}</h3>
                  </div>
                  <ul className="mt-5 space-y-2">
                    {region.areas.map((area) => (
                      <li key={area} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </Grid>
        </Container>
      </Section>
    </>
  );
}