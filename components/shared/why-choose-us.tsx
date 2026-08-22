"use client";

import * as React from "react";
import { ShieldCheck, Zap, MapPin, Smartphone, Headphones, BarChart3, Globe, Lock, ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const reasons = [
  {
    icon: ShieldCheck,
    title: "End-to-End Visibility",
    description: "Real-time GPS tracking from pickup to delivery. Every scan, every stop, every minute — visible on your dashboard.",
  },
  {
    icon: Zap,
    title: "Instant Quotes & Booking",
    description: "No back-and-forth emails. Enter details, get price, book pickup in 60 seconds. Transparent pricing, no hidden fees.",
  },
  {
    icon: MapPin,
    title: "Nationwide Network",
    description: "500+ cities and towns covered. From Amsterdam to London, Manchester to Utrecht — we reach everywhere.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Experience",
    description: "Track, book, and manage shipments from your phone. SMS/WhatsApp notifications for every milestone.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description: "Human support via phone, chat, and email. Business accounts get a dedicated account manager.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Delivery performance reports, cost analytics, and shipping patterns. Make data-driven logistics decisions.",
  },
  {
    icon: Globe,
    title: "API & Integrations",
    description: "REST API, webhooks, and pre-built plugins for Shopify, WooCommerce, and custom ERPs.",
  },
  {
    icon: Lock,
    title: "Secure & Insured",
    description: "€150 free coverage on every shipment. Optional insurance up to €25,000. Tamper-evident packaging available.",
  },
];

export function WhyChooseUs() {
  return (
    <Section background="white" spacing="lg" pattern="dots">
      <Reveal>
        <SectionHeading
          eyebrow="Why Send Clouding"
          title="Built for modern logistics"
          description="We combine technology, network, and service to give you shipping that just works. No surprises, no excuses."
        />
      </Reveal>
      <Grid cols={4} gap="lg" className="mt-14">
        {reasons.map((reason, index) => (
          <Reveal key={reason.title} delay={index * 70} className="text-center sm:text-left">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary sm:mx-0">
              <reason.icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h3 className="text-card-title mt-5 text-foreground">{reason.title}</h3>
            <p className="text-body mt-2">{reason.description}</p>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}