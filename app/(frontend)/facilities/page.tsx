import type { Metadata } from "next";
import { Factory, ShieldCheck, MapPin, Truck, CheckCircle2, Building2, Cpu, Search, Globe } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { SubpageHero } from "@/components/shared/subpage-hero";
import { Reveal } from "@/components/motion/reveal";
import { Chip } from "@/components/ui/chip";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Network | Send Clouding",
  description: "Explore Send Clouding's logistics network: 30+ sorting hubs, 500+ delivery cities, and advanced tracking infrastructure across the Netherlands and the UK.",
  openGraph: {
    title: "Our Network | Send Clouding",
    description: "30+ sorting hubs, nationwide coverage, advanced logistics infrastructure.",
    type: "website",
  },
};

const networkFeatures = [
  {
    icon: Factory,
    title: "30+ Sorting Hubs",
    description: "Strategically located across the Netherlands and the UK. Automated sorting, climate-controlled storage, and 24/7 operations.",
    stats: ["30+ hubs across Europe", "Automated sortation", "Climate-controlled"],
  },
  {
    icon: ShieldCheck,
    title: "Quality & Security",
    description: "Every hub follows strict protocols: CCTV, access control, temperature monitoring, and trained handlers for fragile/secure shipments.",
    stats: ["CCTV monitoring", "Access control", "Temp monitoring"],
  },
  {
    icon: Cpu,
    title: "Smart Technology",
    description: "Real-time inventory tracking, predictive routing, automated label generation, and API integration at every hub.",
    stats: ["Real-time inventory", "Predictive routing", "API integration"],
  },
  {
    icon: MapPin,
    title: "Last-Mile Network",
    description: "500+ delivery points including partner lockers, pickup stations, and door-to-door fleets reaching every corner.",
    stats: ["500+ delivery points", "Partner lockers", "Door-to-door fleet"],
  },
];

const hubHighlights = [
  { region: "London Hub", city: "London", capacity: "15,000/day", specialty: "Express & Same-Day Sorting" },
  { region: "Manchester Hub", city: "Manchester", capacity: "8,000/day", specialty: "North-West Distribution" },
  { region: "Amsterdam Hub", city: "Amsterdam", capacity: "12,000/day", specialty: "Benelux Gateway" },
  { region: "Rotterdam Hub", city: "Rotterdam", capacity: "7,000/day", specialty: "Port & Logistics Hub" },
  { region: "Birmingham Hub", city: "Birmingham", capacity: "5,000/day", specialty: "Central England Relay" },
  { region: "Glasgow Hub", city: "Glasgow", capacity: "4,000/day", specialty: "Scotland Gateway" },
];

export default function FacilitiesPage() {
  return (
    <>
      <SubpageHero
        eyebrow="Our Network"
        title="Nationwide Logistics Infrastructure"
        description="30+ sorting hubs, 500+ delivery cities, and advanced technology powering every shipment across the Netherlands and the UK."
      />

      <Section background="white" spacing="lg">
        <Reveal>
          <SectionHeading
            eyebrow="Inside Our Network"
            title="Built for speed, designed for scale"
            description="Every hub is engineered around one goal: moving packages faster, safer, and with complete visibility."
          />
        </Reveal>

        <Grid cols={2} gap="lg" className="mt-14">
          {networkFeatures.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 60} className="h-full">
              <Card className="h-full hover:border-secondary/30 transition-colors">
                <CardContent className="p-8">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                    <feature.icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="text-card-title mt-5 text-foreground">{feature.title}</h3>
                  <p className="text-body mt-2">{feature.description}</p>
                  <ul className="mt-6 space-y-2">
                    {feature.stats.map((stat, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" aria-hidden="true" />
                        {stat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Section>

      <Section background="muted" spacing="lg" pattern="route">
        <Reveal>
          <SectionHeading
            eyebrow="Key Hubs"
            title="Major sorting centers"
            description="Our largest hubs process thousands of packages daily with automated sortation and real-time tracking."
          />
        </Reveal>
        <Grid cols={3} gap="lg" className="mt-10">
          {hubHighlights.map((hub, index) => (
            <Reveal key={hub.region} delay={index * 60}>
              <Card className="hover:border-secondary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <Building2 className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      {hub.capacity}
                    </span>
                  </div>
                  <h3 className="text-card-title text-foreground">{hub.region}</h3>
                  <p className="text-caption text-muted-foreground mb-2">{hub.city}</p>
                  <p className="text-sm font-medium text-secondary mb-4">{hub.specialty}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    <span>Hub tours available by appointment</span>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </Grid>
      </Section>

      <Section background="primary" spacing="lg" pattern="band" className="text-white">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-section-heading text-white">Want to see our operations?</h2>
            <p className="text-body mt-4 text-white/80">Schedule a visit to our Amsterdam or London hub, or take a virtual tour of our sorting technology.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-secondary text-white hover:bg-secondary-600 w-full sm:w-auto" asChild>
                <Link href="/contact">Schedule Hub Visit <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto" asChild>
                <Link href="/docs">API & Technology</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}