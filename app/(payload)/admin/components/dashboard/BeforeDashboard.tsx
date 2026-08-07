import React from "react";
import type { ServerProps } from "payload";
import { formatCurrency } from "@/lib/utils";
import "./dashboard.css";

type IconName = "products" | "orders" | "revenue" | "customers" | "stock";

function KpiIcon({ name }: { name: IconName }) {
  const common = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;
  switch (name) {
    case "products":
      return (
        <svg {...common}>
          <path d="M21 8 12 3 3 8l9 5 9-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M3 8v8l9 5 9-5V8" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M12 13v8" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "orders":
      return (
        <svg {...common}>
          <path d="M6 6h15l-1.5 9h-12L6 3H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9.5" cy="20" r="1.4" fill="currentColor" />
          <circle cx="17.5" cy="20" r="1.4" fill="currentColor" />
        </svg>
      );
    case "revenue":
      return (
        <svg {...common}>
          <path d="M12 2v20M17 6.5c0-1.9-2.2-3.5-5-3.5s-5 1.6-5 3.5 2.2 3 5 3.5 5 1.6 5 3.5-2.2 3.5-5 3.5-5-1.6-5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "customers":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 20c0-3.6 2.7-6 6-6s6 2.4 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M16 8.2a3 3 0 1 1 3.3 5.9M21 20c-.2-2.7-1.7-4.7-4-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "stock":
      return (
        <svg {...common}>
          <path d="M3 7.5 12 3l9 4.5-9 4.5-9-4.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M3 7.5v9L12 21l9-4.5v-9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
  }
}

function KpiCard({
  label,
  value,
  hint,
  icon,
  tone,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: IconName;
  tone: "blue" | "aqua" | "green" | "neutral";
}) {
  return (
    <div className={`ab-kpi ab-kpi--${tone}`}>
      <div className="ab-kpi__icon">
        <KpiIcon name={icon} />
      </div>
      <div className="ab-kpi__body">
        <span className="ab-kpi__label">{label}</span>
        <span className="ab-kpi__value">{value}</span>
        {hint ? <span className="ab-kpi__hint">{hint}</span> : null}
      </div>
    </div>
  );
}

function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

export default async function BeforeDashboard(props: ServerProps) {
  const { payload } = props;

  const [
    productsCount,
    ordersCount,
    customersCount,
    recentOrdersRes,
    revenueOrdersRes,
    lowStockRes,
    recentMessagesRes,
    recentPostsRes,
  ] = await Promise.all([
    payload.count({ collection: "products" }),
    payload.count({ collection: "orders" }),
    payload.count({ collection: "customers" }),
    payload.find({
      collection: "orders",
      limit: 6,
      sort: "-createdAt",
      depth: 1,
    }),
    payload.find({
      collection: "orders",
      limit: 500,
      depth: 0,
      where: { paymentStatus: { equals: "paid" } },
      select: { total: true },
    }),
    payload.find({
      collection: "products",
      limit: 200,
      depth: 0,
      where: { "inventory.trackInventory": { equals: true } },
      select: { name: true, inventory: true, sku: true },
    }),
    payload
      .find({ collection: "contact-messages", limit: 4, sort: "-createdAt", depth: 0 })
      .catch(() => ({ docs: [] as any[] })),
    payload
      .find({ collection: "posts", limit: 4, sort: "-createdAt", depth: 0 })
      .catch(() => ({ docs: [] as any[] })),
  ]);

  const revenue = revenueOrdersRes.docs.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  const lowStock = (lowStockRes.docs as any[])
    .filter((p) => {
      const qty = p.inventory?.quantity ?? 0;
      const threshold = p.inventory?.lowStockThreshold ?? 10;
      return qty <= threshold;
    })
    .sort((a, b) => (a.inventory?.quantity ?? 0) - (b.inventory?.quantity ?? 0))
    .slice(0, 6);

  type Activity = { id: string; label: string; meta: string; date: string; tone: "blue" | "aqua" | "green" };
  const activities: Activity[] = [
    ...recentOrdersRes.docs.map((o: any) => ({
      id: `order-${o.id}`,
      label: `New order ${o.orderNumber ?? ""}`,
      meta: formatCurrency(o.total || 0),
      date: o.createdAt,
      tone: "blue" as const,
    })),
    ...(recentMessagesRes.docs || []).map((m: any) => ({
      id: `msg-${m.id}`,
      label: `Contact message from ${m.name ?? "a visitor"}`,
      meta: m.subject ?? "",
      date: m.createdAt,
      tone: "aqua" as const,
    })),
    ...(recentPostsRes.docs || []).map((p: any) => ({
      id: `post-${p.id}`,
      label: `Article "${p.title ?? "Untitled"}"`,
      meta: p._status ?? "",
      date: p.createdAt,
      tone: "green" as const,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return (
    <div className="ab-dashboard">
      <div className="ab-dashboard__header">
        <div>
          <h2 className="ab-dashboard__title">Welcome back 👋</h2>
          <p className="ab-dashboard__subtitle">
            Here&apos;s what&apos;s happening across AquaBest Brands today.
          </p>
        </div>
      </div>

      <div className="ab-kpi-grid">
        <KpiCard
          label="Total Products"
          value={productsCount.totalDocs.toLocaleString()}
          icon="products"
          tone="blue"
        />
        <KpiCard label="Total Orders" value={ordersCount.totalDocs.toLocaleString()} icon="orders" tone="aqua" />
        <KpiCard label="Revenue (Paid)" value={formatCurrency(revenue)} icon="revenue" tone="green" />
        <KpiCard
          label="Total Customers"
          value={customersCount.totalDocs.toLocaleString()}
          icon="customers"
          tone="neutral"
        />
      </div>

      <div className="ab-dashboard__grid">
        <section className="ab-panel">
          <header className="ab-panel__header">
            <h3>Recent Orders</h3>
            <a href="/admin/collections/orders" className="ab-panel__link">
              View all
            </a>
          </header>
          <div className="ab-table-wrap">
            <table className="ab-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrdersRes.docs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="ab-table__empty">
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  recentOrdersRes.docs.map((o: any) => (
                    <tr key={o.id}>
                      <td>
                        <a href={`/admin/collections/orders/${o.id}`} className="ab-table__link">
                          {o.orderNumber}
                        </a>
                      </td>
                      <td>
                        {o.customer && typeof o.customer === "object"
                          ? `${o.customer.firstName ?? ""} ${o.customer.lastName ?? ""}`.trim()
                          : "—"}
                      </td>
                      <td>
                        <span className={`ab-pill ab-pill--${o.status}`}>{o.status}</span>
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 600 }}>{formatCurrency(o.total || 0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ab-panel">
          <header className="ab-panel__header">
            <h3>Low Stock Products</h3>
            <a href="/admin/collections/products" className="ab-panel__link">
              View all
            </a>
          </header>
          <ul className="ab-list">
            {lowStock.length === 0 ? (
              <li className="ab-list__empty">All products are well stocked.</li>
            ) : (
              lowStock.map((p: any) => (
                <li key={p.id} className="ab-list__row">
                  <div className="ab-list__main">
                    <a href={`/admin/collections/products/${p.id}`} className="ab-table__link">
                      {p.name}
                    </a>
                    <span className="ab-list__sub">{p.sku ?? "No SKU"}</span>
                  </div>
                  <span
                    className={`ab-pill ${p.inventory?.quantity === 0 ? "ab-pill--cancelled" : "ab-pill--pending"}`}
                  >
                    {p.inventory?.quantity ?? 0} left
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <section className="ab-panel">
        <header className="ab-panel__header">
          <h3>Latest Activity</h3>
        </header>
        <ul className="ab-activity">
          {activities.length === 0 ? (
            <li className="ab-list__empty">Nothing has happened yet.</li>
          ) : (
            activities.map((a) => (
              <li key={a.id} className="ab-activity__row">
                <span className={`ab-activity__dot ab-activity__dot--${a.tone}`} />
                <div className="ab-activity__body">
                  <span className="ab-activity__label">{a.label}</span>
                  {a.meta ? <span className="ab-activity__meta">{a.meta}</span> : null}
                </div>
                <span className="ab-activity__time">{timeAgo(a.date)}</span>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
