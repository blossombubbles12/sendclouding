import Link from "next/link";
import { PenTool, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-section-heading text-foreground">
        Hello, {user?.name?.split(" ")[0] || "there"}
      </h1>
      <p className="text-body mt-2">Welcome to your Signages.ng dashboard.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/account/orders"
          className="group rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <Package className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">My Orders</h2>
          <p className="mt-1 text-sm text-muted-foreground">Track and manage your print orders</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-secondary group-hover:underline">
            View orders <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <Link
          href="/account/wishlist"
          className="group rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <PenTool className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">Wishlist</h2>
          <p className="mt-1 text-sm text-muted-foreground">Products you&apos;ve saved for later</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:underline">
            View wishlist <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        <Link
          href="/products"
          className="group rounded-2xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-highlight/10 text-highlight">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">Start Designing</h2>
          <p className="mt-1 text-sm text-muted-foreground">Browse products and customize your prints</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-highlight-600 group-hover:underline">
            Browse products <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}
