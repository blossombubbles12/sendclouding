"use client";

import * as React from "react";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

const faqGroups = [
  {
    category: "Shipping & Delivery",
    items: [
      {
        q: "How fast is delivery?",
        a: "Same-day delivery is available in major metros if booked before 11 AM. Express next-day covers most of the Netherlands and the UK, and standard delivery takes 2-4 business days. Your quote shows the exact expected delivery window.",
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
        q: "Can I schedule a specific pickup window?",
        a: "Yes. Choose from 2-hour windows (8AM-12PM, 12PM-4PM, 4PM-7PM). Your driver calls 30 minutes before arrival. Same-day pickup is available in major metros if booked before 11 AM.",
      },
    ],
  },
  {
    category: "Coverage & Network",
    items: [
      {
        q: "Which areas do you cover?",
        a: "We deliver across the Netherlands and the United Kingdom — 500+ cities and towns through 30+ sorting hubs. From the canals of Amsterdam to the centres of Manchester and London, every address is covered.",
      },
      {
        q: "Do you deliver to remote or rural locations?",
        a: "Yes. Our network reaches remote villages as well as major metros. Check your address on the Coverage page, or request a custom route for unusual locations.",
      },
      {
        q: "Do you offer international shipping?",
        a: "Send Clouding currently specialises in Netherlands and UK domestic delivery. For international needs, contact our team and we'll recommend the best partner solution.",
      },
    ],
  },
  {
    category: "Business & API",
    items: [
      {
        q: "Can businesses integrate with Send Clouding?",
        a: "Yes. We offer a REST API, webhooks, and pre-built plugins for Shopify and WooCommerce. Orders automatically create shipments, print labels, and notify customers — no manual intervention.",
      },
      {
        q: "Do you offer volume discounts?",
        a: "Absolutely. Business accounts get tiered volume pricing, monthly invoicing, and a dedicated account manager. The more you ship, the lower your per-parcel rate.",
      },
      {
        q: "What insurance is included?",
        a: "Every shipment includes free €150 insurance. Optional cover is available up to €25,000 for high-value items. Proof of delivery with photo and GPS coordinates is recorded for every drop.",
      },
    ],
  },
  {
    category: "Support & Claims",
    items: [
      {
        q: "What happens if my package is damaged?",
        a: "Every shipment includes free €150 insurance, and optional cover up to €25,000. Report any damage within 48 hours of delivery and we'll investigate immediately and resolve claims fast.",
      },
      {
        q: "How do I contact customer support?",
        a: "Reach us by phone, chat, or email. Business accounts get a dedicated account manager. We typically respond within a few hours during business hours.",
      },
      {
        q: "What is your refund policy?",
        a: "If a shipment is lost or damaged, you'll be fully refunded up to your coverage limit. Claims are processed quickly with minimal documentation.",
      },
    ],
  },
];

export default function FAQClient() {
  return (
    <>
      <Section background="white" spacing="lg" pattern="dots">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="FAQ"
              title="Frequently asked questions"
              description="Everything you need to know about shipping with Send Clouding. Still stuck? Our team is one message away."
            />
          </Reveal>

          <div className="mt-14 flex flex-col gap-12">
            {faqGroups.map((group, index) => (
              <Reveal key={group.category} delay={index * 60}>
                <h2 className="mb-4 flex items-center gap-3 text-card-title text-foreground sm:text-xl">
                  <span className="h-2 w-2 rounded-full bg-secondary" aria-hidden="true" />
                  {group.category}
                </h2>
                <Accordion type="single" className="overflow-hidden rounded-3xl border border-border bg-white px-6 shadow-sm sm:px-8">
                  {group.items.map((item) => (
                    <AccordionItem key={item.q} value={item.q} title={item.q}>
                      {item.a}
                    </AccordionItem>
                  ))}
                </Accordion>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="primary" spacing="lg" pattern="band" className="text-white">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-section-heading text-white">Still have questions?</h2>
              <p className="mx-auto mt-4 text-white/80">
                Our friendly team is here to help. Reach out and we&apos;ll get back to you as soon as possible.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="bg-secondary text-white hover:bg-secondary-600" asChild>
                  <Link href="/contact">
                    Contact Us <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <a href="mailto:hello@sendclouding.com">
                    <Mail className="mr-2 h-4 w-4" aria-hidden="true" /> Email Us
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}