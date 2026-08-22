import Link from "next/link";
import { Package, Mail, MapPin, Phone, Truck, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";

const columns = [
  {
    title: "Ship",
    links: [
      { label: "Ship a Package", href: "/ship" },
      { label: "Get a Quote", href: "/quote" },
      { label: "Schedule Pickup", href: "/schedule" },
      { label: "Shipping Calculator", href: "/calculator" },
      { label: "Shipping Supplies", href: "/supplies" },
    ],
  },
  {
    title: "Track",
    links: [
      { label: "Track Shipment", href: "/track" },
      { label: "Track by Reference", href: "/track/reference" },
      { label: "Delivery Notifications", href: "/notifications" },
      { label: "Proof of Delivery", href: "/pod" },
      { label: "Track Multiple", href: "/track/bulk" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Same-Day Delivery", href: "/services/same-day-delivery" },
      { label: "Express Delivery", href: "/services/express-delivery" },
      { label: "Nationwide Delivery", href: "/services/nationwide-delivery" },
      { label: "International Shipping", href: "/services/international-shipping" },
      { label: "E-commerce Shipping", href: "/services/ecommerce-shipping" },
      { label: "Bulk Shipping", href: "/services/bulk-shipping" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Coverage", href: "/coverage" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "FAQs", href: "/faq" },
      { label: "Claims", href: "/claims" },
      { label: "Shipping Guide", href: "/guide" },
      { label: "API Docs", href: "/docs" },
    ],
  },
];

export function Footer({
  siteName = "Send Clouding",
  siteDescription = "Modern logistics technology platform. Ship packages, track shipments in real-time, and manage deliveries with confidence. Fast, reliable, and transparent shipping for everyone.",
  logoUrl,
  logoAlt = siteName,
  contactEmail = "hello@sendclouding.com",
  contactPhone = "+31 20 000 0000",
  address,
  socialLinks,
}: {
  siteName?: string;
  siteDescription?: string;
  logoUrl?: string | null;
  logoAlt?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: { city?: string; country?: string } | null;
  socialLinks?: Record<string, string> | null;
}) {
  return (
    <footer className="bg-primary text-white">
      <Container className="py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  className="h-8 w-auto object-contain brightness-0 invert"
                />
              ) : (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <Package className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col leading-none">
                    <span className="text-base font-bold tracking-tight">{siteName}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-secondary">
                      Ship • Track • Deliver
                    </span>
                  </span>
                </>
              )}
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              {siteDescription}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/65">
              {address?.city && (
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                  {address.city}
                  {address.country ? `, ${address.country}` : ""}
                </li>
              )}
              {contactPhone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                  {contactPhone}
                </li>
              )}
              {contactEmail && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                  {contactEmail}
                </li>
              )}
            </ul>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks?.twitter && (
                <a href={socialLinks.twitter} className="text-white/40 hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.695L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {socialLinks?.linkedin && (
                <a href={socialLinks.linkedin} className="text-white/40 hover:text-white transition-colors" aria-label="LinkedIn">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
              {socialLinks?.instagram && (
                <a href={socialLinks.instagram} className="text-white/40 hover:text-white transition-colors" aria-label="Instagram">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C18.332 23.986 18.741 24 12 24c-3.259 0-3.668-.014-4.948-.072-4.354-.2-6.782-2.618-6.98-6.98-.059-1.28.073-1.687.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.979C5.332.014 4.923 0 12 0zm0 5.838a6.162 6.162 0 1 1 0 12.324 6.162 6.162 0 0 1 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
              )}
              {socialLinks?.facebook && (
                <a href={socialLinks.facebook} className="text-white/40 hover:text-white transition-colors" aria-label="Facebook">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-white">{column.title}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10 bg-white/8" />

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link href="/terms" className="transition-colors hover:text-white/70">
              Terms
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white/70">
              Privacy
            </Link>
            <Link href="/refund-policy" className="transition-colors hover:text-white/70">
              Refunds
            </Link>
            <Link href="/shipping" className="transition-colors hover:text-white/70">
              Shipping
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}