import React from "react";
import type { ServerProps } from "payload";
import { getShipmentStatusLabel } from "@/lib/shipments/statuses";
import "./dashboard.css";

const STATUS_TONES: Record<string, string> = {
  created: "blue",
  "pickup-scheduled": "blue",
  "picked-up": "aqua",
  "in-transit": "aqua",
  "out-for-delivery": "aqua",
  delivered: "green",
  delayed: "neutral",
  exception: "neutral",
  cancelled: "neutral",
  returned: "neutral",
};

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

function groupValue(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object" && value !== null && "name" in value) {
    return String((value as { name: unknown }).name);
  }
  return null;
}

export default async function LogisticsDashboard(props: ServerProps) {
  const { payload } = props;

  const [totalRes, activeRes, deliveredRes, delayedRes, recentRes, activityRes] =
    await Promise.all([
      payload.count({ collection: "shipments" }),
      payload.count({
        collection: "shipments",
        where: { status: { in: ["picked-up", "in-transit", "out-for-delivery"] } },
      }),
      payload.count({
        collection: "shipments",
        where: { status: { equals: "delivered" } },
      }),
      payload.count({
        collection: "shipments",
        where: { status: { in: ["delayed", "exception"] } },
      }),
      payload.find({
        collection: "shipments",
        limit: 7,
        sort: "-createdAt",
        depth: 1,
      }),
      payload
        .find({ collection: "tracking-events", limit: 8, sort: "-dateTime", depth: 1 })
        .catch(() => ({ docs: [] as any[] })),
    ]);

  const kpis = [
    { label: "Total Shipments", value: totalRes.totalDocs.toLocaleString(), tone: "blue" },
    { label: "In Transit", value: activeRes.totalDocs.toLocaleString(), tone: "aqua" },
    { label: "Delivered", value: deliveredRes.totalDocs.toLocaleString(), tone: "green" },
    { label: "Delayed / Exception", value: delayedRes.totalDocs.toLocaleString(), tone: "neutral" },
  ];

  const activities = (activityRes.docs || []).map((e: any) => ({
    id: `evt-${e.id}`,
    label: `${getShipmentStatusLabel(e.status)}`,
    meta: groupValue(e.location) ?? "",
    date: e.dateTime ?? e.createdAt,
    tone: STATUS_TONES[e.status] ?? "blue",
  }));

  return (
    <div className="ab-dashboard">
      <div className="ab-dashboard__header">
        <div>
          <h2 className="ab-dashboard__title">Operations Overview</h2>
          <p className="ab-dashboard__subtitle">
            Live view across the Send Clouding courier network.
          </p>
        </div>
      </div>

      <div className="ab-kpi-grid">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`ab-kpi ab-kpi--${kpi.tone}`}>
            <div className="ab-kpi__body">
              <span className="ab-kpi__label">{kpi.label}</span>
              <span className="ab-kpi__value">{kpi.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ab-dashboard__grid">
        <section className="ab-panel">
          <header className="ab-panel__header">
            <h3>Recent Shipments</h3>
            <a href="/admin/collections/shipments" className="ab-panel__link">
              View all
            </a>
          </header>
          <div className="ab-table-wrap">
            <table className="ab-table">
              <thead>
                <tr>
                  <th>Tracking</th>
                  <th>Route</th>
                  <th>Recipient</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRes.docs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="ab-table__empty">
                      No shipments yet.
                    </td>
                  </tr>
                ) : (
                  recentRes.docs.map((s: any) => (
                    <tr key={s.id}>
                      <td>
                        <a href={`/admin/collections/shipments/${s.id}`} className="ab-table__link">
                          {s.trackingNumber}
                        </a>
                      </td>
                      <td>
                        {groupValue(s.origin) ?? "—"} <span>→</span> {groupValue(s.destination) ?? "—"}
                      </td>
                      <td>{s.recipient?.name ?? "—"}</td>
                      <td>
                        <span className={`ab-pill ab-pill--${s.status}`}>
                          {getShipmentStatusLabel(s.status)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ab-panel">
          <header className="ab-panel__header">
            <h3>Latest Tracking Activity</h3>
          </header>
          <ul className="ab-activity">
            {activities.length === 0 ? (
              <li className="ab-list__empty">No tracking events yet.</li>
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
    </div>
  );
}