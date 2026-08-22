"use client";

import * as React from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ArrowRight,
  User,
  Package,
  MapPin,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CartToggle } from "@/components/shared/mini-cart";
import { useAuth } from "@/providers/auth-provider";

const primaryNav = [
  { label: "Home", href: "/" },
  { label: "Ship", href: "/ship" },
  { label: "Track", href: "/track" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Coverage", href: "/coverage" },
  { label: "About", href: "/about" },
];

const serviceCategories = [
  {
    title: "Delivery Services",
    description: "Fast, reliable shipping options",
    links: [
      { label: "Local Delivery", href: "/services/local-delivery" },
      { label: "Express Delivery", href: "/services/express-delivery" },
      { label: "Same-Day Delivery", href: "/services/same-day-delivery" },
      { label: "Nationwide Delivery", href: "/services/nationwide-delivery" },
    ],
  },
  {
    title: "Business Solutions",
    description: "Scale your logistics operations",
    links: [
      { label: "E-commerce Shipping", href: "/services/ecommerce-shipping" },
      { label: "Bulk Shipping", href: "/services/bulk-shipping" },
      { label: "API Integration", href: "/services/api-integration" },
      { label: "Custom Solutions", href: "/services/custom-solutions" },
    ],
  },
  {
    title: "Specialized",
    description: "Tailored delivery for unique needs",
    links: [
      { label: "Fragile Items", href: "/services/fragile-items" },
      { label: "Cold Chain", href: "/services/cold-chain" },
      { label: "High Value", href: "/services/high-value" },
      { label: "International", href: "/services/international-shipping" },
    ],
  },
  {
    title: "Tools & Resources",
    description: "Manage shipments efficiently",
    links: [
      { label: "Get a Quote", href: "/quote" },
      { label: "Schedule Pickup", href: "/schedule" },
      { label: "Shipping Calculator", href: "/calculator" },
      { label: "API Docs", href: "/docs" },
    ],
  },
];

export function Header({
  siteName = "Send Clouding",
  logoUrl,
  logoAlt = siteName,
}: {
  siteName?: string;
  logoUrl?: string | null;
  logoAlt?: string;
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [megaOpen, setMegaOpen] = React.useState<string | null>(null);
  const { user } = useAuth();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (!megaOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!(e.target as Element | null)?.closest?.("[data-services-megamenu]")) {
        setMegaOpen(null);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [megaOpen]);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, searchOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass" : "bg-white"
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={logoAlt}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-white">
                <Package className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight text-foreground">
                  {siteName}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-secondary">
                  Ship • Track • Deliver
                </span>
              </span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center lg:flex" aria-label="Primary">
          <ul className="flex items-center gap-0.5">
            {primaryNav.map((item) => (
              <li
                key={item.label}
                className="group relative"
                data-services-megamenu={item.label === "Services" ? "true" : undefined}
                onMouseEnter={() => {
                  if (item.label === "Services") setMegaOpen("services");
                }}
                onMouseLeave={() => setMegaOpen(null)}
              >
                <Link
                  href={item.href}
                  onClick={(e) => {
                    if (item.label !== "Services") return;
                    e.preventDefault();
                    setMegaOpen((v) => (v === "services" ? null : "services"));
                  }}
                  aria-expanded={item.label === "Services" ? megaOpen === "services" : undefined}
                  aria-haspopup={item.label === "Services" ? "menu" : undefined}
                  className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                  {item.label === "Services" && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        megaOpen === "services" && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </Link>

                {/* Services Mega Menu */}
                {item.label === "Services" && (
                  <div
                    className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3"
                    onMouseEnter={() => setMegaOpen("services")}
                    onMouseLeave={() => setMegaOpen(null)}
                  >
                    <div
                      className={cn(
                        "w-[48rem] translate-y-2 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        megaOpen === "services" ? "visible translate-y-0 opacity-100" : "invisible"
                      )}
                    >
                      <div className="grid grid-cols-4 gap-5 rounded-2xl border border-border bg-white p-6 shadow-xl">
                        {serviceCategories.map((col) => (
                          <div key={col.title}>
                            <p className="mb-1 text-sm font-semibold text-foreground">
                              {col.title}
                            </p>
                            <p className="mb-3 text-[11px] text-muted-foreground">
                              {col.description}
                            </p>
                            <ul className="space-y-1">
                              {col.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setMegaOpen(null)}
                                    className="block rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary-50 hover:text-secondary-700"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div className="col-span-4 flex items-center justify-between rounded-xl bg-secondary-50 px-4 py-3">
                          <p className="text-sm font-medium text-secondary-700">
                            <Truck className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
                            Need a custom solution?
                          </p>
                          <Link
                            href="/contact"
                            onClick={() => setMegaOpen(null)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-secondary transition-colors hover:text-secondary-700"
                          >
                            Contact Sales <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/track"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground/75 transition-colors hover:bg-muted sm:inline-flex"
            aria-label="Track Shipment"
          >
            <MapPin className="h-5 w-5" />
          </Link>
          <Button size="sm" className="hidden bg-secondary text-white hover:bg-secondary-600 lg:inline-flex" asChild>
            <Link href="/ship">Ship a Package</Link>
          </Button>
          <Link
            href={user ? "/account" : "/auth/login"}
            aria-label={user ? "My Account" : "Sign In"}
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-foreground/75 transition-colors hover:bg-muted sm:inline-flex"
          >
            <User className="h-5 w-5" />
          </Link>
          <CartToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "grid overflow-hidden border-t border-border bg-white transition-[grid-template-rows] duration-300 ease-out lg:hidden",
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-transparent"
        )}
      >
        <div className="min-h-0 max-h-[calc(100dvh-4.25rem)] overflow-y-auto overscroll-contain">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {primaryNav.map((item) =>
              item.label === "Services" ? (
                <div key={item.label} className="rounded-xl">
                  <button
                    type="button"
                    aria-expanded={mobileServicesOpen}
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Services
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        mobileServicesOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300 ease-out",
                      mobileServicesOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="px-2 pb-3">
                        {serviceCategories.map((cat) => (
                          <div key={cat.title} className="mt-3">
                            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                              {cat.title}
                            </p>
                            <ul className="mt-1 space-y-0.5">
                              {cat.links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    onClick={() => {
                                      setMobileOpen(false);
                                      setMobileServicesOpen(false);
                                    }}
                                    className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="mt-2 border-t border-border pt-4">
              <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Actions
              </p>
              <div className="flex gap-2 px-4">
                <Button size="sm" className="flex-1 bg-secondary text-white hover:bg-secondary-600" asChild>
                  <Link href="/ship" onClick={() => setMobileOpen(false)}>Ship a Package</Link>
                </Button>
                <Button size="sm" variant="outline" className="flex-1" asChild>
                  <Link href="/track" onClick={() => setMobileOpen(false)}>Track Shipment</Link>
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 w-full"
                asChild
                onClick={() => setMobileOpen(false)}
              >
                <Link href="/quote">Get a Quote</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}