"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Store, Truck, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

const solutions = [
  {
    icon: ShoppingBag,
    title: "E-commerce & Dropshipping",
    description: "Automate order fulfilment with Shopify, WooCommerce, and custom API integrations. Labels, tracking, and customer notifications — all automatic.",
    points: ["2,400+ shipments/month", "Automatic label generation", "Branded tracking pages"],
  },
  {
    icon: Truck,
    title: "Same-Day Logistics",
    description: "Restaurants, florists, and retailers delivering on-demand. Real-time dispatch and live driver tracking for time-critical orders.",
    points: ["Book before 11 AM", "2-hour delivery windows", "Live driver map"],
  },
  {
    icon: Building2,
    title: "Enterprise & B2B",
    description: "Dedicated account manager, monthly invoicing, and custom SLAs. Cold chain, secure documents, and high-value freight for large teams.",
    points: ["Dedicated account manager", "Custom SLAs", "Volume discounts"],
  },
  {
    icon: Store,
    title: "Retail & Click-and-Collect",
    description: "Deliver from your stores or enable pickup points across 500+ cities. Consistent pricing and professional packaging on every order.",
    points: ["Store-to-door delivery", "Pickup point network", "Professional packaging"],
  },
];

export function BusinessSolutions() {
  return (
    <Section background="muted" spacing="lg" pattern="dots">
      <Reveal>
          <SectionHeading
            eyebrow="Business Solutions"
            title="Built for businesses of every size"
            description="From solo sellers to enterprise logistics teams — tools that scale with your operation, not against it."
          />
        </Reveal>
        <Grid cols={2} gap="lg" className="mt-14">
          {solutions.map((solution, index) => (
            <Reveal key={solution.title} delay={index * 70}>
              <div className="card-premium h-full p-6 sm:p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <solution.icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="text-card-title text-foreground">{solution.title}</h3>
                <p className="text-body mt-2">{solution.description}</p>
                <ul className="mt-5 space-y-2">
                  {solution.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </Grid>
        <Reveal delay={200} className="mt-12 text-center">
          <Button size="lg" asChild>
            <Link href="/quote">
              Get a Business Quote <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
    </Section>
  );
}