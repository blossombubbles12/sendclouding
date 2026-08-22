"use client";

import * as React from "react";
import Link from "next/link";
import { Zap, Truck, Snowflake, ShieldCheck, Globe2, ArrowRight, Package } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";

const services = [
  {
    icon: Zap,
    title: "Same-Day Delivery",
    description: "Book before 11 AM in major metros and get delivery the very same day. Perfect for urgent documents and time-critical goods.",
    href: "/ship",
  },
  {
    icon: Truck,
    title: "Express Delivery",
    description: "Priority courier for next-day delivery across the Netherlands and the UK. Live tracking with a dedicated driver.",
    href: "/shipping",
  },
  {
    icon: Package,
    title: "Standard Parcel",
    description: "Reliable 2-4 day economy shipping with full tracking, proof of delivery, and free €150 insurance on every parcel.",
    href: "/shipping",
  },
  {
    icon: Snowflake,
    title: "Cold Chain & Pharma",
    description: "Temperature-controlled transport for pharma, food, and perishables. Continuous monitoring and compliance records.",
    href: "/facilities",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Insured",
    description: "High-value items moved with tamper-evident packaging and optional insurance up to €25,000. Signature capture on delivery.",
    href: "/shipping",
  },
  {
    icon: Globe2,
    title: "Business & API",
    description: "Volume discounts, monthly invoicing, REST API, and Shopify/WooCommerce plugins. Built for e-commerce at scale.",
    href: "/coverage",
  },
];

export function Services() {
  return (
    <Section background="white" spacing="lg" pattern="dots">
      <Reveal>
        <SectionHeading
          eyebrow="Our Services"
          title="Logistics built for every need"
          description="From same-day courier drops to cold-chain pharma deliveries — choose the service that fits your shipment."
        />
      </Reveal>
      <Grid cols={3} gap="lg" className="mt-14">
        {services.map((service, index) => (
          <Reveal key={service.title} delay={index * 70}>
            <Link href={service.href} className="block h-full">
              <div className="card-premium group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
                  <service.icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="text-card-title text-foreground">{service.title}</h3>
                <p className="text-body mt-2">{service.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-secondary">
                  Learn more
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}