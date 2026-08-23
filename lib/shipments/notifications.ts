import type { PayloadRequest } from "payload";
import { getShipmentStatusLabel } from "./statuses";

function nameOf(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object" && value !== null && "name" in value) {
    return String((value as { name: unknown }).name);
  }
  return null;
}

function trackingUrl(trackingNumber: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base}/track?tn=${encodeURIComponent(trackingNumber)}`;
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;color:#64748b;font-size:14px;width:180px;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${value}</td>
  </tr>`;
}

function buildShipmentEmailHtml(data: ShipmentNotificationData): string {
  const statusLabel = getShipmentStatusLabel(data.status);
  const emoji =
    data.status === "delivered" ? "✅" : data.status === "delayed" ? "⚠️" : "📦";
  const accent = data.status === "delivered" ? "#10B981" : "#F59E0B";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:24px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;">
        <!-- Brand header -->
        <tr><td style="background:#0F172A;padding:28px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;">Send <span style="color:#0EA5E9;">Clouding</span></p>
                <p style="margin:4px 0 0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#94A3B8;">Courier · Tracking · Logistics</p>
              </td>
              <td align="right">
                <span style="display:inline-block;padding:8px 14px;border-radius:999px;background:${accent};color:#0F172A;font-size:13px;font-weight:700;">${emoji} ${statusLabel}</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="margin:0 0 6px;font-size:15px;color:#334155;line-height:1.6;">
            Hi ${data.recipientName || "there"},
          </p>
          <p style="margin:0 0 22px;font-size:15px;color:#334155;line-height:1.6;">
            Your shipment <strong style="color:#0F172A;">${data.trackingNumber}</strong> is now
            <strong style="color:#0F172A;">${statusLabel}</strong>.
          </p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:18px 22px;">
            ${row("Tracking Number", `<span style="font-family:Menlo,Consolas,monospace;">${data.trackingNumber}</span>`)}
            ${row("Status", statusLabel)}
            ${row("Route", `${data.origin ?? "—"} → ${data.destination ?? "—"}`)}
            ${row("Current Location", data.currentLocation ?? "—")}
            ${row("Estimated Delivery", formatDate(data.estimatedDelivery))}
            ${data.packageDescription ? row("Package", data.packageDescription) : ""}
          </table>

          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 0;">
            <tr>
              <td style="border-radius:10px;background:#0EA5E9;padding:13px 26px;">
                <a href="${trackingUrl(data.trackingNumber)}" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;display:inline-block;">Track your shipment →</a>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:22px 32px;">
          <p style="margin:0;font-size:12px;color:#64748B;line-height:1.7;">
            <strong style="color:#0F172A;">Send Clouding</strong> — Courier &amp; Logistics<br/>
            Amsterdam, Netherlands · <a href="mailto:contact@sendclouding.com" style="color:#0EA5E9;text-decoration:none;">contact@sendclouding.com</a>
          </p>
          <p style="margin:10px 0 0;font-size:11px;color:#94A3B8;line-height:1.5;">
            This is an automated notification from Send Clouding. Please do not reply to this email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export interface ShipmentNotificationData {
  trackingNumber: string;
  status: string;
  recipientName: string;
  recipientEmail: string;
  origin?: string | null;
  destination?: string | null;
  currentLocation?: string | null;
  estimatedDelivery?: string | null;
  packageDescription?: string | null;
}

/** Extracts notification data from a shipment document. */
export function shipmentNotificationData(doc: Record<string, unknown>): ShipmentNotificationData {
  const recipient = (doc.recipient as Record<string, unknown> | undefined) ?? {};
  const pkg = (doc.package as Record<string, unknown> | undefined) ?? {};
  return {
    trackingNumber: String(doc.trackingNumber ?? ""),
    status: String(doc.status ?? "created"),
    recipientName: String(recipient.name ?? ""),
    recipientEmail: String(recipient.email ?? ""),
    origin: nameOf(doc.origin),
    destination: nameOf(doc.destination),
    currentLocation: nameOf(doc.currentLocation),
    estimatedDelivery: (doc.estimatedDelivery as string | undefined) ?? null,
    packageDescription: pkg.description ? String(pkg.description) : null,
  };
}

/**
 * Sends a status-update email to the shipment recipient. Best-effort:
 * failures are logged but never fail the underlying operation.
 */
export async function sendShipmentNotification(
  req: PayloadRequest,
  doc: Record<string, unknown>
): Promise<void> {
  const data = shipmentNotificationData(doc);
  if (!data.recipientEmail || !data.trackingNumber) return;

  const statusLabel = getShipmentStatusLabel(data.status);
  const subject =
    data.status === "delivered"
      ? `Your shipment ${data.trackingNumber} has been delivered`
      : data.status === "delayed"
        ? `Shipment ${data.trackingNumber} is delayed`
        : `Shipment ${data.trackingNumber}: ${statusLabel}`;

  try {
    await req.payload.sendEmail({
      to: data.recipientEmail,
      subject,
      html: buildShipmentEmailHtml(data),
    });
  } catch (err) {
    console.error("[shipments] failed to send notification email:", err);
  }
}