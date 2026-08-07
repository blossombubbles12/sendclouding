"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Package, Loader2, Truck, CheckCircle, Clock, XCircle, RotateCcw, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingMethod?: { id: string; name: string; zone?: string };
  items: { id: string; name: string; sku: string; quantity: number; price: number; total: number }[];
  shippingAddress: { fullName: string; address: string; city: string; state: string; postalCode: string; country: string; phone: string };
  trackingNumber?: string;
  trackingUrl?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const statusLabels: Record<string, string> = {
  pending: "Pending", confirmed: "Confirmed", processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded",
};

function formatPaymentMethod(method: string): string {
  switch (method) {
    case "cod": return "Cash on Delivery";
    case "paystack": return "Paystack";
    case "bank_transfer": return "Bank Transfer";
    default:
      if (method?.startsWith("paystack_")) return "Paystack";
      return method || "N/A";
  }
}

const statusSteps = ["pending", "confirmed", "processing", "shipped", "delivered"];

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  refunded: RotateCcw,
};

function TrackingTimeline({ status }: { status: string }) {
  const currentIdx = statusSteps.indexOf(status);
  const isCancelled = status === "cancelled" || status === "refunded";

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <h3 className="mb-5 text-sm font-semibold text-foreground">Order Timeline</h3>
      {isCancelled ? (
        <div className="flex items-center gap-3 rounded-xl bg-destructive/5 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-destructive">{statusLabels[status]}</p>
            <p className="text-xs text-muted-foreground">This order has been {status}.</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {statusSteps.map((step, idx) => {
            const done = idx <= currentIdx;
            const Icon = statusIcons[step] || Clock;
            return (
              <div key={step} className="flex items-start gap-4 pb-6 last:pb-0">
                <div className="relative flex flex-col items-center">
                  <div className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-colors", done ? "bg-accent text-white" : "bg-muted text-muted-foreground")}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div className={cn("absolute top-8 h-[calc(100%+8px)] w-0.5", done ? "bg-accent" : "bg-muted")} />
                  )}
                </div>
                <div className="pt-1">
                  <p className={cn("text-sm font-semibold", done ? "text-foreground" : "text-muted-foreground")}>
                    {statusLabels[step]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {idx === 0 && "Order placed and awaiting confirmation"}
                    {idx === 1 && "Payment received, order confirmed"}
                    {idx === 2 && "Order is being prepared"}
                    {idx === 3 && "Order is on its way to you"}
                    {idx === 4 && "Package delivered successfully"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailsPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = React.useState<OrderDetail | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("aquabest-token");
        const res = await fetch(`/api/orders?where[orderNumber][equals]=${orderNumber}&depth=2`, {
          headers: token ? { Authorization: `JWT ${token}` } : {},
        });
        const data = await res.json();
        setOrder(data.docs[0] || null);
      } catch {} finally { setLoading(false); }
    })();
  }, [orderNumber]);

  if (loading) return <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  if (!order) return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <Package className="h-12 w-12 text-muted-foreground" />
      <p className="text-lg font-medium text-foreground">Order not found</p>
      <Button asChild variant="outline"><Link href="/account/orders">Back to Orders</Link></Button>
    </div>
  );

  const statusBadgeClass: Record<string, string> = {
    pending: "bg-highlight/10 text-highlight",
    confirmed: "bg-primary-50 text-primary",
    processing: "bg-secondary/10 text-secondary-700",
    shipped: "bg-accent/10 text-accent",
    delivered: "bg-accent/10 text-accent",
    cancelled: "bg-destructive/10 text-destructive",
    refunded: "bg-muted text-muted-foreground",
  };

  return (
    <div>
      <Link href="/account/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title text-foreground">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" asChild>
            <a href={`/api/invoice?order=${order.orderNumber}`} target="_blank" rel="noopener">
              <FileText className="mr-1.5 h-4 w-4" /> Invoice
            </a>
          </Button>
          <span className={cn("rounded-full px-4 py-1.5 text-sm font-medium", statusBadgeClass[order.status] || "bg-muted")}>
            {statusLabels[order.status] || order.status}
          </span>
        </div>
      </div>
      <Separator className="my-6" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {/* Items */}
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Items</h2>
            <div className="overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr><th className="px-5 py-3 font-medium">Product</th><th className="px-5 py-3 text-center">Qty</th><th className="px-5 py-3 text-right">Price</th><th className="px-5 py-3 text-right">Total</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-3">
                        <p className="font-medium text-foreground">{item.name}</p>
                        {item.sku && <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>}
                      </td>
                      <td className="px-5 py-3 text-center">{item.quantity}</td>
                      <td className="px-5 py-3 text-right">{formatCurrency(item.price)}</td>
                      <td className="px-5 py-3 text-right font-medium">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="rounded-2xl border border-border bg-secondary/5 p-5">
              <div className="flex items-center gap-2 mb-1"><Truck className="h-4 w-4 text-accent-600" /><h3 className="font-semibold text-foreground">Tracking Information</h3></div>
              <p className="text-sm text-muted-foreground">Tracking Number: <span className="font-mono font-medium text-foreground">{order.trackingNumber}</span></p>
              {order.trackingUrl && <a href={order.trackingUrl} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">Track Package</a>}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-white p-5">
            <h3 className="font-semibold text-foreground">Summary</h3>
            <Separator className="my-3" />
            <div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatCurrency(order.tax)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{formatCurrency(order.shipping)}</span></div>
            {order.shippingMethod?.name && (
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span className="font-medium text-foreground">{order.shippingMethod.name}{order.shippingMethod.zone ? ` (${order.shippingMethod.zone})` : ""}</span></div>
            )}
            <Separator className="my-2" /><div className="flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(order.total)}</span></div></div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span className="font-medium uppercase text-foreground">{order.paymentStatus}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="font-medium text-foreground">{formatPaymentMethod(order.paymentMethod)}</span></div>
            </div>
          </div>

          {order.shippingAddress && (
            <div className="rounded-2xl border border-border bg-white p-5">
              <h3 className="font-semibold text-foreground">Shipping Address</h3>
              <Separator className="my-3" />
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </div>
          )}

          <TrackingTimeline status={order.status} />
        </div>
      </div>
    </div>
  );
}
