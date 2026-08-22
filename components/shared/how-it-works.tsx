"use client";

import * as React from "react";
import { Package, MapPin, Map, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";

const steps = [
  {
    icon: Package,
    step: "01",
    title: "Enter Details & Get Quote",
    description: "Tell us pickup and delivery locations, package weight and speed. Get an instant, transparent price with no hidden fees.",
  },
  {
    icon: MapPin,
    step: "02",
    title: "Schedule Pickup",
    description: "Pick a 2-hour pickup window. Our driver arrives, scans your package, and you instantly receive a tracking link.",
  },
  {
    icon: Map,
    step: "03",
    title: "Track in Real-Time",
    description: "Watch your shipment move on the live map with milestone notifications and a predictive ETA.",
  },
  {
    icon: ShieldCheck,
    step: "04",
    title: "Delivered & Confirmed",
    description: "Digital signature, photo proof of delivery, and GPS coordinates captured. Free €150 insurance on every shipment.",
  },
];

export function HowItWorks() {
  return (
    <Section background="muted" spacing="lg" pattern="route">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="How It Works"
            title="Four steps to delivered"
            description="No complex logistics. No hidden fees. Just enter details, schedule pickup, track live, and confirm delivery."
          />
        </Reveal>
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <Reveal key={item.step} delay={index * 70}>
              <div className="card-premium relative h-full p-6">
                <span className="absolute right-6 top-5 text-3xl font-extrabold tracking-tight text-secondary/20">
                  {item.step}
                </span>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <item.icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <h3 className="text-card-title text-foreground">{item.title}</h3>
                <p className="text-body mt-2">{item.description}</p>
                {index < steps.length - 1 && (
                  <CheckCircle2 className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-secondary/40 lg:block" aria-hidden="true" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}