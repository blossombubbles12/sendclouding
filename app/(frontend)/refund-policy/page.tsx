import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Refund & Claims Policy | Send Clouding",
  description: "Learn about Send Clouding's refund policy for shipping services, damage claims, lost packages, and service guarantees.",
  openGraph: {
    title: "Refund & Claims Policy | Send Clouding",
    description: "We stand behind our deliveries. If something goes wrong, here's how we make it right.",
    type: "website",
  },
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund & Claims Policy"
      description="We stand behind our deliveries. If something goes wrong — lost, damaged, or late — here's how we make it right."
      lastUpdated="August 2026"
      sections={[
        {
          heading: "1. Our Delivery Guarantee",
          body: "We commit to delivering your packages on time and intact. If we fail, we have clear remedies: refunds for service failures, claims for loss/damage, and proactive communication throughout.",
        },
        {
          heading: "2. Service Failure Refunds",
          body: "You may be eligible for a shipping cost refund (base rate only, not add-ons) in these cases:",
          items: [
            "Pickup Missed: Driver doesn't arrive within scheduled 2-hour window → 100% refund",
            "Late Delivery: Delivered beyond guaranteed window for Express/Same-Day → 50% refund",
            "No Tracking Updates: No scan for 48+ hours after pickup → 100% refund",
            "Wrong Delivery: Delivered to incorrect address → 100% refund + return shipping",
          ],
        },
        {
          heading: "3. Damage & Loss Claims",
          body: "Every shipment includes €150 free coverage. Additional insurance available up to €25,000 (0.5% of value above €150).",
          items: [
            "File within 7 calendar days of delivery (or expected delivery date for lost)",
            "Provide: tracking number, photos of damage/packaging, itemized value declaration",
            "External packaging must be intact for damage claims (shows transit damage)",
            "Claims reviewed within 48 hours (standard) or 5-7 days (complex/high-value)",
            "Approved claims paid to original payment method within 5 business days",
            "Maximum liability: declared value or €25,000, whichever is lower",
          ],
        },
        {
          heading: "4. Claim Exclusions",
          body: "We are not liable for:",
          items: [
            "Inadequate packaging (sender's responsibility to protect contents)",
            "Prohibited items shipped in violation of terms",
            "Consequential/indirect damages (lost profits, missed deadlines, etc.)",
            "Delay caused by: incorrect address, recipient unavailable, security checks, weather, force majeure",
            "Normal wear & tear, inherent vice (items that naturally degrade)",
            "Shipments without declared value exceeding free coverage",
            "Claims filed after 7-day window",
          ],
        },
        {
          heading: "5. Cash on Delivery (COD) Refunds",
          body: "If COD delivery fails after 3 attempts: package returns to sender. Sender pays return shipping. COD fee (€3) non-refundable. If recipient refuses package: same process. If sender cancels before pickup: full refund including COD fee.",
        },
        {
          heading: "6. Subscription & Plan Refunds",
          body: "Business plan (€99/month): cancel anytime, no partial-month refunds. Enterprise: per contract terms (typically 12-month commitment). Pay As You Go: no subscription, pay per shipment only.",
        },
        {
          heading: "7. How to File a Claim",
          body: "Three ways to start a claim:",
          items: [
            "Tracking Page: Click 'Report Issue' on any shipment",
            "Email: claims@sendclouding.com with tracking number, photos, description",
            "Phone: +31 20 000 0000 (claims option)",
          ],
        },
        {
          heading: "8. Claim Documentation Requirements",
          body: "For fastest processing, include:",
          items: [
            "Tracking number (SC-EU-XXXXXXXX)",
            "Clear photos: damaged item, packaging (all sides), shipping label",
            "Itemized value: description, quantity, unit price, total (with receipts if available)",
            "Recipient statement (if damage discovered on delivery)",
            "Police report (for theft/loss during transit, if applicable)",
          ],
        },
        {
          heading: "9. Dispute Resolution",
          body: "If you disagree with a claim decision:",
          items: [
            "Request review within 14 days — escalated to claims manager",
            "If unresolved: mediation via the Amsterdam Chamber of Commerce",
            "Final: arbitration in Amsterdam under Dutch Arbitration Act",
            "We cover mediation/arbitration costs for claims under €1,000",
          ],
        },
        {
          heading: "10. Contact Claims Team",
          body: "Need help with a claim?",
          items: [
            "Email: claims@sendclouding.com",
            "Phone: +31 20 000 0000 (option 3)",
            "Hours: Mon–Fri 8AM–7PM, Sat 9AM–4PM (CET)",
            "Response time: 2 hours (business hours), 24 hours (after hours)",
          ],
        },
      ]}
    />
  );
}