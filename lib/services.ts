import {
  Truck,
  Zap,
  PackageCheck,
  MapPin,
  Plane,
  Boxes,
  Warehouse,
  Workflow,
  ShieldCheck,
  Snowflake,
  Gem,
  Building2,
  RefreshCw,
  Container,
  type LucideIcon,
} from "lucide-react";

export interface ServiceProcessStep {
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  /** Legacy `?type=` value used by earlier navigation links. */
  type: string;
  icon: LucideIcon;
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  imageAlt: string;
  /** Display string such as "from €19.90" or "custom quote". */
  price: string;
  features: string[];
  process: ServiceProcessStep[];
  includes: string[];
  related: string[];
}

const defaultProcess: ServiceProcessStep[] = [
  { title: "Book in seconds", description: "Enter pickup and destination, choose a window, confirm instantly." },
  { title: "We pick up", description: "A courier collects from your door at the chosen time." },
  { title: "Live in transit", description: "Follow every stop with real-time GPS and ETA updates." },
  { title: "Delivered & confirmed", description: "Signature or photo confirmation the moment it lands." },
];

export const services: Service[] = [
  {
    slug: "same-day-delivery",
    type: "same-day",
    icon: Truck,
    name: "Same-Day Delivery",
    tagline: "Delivered today, or it's free.",
    description:
      "Door-to-door courier delivery in 4–8 hours across Amsterdam, London and every metro in between. Book before the cut-off and we'll have it there by evening.",
    heroImage: "/signagemain.png",
    imageAlt: "Same-day courier delivery",
    price: "from €19.90",
    features: [
      "4–8 hour metro delivery",
      "Live GPS tracking on every stop",
      "Flexible pickup windows",
      "Signature & photo proof of delivery",
      "Book online or via API in seconds",
    ],
    process: defaultProcess,
    includes: ["Pickup & delivery", "Live tracking & notifications", "Proof of delivery", "Insurance up to €100"],
    related: ["express-delivery", "local-delivery", "international-shipping"],
  },
  {
    slug: "express-delivery",
    type: "express",
    icon: Zap,
    name: "Express Delivery",
    tagline: "Priority handling, guaranteed next day.",
    description:
      "Premium priority service for time-sensitive consignments — express board allocation, dedicated handling and guaranteed next-day delivery across the Netherlands and the UK.",
    heroImage: "/signageslide1.png",
    imageAlt: "Express priority delivery",
    price: "from €9.90",
    features: [
      "Priority express board",
      "Guaranteed next-day delivery",
      "Evening collection windows",
      "Real-time ETA updates",
      "Photo & signature proof",
    ],
    process: defaultProcess,
    includes: ["Priority sorting", "Next-day guarantee", "Live tracking", "Proof of delivery"],
    related: ["same-day-delivery", "nationwide-delivery", "international-shipping"],
  },
  {
    slug: "nationwide-delivery",
    type: "nationwide",
    icon: PackageCheck,
    name: "Nationwide Delivery",
    tagline: "500+ cities, one tracked network.",
    description:
      "Cost-effective nationwide delivery to more than 500 cities and towns across the Netherlands and the UK, with precise delivery windows and evening collection.",
    heroImage: "/signageslide2.png",
    imageAlt: "Nationwide delivery network",
    price: "from €7.90",
    features: [
      "500+ cities & towns covered",
      "Next-business-day standard",
      "Precise delivery windows",
      "Evening collection",
      "Tracking & SMS updates",
    ],
    process: defaultProcess,
    includes: ["Nationwide coverage", "Standard transit time", "Tracking & notifications", "Proof of delivery"],
    related: ["express-delivery", "bulk-shipping", "local-delivery"],
  },
  {
    slug: "local-delivery",
    type: "local",
    icon: MapPin,
    name: "Local Delivery",
    tagline: "Around the corner, in hours.",
    description:
      "Fast same-area courier runs for documents, parcels and packages — the most affordable way to move goods within your city or borough.",
    heroImage: "/signageslide3.png",
    imageAlt: "Local courier delivery",
    price: "from €4.90",
    features: [
      "Within-city courier runs",
      "Delivered within hours",
      "Same courier end to end",
      "Instant booking",
      "Flexible collection",
    ],
    process: defaultProcess,
    includes: ["Local pickup & drop", "Tracking & confirmation", "Proof of delivery"],
    related: ["same-day-delivery", "nationwide-delivery", "express-delivery"],
  },
  {
    slug: "international-shipping",
    type: "international",
    icon: Plane,
    name: "International Shipping",
    tagline: "Cross-border, customs handled.",
    description:
      "Door-to-door international delivery between the Netherlands, the UK and the EU — customs documentation prepared for you and full visibility at every border.",
    heroImage: "/about-hero.png",
    imageAlt: "International cross-border shipping",
    price: "custom quote",
    features: [
      "NL–UK & EU door-to-door",
      "Customs documentation included",
      "Trackable across borders",
      "Dedicated export team",
      "Insurance available",
    ],
    process: defaultProcess,
    includes: ["Customs clearance support", "Full journey tracking", "Import/export documentation"],
    related: ["express-delivery", "high-value", "custom-solutions"],
  },
  {
    slug: "ecommerce-shipping",
    type: "ecommerce",
    icon: Boxes,
    name: "E-commerce Shipping",
    tagline: "Your store, shipped on autopilot.",
    description:
      "Pick, pack and ship for online stores with API automation, branded tracking pages and volume-friendly rates — built for Shopify, WooCommerce and more.",
    heroImage: "/homepage1.png",
    imageAlt: "E-commerce shipping and fulfilment",
    price: "from €6.90",
    features: [
      "REST API & webhooks",
      "Shopify / WooCommerce plugins",
      "Branded tracking pages",
      "Automated carrier booking",
      "Volume pricing tiers",
    ],
    process: defaultProcess,
    includes: ["API access", "Branded tracking", "Automated labels", "Monthly invoicing"],
    related: ["bulk-shipping", "api-integration", "nationwide-delivery"],
  },
  {
    slug: "bulk-shipping",
    type: "bulk",
    icon: Warehouse,
    name: "Bulk Shipping",
    tagline: "Volume moves, scheduled drops.",
    description:
      "Scheduled multi-drop and high-volume shipping with negotiated rates, dedicated account management and consolidated invoicing for growing businesses.",
    heroImage: "/homepage2.png",
    imageAlt: "Bulk and volume shipping",
    price: "custom quote",
    features: [
      "Negotiated volume rates",
      "Scheduled multi-drop runs",
      "Dedicated account manager",
      "Consolidated monthly invoicing",
      "Dedicated linehaul capacity",
    ],
    process: defaultProcess,
    includes: ["Volume pricing", "Account manager", "Consolidated invoicing"],
    related: ["ecommerce-shipping", "nationwide-delivery", "custom-solutions"],
  },
  {
    slug: "api-integration",
    type: "api",
    icon: Workflow,
    name: "API Integration",
    tagline: "Plug logistics straight into your stack.",
    description:
      "RESTful API, webhooks and client libraries to create shipments, print labels and stream tracking events directly into your platform.",
    heroImage: "/homepage3.png",
    imageAlt: "Logistics API integration",
    price: "custom quote",
    features: [
      "RESTful API & webhooks",
      "Label & manifest automation",
      "Live tracking webhooks",
      "Sandbox environment",
      "SDKs & documentation",
    ],
    process: defaultProcess,
    includes: ["API credentials", "Sandbox access", "Developer support"],
    related: ["ecommerce-shipping", "custom-solutions", "bulk-shipping"],
  },
  {
    slug: "fragile-items",
    type: "fragile",
    icon: ShieldCheck,
    name: "Fragile Items",
    tagline: "Handle with care, literally.",
    description:
      "Purpose-built packaging guidance and careful handling plans for glass, ceramics and electronics — with priority boarding and extra protection.",
    heroImage: "/hero-section-home.png",
    imageAlt: "Fragile item courier handling",
    price: "from €9.90",
    features: [
      "Careful handling plan",
      "Priority boarding",
      "Protective packaging advice",
      "Fragile tracking flag",
      "Photo proof of condition",
    ],
    process: defaultProcess,
    includes: ["Fragile handling", "Priority sorting", "Proof of condition"],
    related: ["high-value", "same-day-delivery", "express-delivery"],
  },
  {
    slug: "cold-chain",
    type: "cold-chain",
    icon: Snowflake,
    name: "Cold Chain",
    tagline: "Temperature-controlled, end to end.",
    description:
      "Refrigerated and ambient-controlled transit for food, pharma and cosmetics, with validated packaging and temperature logging on request.",
    heroImage: "/aquabestslider1.png",
    imageAlt: "Cold chain temperature-controlled shipping",
    price: "custom quote",
    features: [
      "Refrigerated & ambient options",
      "Temperature logging available",
      "Validated packaging",
      "Priority handling",
      "Pharma-grade options",
    ],
    process: defaultProcess,
    includes: ["Temperature monitoring", "Validated packaging", "Priority handling"],
    related: ["fragile-items", "express-delivery", "high-value"],
  },
  {
    slug: "high-value",
    type: "high-value",
    icon: Gem,
    name: "High Value",
    tagline: "Insured, tracked, protected.",
    description:
      "Enhanced security for high-value consignments — extra insurance, discreet handling, two-stage delivery and CCTV-checked transit.",
    heroImage: "/about2.png",
    imageAlt: "High-value insured delivery",
    price: "custom quote",
    features: [
      "Enhanced insurance coverage",
      "Discreet handling",
      "Two-stage delivery",
      "CCTV-checked transit",
      "Named courier",
    ],
    process: defaultProcess,
    includes: ["Enhanced insurance", "Priority security handling", "Signature on delivery"],
    related: ["fragile-items", "international-shipping", "same-day-delivery"],
  },
  {
    slug: "custom-solutions",
    type: "custom",
    icon: Building2,
    name: "Custom Solutions",
    tagline: "Logistics built around your business.",
    description:
      "Bespoke logistics for unusual requirements — dedicated fleets, scheduled runs, white-glove delivery and anything else your operation needs.",
    heroImage: "/homectafooter.png",
    imageAlt: "Bespoke custom logistics solutions",
    price: "custom quote",
    features: [
      "Dedicated fleet options",
      "White-glove delivery",
      "Scheduled route design",
      "SLAs & reporting",
      "Dedicated account team",
    ],
    process: defaultProcess,
    includes: ["Bespoke scope", "Account team", "SLAs & reporting"],
    related: ["api-integration", "bulk-shipping", "international-shipping"],
  },
  {
    slug: "returns-logistics",
    type: "returns",
    icon: RefreshCw,
    name: "Returns & Reverse Logistics",
    tagline: "Managed returns, done for you.",
    description:
      "End-to-end returns management — labels generated in seconds, quality inspection on arrival and restock, repair or recycle flows, all visible in your dashboard.",
    heroImage: "/aboutusbottom.png",
    imageAlt: "Returns and reverse logistics",
    price: "from €6.90",
    features: [
      "Return labels in seconds",
      "Quality inspection on arrival",
      "Restock, repair or recycle flows",
      "Dashboard visibility",
      "Scheduled collection runs",
    ],
    process: defaultProcess,
    includes: ["Return handling", "Inspection & reporting", "Restock or disposal"],
    related: ["ecommerce-shipping", "bulk-shipping", "high-value"],
  },
  {
    slug: "freight-pallet",
    type: "freight",
    icon: Container,
    name: "Freight & Pallet",
    tagline: "Bulk and pallet loads, booked in minutes.",
    description:
      "Reliable pallet and bulk freight for larger consignments — tail-lift and two-man delivery, dedicated linehaul capacity and a single point of contact.",
    heroImage: "/signagemain.png",
    imageAlt: "Pallet freight and bulk delivery",
    price: "custom quote",
    features: [
      "Pallet & oversized consignments",
      "Tail-lift and two-man delivery",
      "Dedicated linehaul capacity",
      "Single point of contact",
      "Live pallet tracking",
    ],
    process: defaultProcess,
    includes: ["Bulk & pallet handling", "Tail-lift delivery", "Dedicated account manager"],
    related: ["bulk-shipping", "international-shipping", "custom-solutions"],
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}