import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Privacy Policy | Send Clouding",
  description: "Read the Send Clouding privacy policy to understand how we collect, use, and protect your personal and shipment data.",
  openGraph: {
    title: "Privacy Policy | Send Clouding",
    description: "Your privacy matters. This policy explains how Send Clouding collects, uses, and protects your information.",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      description="Your privacy matters to us. This policy explains how Send Clouding collects, uses, and protects your personal and shipment data."
      lastUpdated="August 2026"
      sections={[
        {
          heading: "1. Information We Collect",
          body: "We collect data you provide directly and data generated through your use of our services.",
          items: [
            "Account info: name, email, phone, company name, role",
            "Shipment data: sender/recipient names, addresses, phone numbers, package details, contents",
            "Tracking data: GPS locations, timestamps, scan events, delivery confirmations, photos",
            "Payment data: billing address, payment method tokens (processed by PCI-compliant partners)",
            "API data: integration logs, webhook events, rate limit usage",
            "Communications: support tickets, chat logs, emails, call recordings (with consent)",
            "Usage data: IP address, device info, browser type, pages visited, referral source",
            "Cookies & similar tech: session IDs, preferences, analytics identifiers",
          ],
        },
        {
          heading: "2. How We Use Your Information",
          body: "We process data for the following purposes:",
          items: [
            "Shipment fulfillment: pickup, transport, tracking, delivery, proof of delivery",
            "Account management: authentication, preferences, saved addresses, order history",
            "Customer support: responding to inquiries, resolving issues, proactive updates",
            "Notifications: SMS/WhatsApp/email for pickup, transit, delivery, exceptions",
            "Billing & payments: invoicing, receipts, refunds, COD remittances",
            "Service improvement: analytics, route optimization, performance monitoring",
            "Security: fraud detection, abuse prevention, authentication",
            "Legal compliance: tax records, regulatory reporting, law enforcement requests",
            "Marketing (with consent): service updates, promotions, feature announcements",
          ],
        },
        {
          heading: "3. Legal Basis for Processing (GDPR & UK GDPR)",
          body: "We process personal data on the following lawful bases:",
          items: [
            "Contract performance: fulfilling shipments, providing tracking, processing payments",
            "Legitimate interests: service improvement, fraud prevention, analytics, security",
            "Consent: marketing communications, optional data sharing, call recordings",
            "Legal obligation: tax compliance, customs declarations, law enforcement requests",
            "Vital interests: emergency delivery situations, medical shipments",
          ],
        },
        {
          heading: "4. Data Sharing & Disclosure",
          body: "We do not sell your personal information. We share data only as follows:",
          items: [
            "Delivery partners: courier companies, drivers — only data needed for pickup/delivery",
            "Payment processors: iDEAL, cards, bank transfer — for transaction processing only",
            "Cloud providers: Vercel, AWS, database hosts — under data processing agreements",
            "Analytics: PostHog, Google Analytics — anonymized/aggregated where possible",
            "API consumers: your own systems via webhooks — you control what data you receive",
            "Legal authorities: when required by Dutch or UK law, court order, or regulatory mandate",
            "Business transfers: in merger/acquisition, with notice and continued protection",
            "Emergency services: for urgent medical/humanitarian deliveries",
          ],
        },
        {
          heading: "5. Data Retention",
          body: "We retain data only as long as necessary:",
          items: [
            "Shipment records (tracking, POD, signatures): 2 years after delivery",
            "Account & profile data: while account is active + 1 year after closure",
            "Payment records: 7 years per Dutch tax law (Belastingdienst)",
            "API logs: 90 days (sandbox: 30 days)",
            "Support communications: 2 years",
            "Marketing data: until opt-out or 2 years of inactivity",
            "Security logs: 1 year",
            "Anonymized analytics: indefinitely",
          ],
        },
        {
          heading: "6. Data Security",
          body: "We implement appropriate technical and organizational measures:",
          items: [
            "Encryption in transit (TLS 1.3) and at rest (AES-256)",
            "PCI-DSS compliant payment processing via certified partners",
            "Role-based access control, MFA for admin access",
            "Regular penetration testing and vulnerability scanning",
            "Data processing agreements with all subprocessors",
            "Incident response plan with 72-hour breach notification (GDPR)",
            "Employee training on data protection and privacy",
            "API rate limiting, authentication, and audit logging",
          ],
        },
        {
          heading: "7. Your Rights (GDPR & UK GDPR)",
          body: "You have the following rights regarding your personal data:",
          items: [
            "Access: request a copy of your data in portable format",
            "Rectification: correct inaccurate or incomplete data",
            "Erasure: request deletion (subject to legal retention requirements)",
            "Restriction: limit processing in certain circumstances",
            "Portability: receive your data in structured, machine-readable format",
            "Objection: object to processing for direct marketing or legitimate interests",
            "Withdraw consent: for any consent-based processing at any time",
            "Complain: to Dutch Data Protection Authority (AP) or UK ICO",
            "To exercise rights: email privacy@sendclouding.com or use account settings",
          ],
        },
        {
          heading: "8. Cookies & Tracking Technologies",
          body: "We use cookies for:",
          items: [
            "Essential: session management, authentication, CSRF protection, cart",
            "Preferences: language, currency, notification settings, theme",
            "Analytics: page views, feature usage, funnel analysis (PostHog)",
            "Marketing: attribution, conversion tracking (with consent)",
            "Third-party: payment widgets, chat widget, maps",
            "You can manage cookies via browser settings or our cookie banner. Disabling essential cookies may break core functionality.",
          ],
        },
        {
          heading: "9. International Transfers",
          body: "Your data is primarily stored and processed in the Netherlands (Amsterdam data centers). Some subprocessors may process data in other jurisdictions (e.g., AWS regions, Vercel edge). We ensure adequate safeguards via: Standard Contractual Clauses, adequacy decisions, or your explicit consent.",
        },
        {
          heading: "10. Children's Privacy",
          body: "Our services are not directed to children under 18. We do not knowingly collect data from minors. If a parent/guardian becomes aware, contact us for immediate deletion.",
        },
        {
          heading: "11. Changes to This Policy",
          body: "We may update this policy with 30 days' notice via email and website banner. Material changes to data processing require 60 days' notice. Continued use constitutes acceptance. Check 'Last Updated' date above.",
        },
        {
          heading: "12. Contact Our Data Protection Officer",
          body: "Questions, requests, or concerns about your data?",
          items: [
            "Email: privacy@sendclouding.com",
            "Phone: +31 20 000 0000",
            "Address: Strawinskylaan 3051, Amsterdam, Netherlands",
            "DPO: Adaeze Nwosu, Co-founder & CTO",
          ],
        },
      ]}
    />
  );
}