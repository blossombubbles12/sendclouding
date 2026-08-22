"use client";

import * as React from "react";
import { Star, Quote, ShieldCheck, MapPin, Package, Truck } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Grid } from "@/components/layout/grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";

const testimonials = [
  {
    quote: "Send Clouding transformed how we handle deliveries for our Shopify store. What used to take hours of manual work now happens automatically. Our customers love the real-time tracking.",
    author: "Adaeze Okonkwo",
    role: "Founder, Kola Fashion",
    company: "E-commerce • 2,400+ shipments/month",
    avatar: null,
    rating: 5,
  },
  {
    quote: "The same-day delivery in Amsterdam is a game-changer for our restaurant supply chain. We get fresh ingredients to three locations before lunch service every day. Reliable, tracked, and affordable.",
    author: "Chef Tunde Bakare",
    role: "Executive Chef, Kitchen Group, Amsterdam",
    company: "Food Service • 150+ deliveries/week",
    avatar: null,
    rating: 5,
  },
  {
    quote: "We needed to ship medical supplies to clinics across the Netherlands and the UK with temperature monitoring. Send Clouding's cold chain solution and dedicated support made it seamless.",
    author: "Dr. Fatima Abdullahi",
    role: "Logistics Director, MedSupply NL",
    company: "Healthcare • Nationwide cold chain",
    avatar: null,
    rating: 5,
  },
  {
    quote: "The API integration took our dev team two days. Now every order from our custom ERP automatically creates a shipment, prints labels, and notifies the customer. Zero manual intervention.",
    author: "Chinedu Eze",
    role: "CTO, BuildMart",
    company: "B2B Marketplace • API integration",
    avatar: null,
    rating: 5,
  },
  {
    quote: "As a small business, I was worried about costs. But the volume discounts kicked in fast, and the free insurance on every shipment saved us when a package was damaged. Honest pricing.",
    author: "Blessing Adebayo",
    role: "Owner, Blessing's Crafts",
    company: "Artisan • 80 shipments/month",
    avatar: null,
    rating: 5,
  },
  {
    quote: "The proof of delivery with photo and GPS coordinates gives us complete accountability. Our clients never dispute deliveries anymore. It's the professional standard we needed.",
    author: "Ibrahim Musa",
    role: "Operations Manager, LegalDocs Courier",
    company: "Legal Services • Secure documents",
    avatar: null,
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <Section background="white" spacing="lg" pattern="dots">
      <Reveal>
        <SectionHeading
          eyebrow="Trusted by 2,000+ businesses"
          title="Real results from real customers"
          description="From solo entrepreneurs to enterprise teams. See why businesses across the Netherlands and the UK trust Send Clouding with their deliveries."
        />
      </Reveal>
      <Grid cols={3} gap="lg" className="mt-14">
        {testimonials.map((testimonial, index) => (
          <Reveal key={testimonial.author} delay={index * 70}>
            <div className="card-premium h-full">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                ))}
              </div>
              <Quote className="h-8 w-8 text-secondary/30 mb-4" aria-hidden="true" />
              <blockquote className="text-body text-foreground mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="border-t border-border pt-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary font-semibold">
                    {testimonial.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-caption text-muted-foreground">{testimonial.role}</p>
                    <p className="text-caption text-secondary">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </Grid>
    </Section>
  );
}