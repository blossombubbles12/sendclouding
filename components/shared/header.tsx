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
  PenTool,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CartToggle } from "@/components/shared/mini-cart";
import { useAuth } from "@/providers/auth-provider";

const primaryNav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products", megaMenu: true },
  { label: "Business", href: "/products?category=business" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const megaMenuColumns = [
  {
    title: "Signage & Banners",
    description: "Outdoor and indoor signage",
    links: [
      { label: "Outdoor Banners", href: "/products?category=outdoor-banners" },
      { label: "Roll-up Banners", href: "/products?category=roll-up-banners" },
      { label: "Vinyl Signs", href: "/products?category=vinyl-signs" },
      { label: "LED Signage", href: "/products?category=led-signage" },
    ],
  },
  {
    title: "Print & Stationery",
    description: "Business essentials",
    links: [
      { label: "Business Cards", href: "/products?category=business-cards" },
      { label: "Flyers & Brochures", href: "/products?category=flyers-brochures" },
      { label: "Letterheads", href: "/products?category=letterheads" },
      { label: "Stickers & Labels", href: "/products?category=stickers-labels" },
    ],
  },
  {
    title: "Promotional",
    description: "Brand merchandise",
    links: [
      { label: "Custom T-Shirts", href: "/products?category=t-shirts" },
      { label: "Branded Mugs", href: "/products?category=mugs" },
      { label: "Caps & Hats", href: "/products?category=caps" },
      { label: "Tote Bags", href: "/products?category=tote-bags" },
    ],
  },
  {
    title: "Corporate Solutions",
    description: "Large format & bulk",
    links: [
      { label: "Wall Graphics", href: "/products?category=wall-graphics" },
      { label: "Vehicle Branding", href: "/products?category=vehicle-branding" },
      { label: "Event Branding", href: "/products?category=event-branding" },
      { label: "Bulk Printing", href: "/corporate" },
    ],
  },
];

export function Header({
  siteName = "Signages.ng",
  logoUrl,
  logoAlt = siteName,
}: {
  siteName?: string;
  logoUrl?: string | null;
  logoAlt?: string;
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { user } = useAuth();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
              className="h-8 w-auto object-contain"
            />
          ) : (
            <>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-white">
                <PenTool className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight text-foreground">
                  {siteName}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-secondary">
                  Print on Demand
                </span>
              </span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center lg:flex" aria-label="Primary">
          <ul className="flex items-center gap-0.5">
            {primaryNav.map((item) => (
              <li key={item.label} className={cn("group relative", item.megaMenu && "static")}>
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-foreground/75 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                  {item.megaMenu && (
                    <ChevronDown
                      className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180"
                      aria-hidden="true"
                    />
                  )}
                </Link>

                {/* Mega Menu */}
                {item.megaMenu && (
                  <div
                    className={cn(
                      "invisible absolute left-1/2 top-full z-50 w-[48rem] -translate-x-1/2 translate-y-2 opacity-0",
                      "transition-all duration-300 ease-out",
                      "group-hover:visible group-hover:translate-y-3 group-hover:opacity-100",
                      "group-focus-within:visible group-focus-within:translate-y-3 group-focus-within:opacity-100"
                    )}
                  >
                    <div className="grid grid-cols-4 gap-5 rounded-2xl border border-border bg-white p-6 shadow-xl">
                      {megaMenuColumns.map((col) => (
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
                          <Sparkles className="mr-1.5 inline h-3.5 w-3.5" aria-hidden="true" />
                          New: Design your own signage with our online tool
                        </p>
                        <Link
                          href="/products"
                          className="inline-flex items-center gap-1 text-sm font-semibold text-secondary transition-colors hover:text-secondary-700"
                        >
                          Try it now <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
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
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground/75 transition-colors hover:bg-muted sm:inline-flex"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href={user ? "/account" : "/auth/login"}
            aria-label={user ? "My Account" : "Sign In"}
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-foreground/75 transition-colors hover:bg-muted sm:inline-flex"
          >
            <User className="h-5 w-5" />
          </Link>
          <CartToggle />
          <Button size="sm" className="hidden bg-secondary text-white hover:bg-secondary-600 lg:inline-flex">
            Start Designing
          </Button>
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

      {/* Search overlay */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSearchOpen(false)}
          />
          <div className="absolute left-0 top-full z-50 w-full border-b border-border bg-white px-4 pb-6 pt-4 shadow-lg lg:max-w-xl lg:rounded-2xl lg:border lg:shadow-xl lg:left-auto lg:right-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search signage, banners, business cards..."
                className="w-full rounded-xl border border-border bg-muted py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                }}
              />
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick links
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  "Business Cards",
                  "Outdoor Banners",
                  "Custom T-Shirts",
                  "Roll-up Banners",
                ].map((term) => (
                  <Link
                    key={term}
                    href={`/products?q=${encodeURIComponent(term)}`}
                    onClick={() => setSearchOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile menu */}
      <div
        className={cn(
          "grid overflow-hidden border-t border-border bg-white transition-[grid-template-rows] duration-300 ease-out lg:hidden",
          mobileOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-transparent"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {primaryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-border pt-4">
              <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Categories
              </p>
              {megaMenuColumns.map((col) => (
                <div key={col.title} className="mb-1">
                  <p className="px-4 py-1 text-sm font-semibold text-foreground">{col.title}</p>
                  {col.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-8 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
            <Button
              size="lg"
              className="mt-4 w-full bg-secondary text-white hover:bg-secondary-600"
              onClick={() => setMobileOpen(false)}
            >
              Start Designing
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
