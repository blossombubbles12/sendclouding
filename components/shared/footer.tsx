import Link from "next/link";
import { PenTool, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Outdoor Banners", href: "/products?category=outdoor-banners" },
      { label: "Business Cards", href: "/products?category=business-cards" },
      { label: "Custom T-Shirts", href: "/products?category=t-shirts" },
      { label: "Roll-up Banners", href: "/products?category=roll-up-banners" },
      { label: "View All Products", href: "/products" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Corporate Solutions", href: "/corporate" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQs", href: "/faq" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Track Order", href: "/track-order" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export function Footer({
  siteName = "Signages.ng",
  siteDescription = "Nigeria's premium print-on-demand platform. Design, personalize, and print professional signage, banners, business cards, and promotional materials. Quality printing, delivered anywhere in Nigeria.",
  logoUrl,
  logoAlt = siteName,
  contactEmail = "hello@signages.ng",
  contactPhone = "+234 800 000 0000",
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
    <footer className="bg-primary-900 text-white">
      <Container className="py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={logoAlt}
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
              ) : (
                <>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <PenTool className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col leading-none">
                    <span className="text-base font-bold tracking-tight">{siteName}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-secondary">
                      Print on Demand
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
          </div>
        </div>
      </Container>
    </footer>
  );
}
