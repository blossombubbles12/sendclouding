"use client";

import * as React from "react";
import Image from "next/image";
import { Package, ArrowRight, Truck, MapPin, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-white">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/homectafooter.png"
          alt="Send Clouding delivery network"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark gradient overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(2,6,23,0.92) 0%, rgba(15,23,42,0.88) 40%, rgba(15,23,42,0.85) 60%, rgba(2,6,23,0.9) 100%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-32"
          style={{
            background: "linear-gradient(to top, rgba(2,6,23,0.95), transparent)",
          }}
        />
      </div>

      <Container className="relative py-20 sm:py-28 lg:py-32">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <Package className="mx-auto h-12 w-12 text-secondary mb-4" aria-hidden="true" />
            <h2 className="text-page-title text-white">Ready to ship smarter?</h2>
            <p className="text-body mt-4 text-white/80">Join thousands of businesses across the Netherlands and the UK who trust Send Clouding for fast, reliable, and transparent delivery. Your first shipment is just a few clicks away.</p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-secondary text-white hover:bg-secondary-600 w-full sm:w-auto" asChild>
                <Link href="/ship">Ship a Package <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-primary-900 border-white hover:bg-white/90 active:bg-white w-full sm:w-auto" asChild>
                <Link href="/track">Track a Shipment</Link>
              </Button>
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 w-full sm:w-auto" asChild>
                <Link href="/quote">Get a Quote</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <Truck className="mx-auto h-8 w-8 text-secondary mb-2" aria-hidden="true" />
                <p className="font-medium text-white">Instant Pickup</p>
                <p className="text-caption text-white/60">Schedule in 60 seconds</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <MapPin className="mx-auto h-8 w-8 text-accent mb-2" aria-hidden="true" />
                <p className="font-medium text-white">Live Tracking</p>
                <p className="text-caption text-white/60">Real-time GPS visibility</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <ShieldCheck className="mx-auto h-8 w-8 text-emerald-400 mb-2" aria-hidden="true" />
                <p className="font-medium text-white">Secure Delivery</p>
                <p className="text-caption text-white/60">€150 free coverage</p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}