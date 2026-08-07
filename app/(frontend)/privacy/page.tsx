import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy | AquaBest Brands",
  description:
    "Read the AquaBest Brands privacy policy to understand how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      description="Your privacy matters to us. This policy explains how AquaBest Brands collects, uses, and protects your information."
      lastUpdated="August 2026"
      sections={[
        {
          heading: "1. Information We Collect",
          body: "We collect information you provide directly, such as when you create an account, place an order, subscribe to our newsletter, or contact our team. This may include your name, email address, phone number, delivery address, and payment details.",
          items: [
            "Account and order information",
            "Contact and delivery details",
            "Payment and billing information",
            "Communications you send us",
          ],
        },
        {
          heading: "2. How We Use Your Information",
          body: "We use the information we collect to process orders, deliver products, provide customer support, improve our services, and keep you informed about promotions and new products.",
          items: [
            "Processing and fulfilling your orders",
            "Delivering products to your address",
            "Providing customer support and resolving issues",
            "Sending order updates and service notifications",
            "Sharing relevant promotions and updates (with your consent)",
          ],
        },
        {
          heading: "3. Information Sharing",
          body: "We do not sell your personal information. We only share data with trusted service providers who help us operate our business — such as payment processors, delivery partners, and email providers — and only to the extent needed to serve you.",
        },
        {
          heading: "4. Data Security",
          body: "We take reasonable technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Payment transactions are processed through secure, PCI-compliant providers.",
        },
        {
          heading: "5. Your Rights",
          body: "You have the right to access, correct, or request deletion of your personal information. You may also opt out of marketing communications at any time.",
          items: [
            "Access and review your personal data",
            "Update or correct your information",
            "Request deletion of your account and data",
            "Opt out of marketing communications",
          ],
        },
        {
          heading: "6. Cookies",
          body: "We use cookies and similar technologies to improve your browsing experience, remember your preferences, and understand how our website is used. You can control cookies through your browser settings.",
        },
        {
          heading: "7. Contact Us",
          body: "If you have questions about this privacy policy or how we handle your data, please contact our team and we will be happy to assist you.",
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