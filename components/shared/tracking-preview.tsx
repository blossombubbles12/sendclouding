"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Truck, MapPin, CheckCircle2, ArrowRight, Search } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stages = [
  { label: "Picked Up", status: "done", icon: CheckCircle2 },
  { label: "In Transit", status: "done", icon: Truck },
  { label: "Out for Delivery", status: "active", icon: MapPin },
  { label: "Delivered", status: "pending", icon: CheckCircle2 },
];

export function TrackingPreview() {
  const [trackingNumber, setTrackingNumber] = React.useState("");

  return (
    <section className="relative isolate overflow-hidden bg-primary text-white">
      {/* Background image + navy overlay for readability */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/about-hero.png"
          alt="Logistics operations and parcel tracking"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(2,6,23,0.94) 0%, rgba(15,23,42,0.88) 45%, rgba(15,23,42,0.72) 100%)",
          }}
        />
      </div>

      <Container className="py-20 sm:py-28 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              tone="dark"
              align="left"
              eyebrow="Live Tracking"
              title="Know where your parcel is — every step of the way"
              description="Enter your tracking number for a live status update. Every scan, every stop, every minute — visible in real time."
            />
            <form
              className="mt-8 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                const tn = trackingNumber.trim().toUpperCase();
                if (!tn) return;
                window.location.href = `/track?tn=${encodeURIComponent(tn)}`;
              }}
            >
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  placeholder="SC-2026-000001"
                  className="w-full bg-white pl-12 font-mono"
                  aria-label="Tracking number"
                />
              </div>
              <Button size="lg" className="shrink-0 bg-secondary text-white hover:bg-secondary-600" type="submit">
                Track Now
              </Button>
            </form>
          </Reveal>

          <Reveal delay={150}>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Shipment</p>
                  <p className="font-mono text-lg font-bold text-white">SC-EU-8847291</p>
                </div>
                <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-300">
                  Out for Delivery
                </span>
              </div>
              <div className="flex items-center justify-between">
                {stages.map((stage, index) => (
                  <React.Fragment key={stage.label}>
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          stage.status === "done"
                            ? "bg-emerald-500/20 text-emerald-300"
                            : stage.status === "active"
                            ? "bg-orange-500/30 text-orange-300 ring-2 ring-orange-400/50"
                            : "bg-white/10 text-white/40"
                        }`}
                      >
                        <stage.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span className="text-xs text-white/70">{stage.label}</span>
                    </div>
                    {index < stages.length - 1 && (
                      <div className="mb-6 h-px flex-1 bg-white/15" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">2,847</p>
                  <p className="text-caption text-white/60">Active Shipments</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">99.2%</p>
                  <p className="text-caption text-white/60">On-Time Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-caption text-white/60">Cities Covered</p>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link href="/track" className="inline-flex items-center gap-1 text-sm font-medium text-white/80 hover:text-white">
                Open full tracking view <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}