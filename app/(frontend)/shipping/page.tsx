import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy/policy-page";

export const metadata: Metadata = {
  title: "Shipping Guide | Send Clouding",
  description: "Complete guide to shipping with Send Clouding: packaging, labeling, prohibited items, pickup, delivery, and best practices.",
  openGraph: {
    title: "Shipping Guide | Send Clouding",
    description: "Everything you need to know to ship successfully with Send Clouding.",
    type: "website",
  },
};

export default function ShippingGuidePage() {
  return (
    <PolicyPage
      title="Shipping Guide"
      description="Everything you need to know to ship successfully with Send Clouding — from packaging to delivery."
      lastUpdated="August 2026"
      sections={[
        {
          heading: "1. Before You Ship",
          body: "Prepare your shipment correctly to avoid delays, damage, or extra charges.",
          items: [
            "Weigh and measure accurately (L×W×H in cm) — volumetric weight applies",
            "Declare contents honestly — customs and security checks verify",
            "Use appropriate packaging for item type (see Section 2)",
            "Remove old labels/barcodes from reused boxes",
            "Have sender/recipient details ready: full names, phones, addresses",
          ],
        },
        {
          heading: "2. Packaging Requirements",
          body: "Proper packaging protects your items and ensures acceptance. Sender is responsible for adequate packaging.",
          items: [
            "Standard boxes: Use new, double-walled corrugated boxes for items >5kg",
            "Fragile items: Bubble wrap (2+ layers), foam corners, 'Fragile' tape, internal cushioning",
            "Documents: Rigid mailers or document envelopes with cardboard backing",
            "Liquids: Leak-proof containers, sealed in plastic bags, absorbent material",
            "Electronics: Anti-static bags, original packaging preferred, cushion all sides",
            "Clothing/textiles: Poly mailers or boxes, folded neatly",
            "Irregular items: Custom crating or contact us for specialty packaging",
            "Maximum per package: 30kg, 100×50×50cm (standard service)",
          ],
        },
        {
          heading: "3. Labeling & Documentation",
          body: "Clear labeling ensures correct routing and delivery.",
          items: [
            "We generate shipping label at booking — print and attach to top of package",
            "Label must be flat, unobstructed, and scannable (no tape over barcode)",
            "Include duplicate label inside package",
            "COD shipments: 'CASH ON DELIVERY' sticker (provided by driver)",
            "Fragile: 'HANDLE WITH CARE' / 'THIS SIDE UP' labels",
            "International (future): Commercial invoice, customs declaration",
          ],
        },
        {
          heading: "4. Prohibited & Restricted Items",
          body: "These items cannot be shipped via Send Clouding:",
          items: [
            "Absolutely Prohibited: Illegal drugs, weapons, explosives, ammunition, flammable liquids/gases, toxic chemicals, radioactive materials, live animals, human remains, counterfeit goods, cash (except COD), gambling materials",
            "Restricted (require special service): Lithium batteries (separate packaging, ≤100Wh), alcohol (licensed shippers only), pharmaceuticals (cold chain only), perishable foods (cold chain only), high-value items >€2,500 (secure service only), plants/seeds (phytosanitary cert required)",
            "We reserve the right to inspect, refuse, return, or dispose of prohibited items at sender's expense.",
          ],
        },
        {
          heading: "5. Pickup Process",
          body: "Smooth pickup ensures on-time delivery.",
          items: [
            "Schedule 2-hour window at booking (8AM-12PM, 12PM-4PM, 4PM-7PM)",
            "Driver calls 30 minutes before arrival",
            "Have package ready, labeled, and accessible",
            "Driver scans barcode → you get tracking number instantly via SMS/WhatsApp",
            "Driver provides pickup receipt with tracking number",
            "Same-day pickup: Book before 11 AM in Amsterdam, Rotterdam, London, Manchester",
            "Missed pickup: Reschedule next business day (no extra charge first time)",
          ],
        },
        {
          heading: "6. In Transit",
          body: "Your package moves through our network with full visibility.",
          items: [
            "Sorting hub scan → In transit → Destination hub → Out for delivery → Delivered",
            "Real-time GPS tracking on Track page and SMS/WhatsApp links",
            "Milestone notifications at each scan",
            "Estimated delivery window updated dynamically",
            "Exception alerts: weather delays, address issues, failed attempts",
          ],
        },
        {
          heading: "7. Delivery Process",
          body: "Final mile delivery with confirmation.",
          items: [
            "Driver calls recipient 15-30 minutes before arrival",
            "Recipient presents ID and signs digitally (or paper)",
            "Driver captures photo of delivered package + GPS coordinates",
            "Proof of Delivery (POD) available instantly in tracking",
            "Failed attempt: reattempt next business day (max 3 attempts)",
            "After 3 attempts: returns to nearest hub for pickup (7 days free storage)",
            "Delivery instructions: gate codes, building access, safe-drop locations accepted",
          ],
        },
        {
          heading: "8. Service Levels & Timeframes",
          body: "Choose the right speed for your needs:",
          items: [
            "Same-Day: Amsterdam/London/Manchester metro, 4-8 hours, book by 11 AM",
            "Express: 50+ major cities, next business day by 6 PM",
            "Standard: Netherlands & UK, 2-5 business days",
            "Economy: Netherlands & UK, 5-7 business days",
            "Custom: Secure, cold chain, scheduled — per agreement",
            "Cut-off times: 2 PM for next-day, 11 AM for same-day",
          ],
        },
        {
          heading: "9. Special Services",
          body: "Additional options for specific needs:",
          items: [
            "Fragile Handling (+€5): Extra cushioning, 'Fragile' priority, dedicated handling",
            "Cash on Delivery (+€3): Recipient pays, funds remitted in 24 hours",
            "Signature Required (+€3): Adult signature mandatory",
            "Saturday Delivery (+€12): Major cities only",
            "Morning Window (+€8): Guaranteed by 12 PM",
            "Return Pickup: Schedule return for customers (same rate as delivery)",
            "Additional Insurance: 0.5% of value above free €150, up to €25,000",
          ],
        },
        {
          heading: "10. Best Practices for Shippers",
          body: "Tips from our operations team:",
          items: [
            "Ship early in the week for faster delivery (avoid weekend holdovers)",
            "Use our free boxes at pickup (S/M/L) or bring your own",
            "Enable SMS/WhatsApp notifications for real-time updates",
            "Save frequent addresses in your account for faster booking",
            "Business accounts: use API for bulk label generation",
            "Track volumetric weight — use smallest box that fits",
            "Photograph valuable items before sealing for claims evidence",
            "Communicate delivery instructions clearly (gate codes, landmarks)",
          ],
        },
        {
          heading: "11. Need Help?",
          body: "Our team is here to assist:",
          items: [
            "Support: support@sendclouding.com | +31 20 000 0000",
            "WhatsApp: +31 20 000 0000",
            "Help Center: /help (detailed guides, video tutorials)",
            "API Docs: /docs (developers)",
            "Business Sales: sales@sendclouding.com",
          ],
        },
      ]}
    />
  );
}