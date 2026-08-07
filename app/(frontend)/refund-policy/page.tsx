import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Refund & Return Policy | AquaBest Brands",
  description:
    "Learn about AquaBest Brands refund and return policy for water, bakery products, and defective or damaged deliveries.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund & Return Policy"
      description="We stand behind the quality of our products. If something isn't right, here's how we make it right."
      lastUpdated="August 2026"
      sections={[
        {
          heading: "1. Our Commitment",
          body: "Your satisfaction is our priority. If you receive a damaged, defective, or incorrect product, we will replace it or issue a refund — no hassle.",
        },
        {
          heading: "2. Eligibility",
          body: "To be eligible for a return or refund, please contact us within 24 hours of delivery for perishable bakery items and within 48 hours for water products.",
          items: [
            "Report the issue with a photo where possible",
            "Provide your order number and details",
            "Items must be unused and in their original packaging",
          ],
        },
        {
          heading: "3. Perishable Products",
          body: "Given the perishable nature of breads, pastries, cakes, and confectioneries, refunds and replacements are assessed on a case-by-case basis. If a product arrives stale, damaged, or not as described, we will replace it at no cost.",
        },
        {
          heading: "4. Water Products",
          body: "Damaged or leaking bottles will be replaced free of charge. If you receive the wrong product or quantity, we will arrange a replacement or refund the affected amount.",
        },
        {
          heading: "5. How to Request a Refund",
          body: "Contact our support team with your order number and a description of the issue. We will review your request and respond within 1–2 business days.",
          items: [
            "Email: hello@aquabestbrands.com",
            "Phone: +234 800 000 0000",
            "Include your order number in all communications",
          ],
        },
        {
          heading: "6. Refund Processing",
          body: "Approved refunds are processed to the original payment method within 5–10 business days, depending on your bank or payment provider.",
        },
        {
          heading: "7. Non-Returnable Items",
          body: "For hygiene and safety reasons, opened food and beverage products cannot be returned unless they are defective or incorrect.",
        },
      ]}
    />
  );
}