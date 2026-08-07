"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, MapPin, Heart, Settings, LogOut, ShoppingBag, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/account", icon: ShoppingBag },
  { label: "My Profile", href: "/account/profile", icon: User },
  { label: "My Orders", href: "/account/orders", icon: Package },
  { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <section className="bg-white py-24">
        <Container>
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </Container>
      </section>
    );
  }

  if (!user) return null;

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <Container>
        {/* Mobile nav toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mb-6 flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-sm font-medium lg:hidden"
        >
          <span className="flex items-center gap-2">
            {navItems.find(i => i.href === pathname)?.icon && <span>{React.createElement(navItems.find(i => i.href === pathname)!.icon, { className: "h-4 w-4" })}</span>}
            {navItems.find(i => i.href === pathname)?.label || "Account"}
          </span>
          <ChevronRight className={cn("h-4 w-4 transition-transform", mobileOpen && "rotate-90")} />
        </button>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr] lg:gap-16">
          {/* Sidebar */}
          <aside className={cn("lg:block", mobileOpen ? "block" : "hidden")}>
            <div className="lg:sticky lg:top-24">
              <div className="mb-4 flex items-center gap-3 px-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Separator className="my-3" />
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary-50 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Separator className="my-3" />
              <button
                type="button"
                onClick={async () => { await logout(); router.replace("/auth/login"); }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/5 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </section>
  );
}
