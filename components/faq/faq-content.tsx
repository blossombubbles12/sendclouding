"use client";

import * as React from "react";
import { Mail } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Reveal } from "@/components/motion/reveal";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    category: "Ordering & Payment",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse our products, choose a design template or upload your own, customize to your liking, add to cart, and check out securely. You'll receive an order confirmation with your design proof.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept secure online payments via Paystack, including major debit/credit cards and bank transfers. All transactions are encrypted.",
      },
      {
        q: "Can I cancel or modify my order?",
        a: "Yes. Contact us as soon as possible. If your order hasn't entered production, we can update or cancel it at no charge.",
      },
    ],
  },
  {
    category: "Design & Customization",
    items: [
      {
        q: "How do I customize my design?",
        a: "After selecting a product, you can upload your own artwork or use our free online design tool to create from templates. Adjust colors, text, and layout in real time.",
      },
      {
        q: "What file formats do you accept?",
        a: "We accept PNG, JPG, PDF, AI, PSD, and SVG files. For best results, upload high-resolution files (300 DPI) in CMYK color mode.",
      },
      {
        q: "Can I see a proof before printing?",
        a: "Yes. You'll receive a digital proof for approval before we begin production. No printing starts until you confirm.",
      },
    ],
  },
  {
    category: "Delivery & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard production takes 1-3 business days. Delivery within Lagos is 1-2 days, and nationwide delivery is 3-5 business days after production.",
      },
      {
        q: "How do I track my order?",
        a: "Track your order from your account dashboard or use the Track Order page with your order number. Our support team can also provide real-time updates.",
      },
      {
        q: "How much does delivery cost?",
        a: "Delivery is free on orders over \u20A620,000 nationwide. Standard fees apply for orders below this threshold, calculated at checkout based on your location.",
      },
    ],
  },
  {
    category: "Account & Support",
    items: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign In' in the header and select 'Create Account'. You'll need an email address and password to get started.",
      },
      {
        q: "What is your return and refund policy?",
        a: "If a product arrives damaged, defective, or with printing errors, contact us within 48 hours of delivery and we'll reprint or issue a full refund.",
      },
      {
        q: "How can I contact customer support?",
        a: "Reach us by phone, email, or through our contact page. We typically respond within a few hours during business hours.",
      },
    ],
  },
];

function FaqCategory({ category, items, index }: (typeof faqs)[number] & { index: number }) {
  return (
    <Reveal delay={index * 60}>
      <h2 className="mb-4 flex items-center gap-3 text-card-title text-foreground sm:text-xl">
        <span className="h-2 w-2 rounded-full bg-secondary" aria-hidden="true" />
        {category}
      </h2>
      <Accordion type="single" className="overflow-hidden rounded-3xl border border-border bg-white px-6 sm:px-8">
        {items.map((item) => (
          <AccordionItem key={item.q} value={item.q} title={item.q}>
            {item.a}
          </AccordionItem>
        ))}
      </Accordion>
    </Reveal>
  );
}

export function FAQContent() {
  return (
    <Section background="white" spacing="lg">
      <div className="flex flex-col gap-12">
        {faqs.map((group, index) => (
          <FaqCategory key={group.category} {...group} index={index} />
        ))}
      </div>

      <div className="mt-16">
        <Reveal>
          <div className="rounded-[2rem] bg-primary px-8 py-12 text-center sm:px-16">
            <h2 className="text-section-heading text-white">Still have questions?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Our friendly team is here to help. Reach out and we&apos;ll get back to
              you as soon as possible.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" className="bg-secondary text-white hover:bg-secondary-600" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
                asChild
              >
                <a href="mailto:hello@signages.ng">
                  <Mail className="mr-2 h-4 w-4" aria-hidden="true" /> Email Us
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
