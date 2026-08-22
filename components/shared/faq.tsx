"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, Mail } from "lucide-react";
import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

const faqs = [
  {
    q: "How fast is delivery?",
    a: "Same-day delivery is available in major metros if booked before 11 AM. Express next-day covers most of the Netherlands and the UK, and standard delivery takes 2-4 business days.",
  },
  {
    q: "How do I track my shipment?",
    a: "You'll receive a tracking link by SMS and WhatsApp the moment your package is picked up. The live map shows every scan — pickup, hub, in-transit, out for delivery, and delivered — with milestone notifications at each step.",
  },
  {
    q: "How much does shipping cost?",
    a: "Pricing is instant and transparent — enter your pickup and delivery details for a quote in seconds. There are no hidden fees. Free €150 insurance is included on every shipment, and volume discounts apply for business accounts.",
  },
  {
    q: "Which areas do you cover?",
    a: "We deliver across the Netherlands and the United Kingdom — 500+ cities and towns through 30+ sorting hubs. From the canals of Amsterdam to the centres of Manchester and London, every address is covered.",
  },
  {
    q: "What happens if my package is delayed or damaged?",
    a: "Every shipment includes free €150 insurance, and optional cover up to €25,000. If a package is damaged or delayed, we investigate immediately and resolve claims fast — proof of delivery with photo and GPS is recorded for every drop.",
  },
  {
    q: "Can businesses integrate with Send Clouding?",
    a: "Yes. We offer a REST API, webhooks, and pre-built plugins for Shopify and WooCommerce. Orders automatically create shipments, print labels, and notify customers — no manual intervention.",
  },
];

export function FAQ() {
  return (
    <Section background="white" spacing="lg" pattern="dots">
      <Reveal>
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Quick answers to the questions we hear most. Can't find what you need? Our team is one message away."
        />
      </Reveal>
      <div className="mx-auto mt-14 max-w-3xl">
        <Reveal delay={100}>
          <Accordion type="single" className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
            {faqs.map((item) => (
              <AccordionItem key={item.q} value={item.q} title={item.q}>
                {item.a}
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
        <Reveal delay={150} className="mt-8 text-center">
          <p className="text-body text-muted-foreground">
            Still have questions?{" "}
            <Link href="/contact" className="font-medium text-secondary hover:underline">
              Talk to our team
            </Link>{" "}
            or{" "}
            <a href="/faq" className="font-medium text-secondary hover:underline">
              view the full FAQ
            </a>
            .
          </p>
        </Reveal>
      </div>
    </Section>
  );
}