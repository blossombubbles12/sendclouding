import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Terms of Service | Send Clouding",
  description: "Review the Send Clouding terms and conditions that govern the use of our logistics platform, shipping services, and API.",
  openGraph: {
    title: "Terms of Service | Send Clouding",
    description: "Terms and conditions for using Send Clouding logistics services.",
    type: "website",
  },
};

export default function TermsConditionsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      description="Please read these terms carefully before using Send Clouding's logistics platform, shipping services, or API."
      lastUpdated="August 2026"
      sections={[
        {
          heading: "1. Acceptance of Terms",
          body: "By creating an account, placing a shipment, or using our API, you agree to be bound by these Terms of Service, our Privacy Policy, and all applicable Dutch and UK laws. If you do not agree, do not use our services.",
        },
        {
          heading: "2. Services Description",
          body: "Send Clouding provides logistics and delivery services including: package pickup, transportation, tracking, and delivery across the Netherlands and the UK. We offer multiple service levels (Express, Same-Day, Standard, Economy) with varying speeds, coverage, and pricing. We also provide API access for business integrations.",
        },
        {
          heading: "3. Shipment Requirements & Restrictions",
          body: "You warrant that all shipments comply with applicable laws and our restrictions. Prohibited items include: illegal substances, weapons, explosives, flammable materials, live animals, perishable foods without cold chain, cash (except COD), and items prohibited by Dutch and UK law. We reserve the right to inspect, refuse, or return any shipment.",
          items: [
            "Maximum weight per package: 30kg (standard), 50kg (freight)",
            "Maximum dimensions: 100×50×50cm (standard)",
            "Proper packaging is the sender's responsibility",
            "Accurate contents declaration required",
          ],
        },
        {
          heading: "4. Pricing & Payment",
          body: "Prices are in Euros (EUR) and include fuel surcharge, handling, and €150 free insurance. Rates are based on service level, chargeable weight (greater of actual or volumetric weight), distance, and add-ons. Volumetric weight = (L×W×H cm) ÷ 5000. Payment is required at booking for Pay As You Go. Business/Enterprise plans may use monthly invoicing (net 15 terms). We accept card, iDEAL, and bank transfer.",
        },
        {
          heading: "5. Pickup & Delivery",
          body: "Pickup windows are 2-hour slots. Driver calls 30 minutes before arrival. Same-day pickup available in major metros if booked before 11 AM. Delivery requires recipient signature (digital or physical). After 3 failed attempts, package returns to our hub. Address changes after dispatch may incur rerouting fees. We are not liable for delays due to: incorrect addresses, recipient unavailability, security checkpoints, weather, traffic, or force majeure.",
        },
        {
          heading: "6. Tracking & Liability",
          body: "Every shipment receives a tracking number and real-time GPS tracking. Our liability for loss or damage is limited to the declared value (max €25,000 with additional insurance) or €150 free coverage, whichever applies. We are not liable for: consequential damages, data loss, delays beyond guaranteed windows, or acts of God. Claims must be filed within 7 days of delivery with photographic evidence.",
        },
        {
          heading: "7. Cash on Delivery (COD)",
          body: "COD service allows recipients to pay on delivery. Service fee: €3 per shipment. Funds remitted to sender's account within 24 hours of successful delivery. Failed COD deliveries return to sender at sender's expense. COD amount cannot exceed €2,500 per shipment.",
        },
        {
          heading: "8. API & Business Services",
          body: "API access requires Business or Enterprise plan. Usage subject to rate limits and fair use policy. We provide sandbox environment for testing. White-label tracking and custom integrations available on Enterprise plan. API credentials must be kept confidential. We may revoke access for abuse or terms violation.",
        },
        {
          heading: "9. Data & Privacy",
          body: "We collect and process personal data per our Privacy Policy. Shipment data (sender/recipient info, tracking) is retained for 2 years for operational and legal purposes. You consent to SMS/WhatsApp notifications for shipment updates. Data may be shared with delivery partners solely for fulfillment.",
        },
        {
          heading: "10. Intellectual Property",
          body: "All content, trademarks, logos, API, software, and tracking technology are Send Clouding's property. You may not copy, reverse-engineer, or resell our services without written permission. Business customers may display 'Powered by Send Clouding' badge per brand guidelines.",
        },
        {
          heading: "11. Termination",
          body: "We may suspend or terminate accounts for: terms violation, fraud, non-payment, abuse of services, or legal compliance. You may close your account anytime. Outstanding shipments will be completed. No refunds for partial months on subscription plans.",
        },
        {
          heading: "12. Dispute Resolution",
          body: "Disputes shall be resolved through good-faith negotiation. If unresolved, either party may refer to arbitration in Amsterdam under Dutch Arbitration Act. These terms governed by the laws of the Netherlands.",
        },
        {
          heading: "13. Changes to Terms",
          body: "We may update these terms with 30 days' notice via email and website posting. Continued use constitutes acceptance. Material changes to pricing require 60 days' notice for Business/Enterprise plans.",
        },
        {
          heading: "14. Contact Information",
          body: "Questions about these terms?",
          items: [
            "Email: legal@sendclouding.com",
            "Phone: +31 20 000 0000",
            "Address: Strawinskylaan 3051, Amsterdam, Netherlands",
          ],
        },
      ]}
    />
  );
}