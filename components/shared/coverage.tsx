"use client";

import * as React from "react";
import { MapPin, CheckCircle2, Truck, Clock, Map, ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const regions = [
  {
    name: "South West",
    states: ["North Holland", "South Holland", "Utrecht", "Flevoland", "Gelderland", "Limburg"],
    hubs: 12,
    coverage: "98%",
    color: "bg-blue-500",
  },
  {
    name: "South South",
    states: ["Greater London", "Greater Manchester", "West Midlands", "West Yorkshire", "City of Bristol", "Glasgow"],
    hubs: 8,
    coverage: "95%",
    color: "bg-emerald-500",
  },
  {
    name: "South East",
    states: ["North Brabant", "Zeeland", "Drenthe", "Overijssel", "Essex"],
    hubs: 6,
    coverage: "96%",
    color: "bg-purple-500",
  },
  {
    name: "North Central",
    states: ["Merseyside", "Tyne and Wear", "South Yorkshire", "East Riding", "Northumberland", "Cambridgeshire", "Norfolk"],
    hubs: 10,
    coverage: "92%",
    color: "bg-orange-500",
  },
  {
    name: "North West",
    states: ["Suffolk", "Bedfordshire", "Hertfordshire", "Kent", "Surrey", "Hampshire", "Sussex"],
    hubs: 9,
    coverage: "89%",
    color: "bg-red-500",
  },
  {
    name: "North East",
    states: ["Lancashire", "Derbyshire", "Nottinghamshire", "Lincolnshire", "Rutland", "Oxfordshire"],
    hubs: 5,
    coverage: "85%",
    color: "bg-indigo-500",
  },
];

const stats = [
  { value: "500+", label: "Cities & Towns" },
  { value: "30+", label: "Sorting Hubs" },
  { value: "500+", label: "Cities" },
  { value: "99.2%", label: "Delivery Success Rate" },
];

export function Coverage() {
  return (
    <Section background="primary" spacing="lg" pattern="band" className="text-white">
      <Reveal>
        <SectionHeading
          tone="dark"
          eyebrow="Coverage Map"
          title="We deliver everywhere"
          description="From the canals of Amsterdam to the city centres of Manchester and London. Our network spans the Netherlands and the United Kingdom with 30+ sorting hubs and 500+ delivery points."
          align="center"
        />
      </Reveal>

      {/* Stats */}
      <Reveal delay={100} className="mt-12">
        <Grid cols={4} gap="md">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-primary-300 mt-1 text-sm">{stat.label}</p>
            </div>
          ))}
        </Grid>
      </Reveal>

      {/* Regions */}
      <Reveal delay={200} className="mt-16">
        <Grid cols={3} gap="lg">
          {regions.map((region, index) => (
            <div key={region.name} className="relative rounded-2xl bg-white border-2 border-primary-200 shadow-sm p-6 hover:border-secondary-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${region.color}`}>
                  <MapPin className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-card-title font-semibold text-foreground">{region.name}</h3>
                  <p className="text-caption text-muted-foreground">{region.states.length} states</p>
                </div>
              </div>
              <ul className="space-y-1.5 mb-4">
                {region.states.map((state) => (
                  <li key={state} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-secondary flex-shrink-0" aria-hidden="true" />
                    {state}
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-caption text-muted-foreground">Hubs</p>
                  <p className="text-lg font-bold text-foreground">{region.hubs}</p>
                </div>
                <div>
                  <p className="text-caption text-muted-foreground">Coverage</p>
                  <p className="text-lg font-bold text-secondary">{region.coverage}</p>
                </div>
              </div>
            </div>
          ))}
        </Grid>
      </Reveal>

      <Reveal delay={300} className="mt-16 text-center">
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/15 p-8 sm:p-12">
          {/* Background image + dark navy gradient overlay */}
          <div className="absolute inset-0 -z-10">
            <img
              src="/coveragebg.png"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(2,6,23,0.92) 0%, rgba(15,23,42,0.82) 50%, rgba(2,6,23,0.9) 100%)",
              }}
            />
          </div>
          <Map className="mx-auto h-10 w-10 text-secondary mb-3" aria-hidden="true" />
          <h3 className="text-section-heading text-white">Need delivery to a specific location?</h3>
          <p className="text-body mt-2 text-white/80">Check if we service your area or request a custom route for remote locations.</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/coverage">Check Coverage <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10" asChild>
              <Link href="/contact">Request Custom Route</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}