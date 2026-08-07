import type { Metadata } from "next";
import { SubpageHero } from "@/components/shared/subpage-hero";
import { FAQContent } from "@/components/faq/faq-content";

export const metadata: Metadata = {
  title: "FAQ | AquaBest Brands",
  description:
    "Find answers to common questions about AquaBest water, bakery products, ordering, payment, and delivery.",
};

export default function FAQPage() {
  return (
    <>
      <SubpageHero
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        description="Quick answers to the questions we hear most — from ordering and delivery to our products and policies."
      />
      <FAQContent />
    </>
  );
}