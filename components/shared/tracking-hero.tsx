"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, MapPin, Clock, CheckCircle2, Package, Zap, Globe } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionBackground } from "@/components/layout/section-background";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/motion/reveal";
import { Input } from "@/components/ui/input";

const trustPoints = [
  { icon: Zap, label: "Instant Quotes" },
  { icon: MapPin, label: "Real-time Tracking" },
  { icon: ShieldCheck, label: "Secure Delivery" },
  { icon: Globe, label: "Nationwide Coverage" },
];

export function TrackingHero() {
  const [trackingNumber, setTrackingNumber] = React.useState("");

  return (
    <section className="relative isolate overflow-hidden bg-white">
      <SectionBackground variant="radial" />
      <Container className="grid grid-cols-1 items-start gap-16 py-20 sm:py-24 lg:grid-cols-2 lg:py-32">
        <Reveal>
          <Chip variant="secondary" className="mb-6">
            Europe's Modern Logistics Platform
          </Chip>
          <h1 className="text-hero text-foreground">
            Send it. <span className="text-secondary">Track it.</span> Delivered.
          </h1>
          <p className="text-body mt-6 max-w-lg text-lg">
            Simple, reliable shipping with real-time visibility. Ship packages across the Netherlands and the UK
            with instant quotes, live tracking, and guaranteed delivery.
          </p>

          {/* Tracking Input - Hero CTA */}
          <div className="mt-8 w-full max-w-full rounded-2xl border border-border bg-white/80 p-1 shadow-xl backdrop-blur-sm sm:mt-10 sm:p-1.5">
            <form
              className="flex w-full flex-col gap-3 p-3 sm:flex-row sm:p-4"
              onSubmit={(e) => {
                e.preventDefault();
                const tn = trackingNumber.trim().toUpperCase();
                if (!tn) return;
                window.location.href = `/track?tn=${encodeURIComponent(tn)}`;
              }}
            >
              <div className="relative min-w-0 flex-1">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  placeholder="SC-2026-000001"
                  className="input-tracking w-full pl-12 font-mono text-base"
                  aria-label="Tracking number"
                />
              </div>
              <Button size="lg" className="w-full shrink-0 whitespace-nowrap bg-secondary text-white hover:bg-secondary-600 sm:w-auto" type="submit">
                <Package className="h-4 w-4" aria-hidden="true" />
                Track Shipment
              </Button>
            </form>
            <p className="text-caption text-center px-4 pb-2">
              Or <Link href="/ship" className="font-medium text-secondary hover:underline">Ship a Package</Link> &nbsp;·&nbsp; <Link href="/quote" className="font-medium text-secondary hover:underline">Get a Quote</Link>
            </p>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trustPoints.map((point) => (
              <div key={point.label} className="flex items-center gap-2.5">
                <point.icon className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                <dt className="sr-only">Trust indicator</dt>
                <dd className="text-caption font-medium text-foreground">{point.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={150} className="relative">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-lg">
            {/* Main illustration */}
            <div className="hover-lift absolute inset-0 overflow-hidden rounded-[2.5rem] shadow-2xl bg-gradient-to-br from-primary-50 via-secondary-50/30 to-accent-50/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/50 backdrop-blur-sm shadow-xl ring-1 ring-white/50">
                    <Package className="h-12 w-12 text-secondary" aria-hidden="true" />
                  </div>
                  <div className="space-y-3 text-center">
                    <div className="flex items-center justify-center gap-3 text-sm font-medium text-foreground">
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        Picked Up
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-sky-700">
                        <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                        In Transit
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-sm font-medium text-foreground">
                      <span className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-orange-700">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        Out for Delivery
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Delivered
                      </span>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-secondary">2,847</p>
                      <p>Active Shipments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">99.2%</p>
                      <p>On-Time Rate</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">500+</p>
                      <p>Cities Covered</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating status badges */}
              <div className="absolute -top-4 -right-4 animate-float-subtle">
                <div className="glass rounded-2xl px-4 py-3 shadow-lg">
                  <p className="text-lg font-bold text-secondary">SC-EU-8847291</p>
                  <p className="text-caption text-muted-foreground">Out for Delivery · 2 stops away</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 animate-float-subtle" style={{ animationDelay: "2s" }}>
                <div className="glass rounded-2xl px-4 py-3 shadow-lg">
                  <p className="text-lg font-bold text-accent">Delivered</p>
                  <p className="text-caption text-muted-foreground">Amsterdam → London · 2h 14m ago</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}