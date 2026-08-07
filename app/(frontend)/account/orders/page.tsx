"use client";

import * as React from "react";
import Link from "next/link";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface OrderItem {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-highlight/10 text-highlight" },
  confirmed: { label: "Confirmed", color: "bg-primary-50 text-primary" },
  processing: { label: "Processing", color: "bg-secondary/10 text-secondary-700" },
  shipped: { label: "Shipped", color: "bg-accent/10 text-accent" },
  delivered: { label: "Delivered", color: "bg-accent/10 text-accent" },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive" },
  refunded: { label: "Refunded", color: "bg-muted text-muted-foreground" },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<OrderItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("aquabest-token");
        const res = await fetch("/api/orders?depth=0&sort=-createdAt", {
          headers: { Authorization: `JWT ${token}` },
        });
        const data = await res.json();
        setOrders(data.docs || []);
      } catch {} finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1 className="text-section-heading text-foreground">My Orders</h1>
      <p className="text-body mt-2">Track and review your order history.</p>
      <Separator className="my-6" />

      {loading ? (
        <p className="text-muted-foreground">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          <p className="text-lg font-medium text-foreground">No orders yet</p>
          <p className="text-sm text-muted-foreground">Start shopping to see your orders here.</p>
          <Button asChild className="mt-2"><Link href="/products">Browse Products</Link></Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = statusLabels[order.status] || { label: order.status, color: "bg-muted" };
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.orderNumber}`}
                className="flex items-center justify-between rounded-2xl border border-border bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.color}`}>{s.label}</span>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(order.total)}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
