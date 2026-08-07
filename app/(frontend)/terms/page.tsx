import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Terms & Conditions | AquaBest Brands",
  description:
    "Review the AquaBest Brands terms and conditions that govern the use of our website and the purchase of our products.",
};

export default function TermsConditionsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      description="Please read these terms carefully before using our website or placing an order with AquaBest Brands."
      lastUpdated="August 2026"
      sections={[
        {
          heading: "1. Acceptance of Terms",
          body: "By accessing our website or placing an order, you agree to be bound by these terms and conditions and all applicable laws and regulations. If you do not agree with any part of these terms, you should not use our services.",
        },
        {
          heading: "2. Products and Pricing",
          body: "All prices are listed in Nigerian Naira (NGN) and may be updated from time to time. We strive to ensure all product descriptions and prices are accurate, but we reserve the right to correct any errors and to refuse or cancel orders if a product is mispriced or out of stock.",
          items: [
            "Prices are subject to change without prior notice",
            "Weights and quantities may vary slightly",
            "Promotional offers are subject to their specific terms",
          ],
        },
        {
          heading: "3. Orders and Payment",
          body: "When you place an order, you will receive a confirmation email. We reserve the right to refuse or cancel any order for reasons including product unavailability, pricing errors, or suspected fraud. Payment is processed securely at the time of checkout.",
        },
        {
          heading: "4. Delivery",
          body: "We make every effort to deliver your order within the estimated timeframe. Delivery times may vary depending on your location and external factors such as traffic or weather. While we aim for same-day delivery in Lagos, we cannot guarantee specific delivery times.",
        },
        {
          heading: "5. Returns and Refunds",
          body: "Your satisfaction is important to us. If you are not happy with a product, please contact us within the timeframe outlined in our Refund and Return Policy. Perishable food and water products are subject to specific conditions given their nature.",
        },
        {
          heading: "6. Intellectual Property",
          body: "All content on this website — including logos, text, graphics, and images — is the property of AquaBest Brands and is protected by copyright and trademark laws. You may not reproduce or use our content without written permission.",
        },
        {
          heading: "7. Limitation of Liability",
          body: "To the fullest extent permitted by law, AquaBest Brands shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products.",
        },
        {
          heading: "8. Changes to These Terms",
          body: "We may update these terms and conditions from time to time. Any changes will be posted on this page, and continued use of our services constitutes acceptance of the revised terms.",
        },
        {
          heading: "9. Contact Information",
          body: "If you have any questions about these terms, please reach out to our team.",
          items: [
            "Email: hello@aquabestbrands.com",
            "Phone: +234 800 000 0000",
            "Address: Lagos, Nigeria",
          ],
        },
      ]}
    />
  );
}