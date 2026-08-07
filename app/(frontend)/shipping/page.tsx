import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Shipping & Delivery | AquaBest Brands",
  description:
    "Find out how AquaBest Brands delivers premium water and bakery products across Nigeria, including delivery areas and timeframes.",
};

export default function ShippingDeliveryPage() {
  return (
    <PolicyPage
      title="Shipping & Delivery"
      description="Freshness is everything — that's why we move fast to get your order to your door."
      lastUpdated="August 2026"
      sections={[
        {
          heading: "1. Delivery Areas",
          body: "We currently deliver across Lagos with nationwide distribution available through our network of retail and wholesale partners. Contact us to confirm delivery availability in your area.",
        },
        {
          heading: "2. Delivery Timeframes",
          body: "Our standard delivery times are designed around freshness:",
          items: [
            "Same-day delivery within Lagos for orders placed before 2 PM",
            "Next-day delivery for orders placed after 2 PM",
            "2–4 business days for nationwide deliveries",
            "Bulk and wholesale orders scheduled with your account manager",
          ],
        },
        {
          heading: "3. Delivery Charges",
          body: "Delivery fees vary based on your location and order size. Orders above ₦50,000 qualify for free delivery within Lagos.",
          items: [
            "Free delivery on orders over ₦50,000 (Lagos)",
            "Standard fee of ₦2,000 within Lagos",
            "Nationwide delivery quoted at checkout",
          ],
        },
        {
          heading: "4. Freshness Guarantee",
          body: "Bakery products are baked fresh and delivered on the same day whenever possible, while water products are sealed at our facility and shipped to preserve quality.",
        },
        {
          heading: "5. Order Tracking",
          body: "Track your order status anytime from your account, or contact our support team for the latest updates on your delivery.",
        },
        {
          heading: "6. Delivery Issues",
          body: "If your delivery is delayed or arrives damaged, please contact us immediately with your order number so we can resolve it quickly.",
          items: [
            "Email: hello@aquabestbrands.com",
            "Phone: +234 800 000 0000",
          ],
        },
      ]}
    />
  );
}