"use client";

import React from "react";
import type { DefaultCellComponentProps } from "payload";

type Tone = "success" | "info" | "warning" | "danger" | "neutral" | "brand";

const TONE_STYLES: Record<Tone, { bg: string; fg: string; dot: string }> = {
  success: { bg: "rgba(76, 175, 80, 0.14)", fg: "#2E7D32", dot: "#4CAF50" },
  info: { bg: "rgba(0, 174, 239, 0.14)", fg: "#00618a", dot: "#00AEEF" },
  warning: { bg: "rgba(245, 158, 11, 0.16)", fg: "#92610a", dot: "#F59E0B" },
  danger: { bg: "rgba(220, 38, 38, 0.14)", fg: "#B91C1C", dot: "#DC2626" },
  neutral: { bg: "var(--theme-elevation-100)", fg: "var(--theme-elevation-600)", dot: "var(--theme-elevation-400)" },
  brand: { bg: "rgba(0, 59, 115, 0.12)", fg: "#003B73", dot: "#003B73" },
};

/** Maps known status values (across Orders, Products, Customers) to a visual tone. */
const STATUS_TONE_MAP: Record<string, Tone> = {
  // Orders.status
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "brand",
  delivered: "success",
  cancelled: "danger",
  refunded: "neutral",
  // Orders.paymentStatus
  paid: "success",
  failed: "danger",
  // Products.status / Customers.status
  active: "success",
  inactive: "neutral",
  draft: "warning",
  outOfStock: "danger",
  blocked: "danger",
  // generic publish states
  published: "success",
  // Shipments.status / TrackingEvents.status (see lib/shipments/statuses.ts)
  created: "info",
  "pickup-scheduled": "info",
  "picked-up": "brand",
  "in-transit": "brand",
  "out-for-delivery": "brand",
  delayed: "warning",
  exception: "danger",
  returned: "neutral",
};

function formatLabel(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

export function StatusBadge(props: DefaultCellComponentProps) {
  const raw = props.cellData;
  const value = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : String(raw ?? "");

  if (!value) {
    return <span style={{ color: "var(--theme-elevation-400)" }}>—</span>;
  }

  const tone = STATUS_TONE_MAP[value] ?? "neutral";
  const { bg, fg, dot } = TONE_STYLES[tone];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "3px 10px 3px 8px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 600,
        letterSpacing: "0.01em",
        lineHeight: "18px",
        background: bg,
        color: fg,
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: dot,
          flexShrink: 0,
        }}
      />
      {formatLabel(value)}
    </span>
  );
}

export default StatusBadge;
