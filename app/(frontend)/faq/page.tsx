import type { Metadata } from "next";
import FAQClient from "./faq-client";

export const metadata: Metadata = {
  title: "FAQ | Send Clouding",
  description: "Find answers to common questions about shipping, tracking, pricing, coverage, and our services. Quick help for Send Clouding customers.",
  openGraph: {
    title: "FAQ | Send Clouding",
    description: "Quick answers to common questions about shipping, tracking, pricing, and coverage.",
    type: "website",
  },
};

export default function FAQPage() {
  return <FAQClient />;
}