import { NextRequest, NextResponse } from "next/server";

interface ShipmentDoc {
  id: number;
  trackingNumber?: string;
  status?: string;
  createdAt?: string;
  sender?: { name?: string; company?: string; phone?: string; email?: string };
  recipient?: { name?: string; company?: string; phone?: string; email?: string };
  origin?: { name?: string; address?: string; city?: string; country?: string } | number;
  destination?: { name?: string; address?: string; city?: string; country?: string } | number;
  currentLocation?: { name?: string } | number;
  deliveryService?: { name?: string; baseFee?: number } | number;
  estimatedDelivery?: string | null;
  package?: {
    description?: string;
    content?: string;
    quantity?: number;
    weight?: number;
    weightUnit?: string;
    length?: number;
    width?: number;
    height?: number;
    declaredValue?: number;
    referenceNumber?: string;
    isFragile?: boolean;
  };
  notes?: string;
}

const NAVY = "#0F172A";
const SKY = "#0EA5E9";
const AMBER = "#F59E0B";
const SLATE = "#64748B";

function loc(value: ShipmentDoc["origin"]): { name?: string; address?: string; city?: string; country?: string } {
  if (typeof value === "object" && value !== null) return value;
  return {};
}

function fmtDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}

function money(value?: number): string {
  const n = Number(value ?? 0);
  return `€${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusLabel(status?: string): string {
  const labels: Record<string, string> = {
    created: "Created",
    "pickup-scheduled": "Pickup Scheduled",
    "picked-up": "Picked Up",
    "in-transit": "In Transit",
    "out-for-delivery": "Out for Delivery",
    delivered: "Delivered",
    delayed: "Delayed",
    exception: "Exception",
    cancelled: "Cancelled",
    returned: "Returned",
  };
  return labels[status ?? ""] ?? status ?? "—";
}

function buildDocumentsHtml(s: ShipmentDoc): string {
  const tn = s.trackingNumber ?? `#${s.id}`;
  const origin = loc(s.origin);
  const destination = loc(s.destination);
  const pkg = s.package ?? {};
  const service = typeof s.deliveryService === "object" && s.deliveryService !== null ? s.deliveryService : undefined;
  const senderAddress = [origin.address, origin.city, origin.country].filter(Boolean).join(", ");
  const recipientAddress = [destination.address, destination.city, destination.country].filter(Boolean).join(", ");

  const infoBlock = (title: string, lines: string[]): string =>
    `<div class="info-box"><h3>${title}</h3>${lines.map((l) => `<p>${l}</p>`).join("")}</div>`;

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" /><title>Invoice & Packing Slip ${tn}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #0F172A; margin: 0; padding: 40px; background: #F1F5F9; }
  .sheet { max-width: 820px; margin: 0 auto 24px; background: #fff; padding: 48px; border: 1px solid #E2E8F0; border-radius: 4px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid ${NAVY}; padding-bottom: 24px; margin-bottom: 28px; }
  .brand { font-size: 26px; font-weight: 800; color: ${NAVY}; letter-spacing: -0.02em; }
  .brand span { color: ${SKY}; }
  .brand-tag { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: ${SLATE}; margin-top: 4px; }
  .doc-title { font-size: 24px; font-weight: 800; color: ${NAVY}; text-transform: uppercase; letter-spacing: 0.04em; }
  .status-pill { display: inline-block; margin-top: 8px; padding: 5px 12px; border-radius: 999px; background: ${AMBER}; color: #0F172A; font-size: 12px; font-weight: 700; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 28px; }
  .info-box h3 { font-size: 11px; text-transform: uppercase; color: ${SLATE}; margin: 0 0 8px; letter-spacing: 0.06em; }
  .info-box p { margin: 2px 0; font-size: 13px; line-height: 1.5; }
  table.ledger { width: 100%; border-collapse: collapse; margin-top: 8px; }
  table.ledger th { text-align: left; font-size: 11px; text-transform: uppercase; color: ${SLATE}; letter-spacing: 0.06em; padding: 8px 0; border-bottom: 2px solid ${NAVY}; }
  table.ledger th.r, table.ledger td.r { text-align: right; }
  table.ledger td { padding: 9px 0; border-bottom: 1px solid #E2E8F0; font-size: 13px; }
  .total { font-size: 18px; font-weight: 800; border-top: 2px solid ${NAVY}; }
  .sign { display: flex; justify-content: space-between; gap: 40px; margin-top: 40px; }
  .sign div { flex: 1; }
  .sign-line { border-top: 1px solid #CBD5E1; margin-top: 44px; padding-top: 6px; font-size: 11px; color: ${SLATE}; }
  .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 11px; color: ${SLATE}; line-height: 1.6; }
  .no-print { max-width: 820px; margin: 0 auto 20px; text-align: right; }
  .no-print button { background: ${NAVY}; color: #fff; border: none; padding: 12px 26px; border-radius: 50px; font-weight: 700; font-size: 14px; cursor: pointer; }
  @media print { body { background: #fff; padding: 0; } .sheet { border: none; margin: 0; box-shadow: none; } .no-print { display: none; } .sheet:first-of-type { page-break-after: always; } }
</style></head><body>
<div class="no-print"><button onclick="window.print()">🖨️ Print / Save as PDF</button></div>

<!-- INVOICE -->
<div class="sheet">
  <div class="header">
    <div>
      <div class="brand">Send <span>Clouding</span></div>
      <div class="brand-tag">Courier · Tracking · Logistics</div>
    </div>
    <div>
      <div class="doc-title">Invoice</div>
      <span class="status-pill">${statusLabel(s.status)}</span>
    </div>
  </div>

  <div class="grid">
    ${infoBlock("Invoice No", [tn])}
    ${infoBlock("Date", [fmtDate(s.createdAt)])}
    ${infoBlock("From (Sender)", [s.sender?.company || s.sender?.name || "—", s.sender?.name ? `${s.sender.name}` : "", senderAddress || "", s.sender?.email || "", s.sender?.phone || ""].filter((l) => l !== ""))}
    ${infoBlock("Bill To (Recipient)", [s.recipient?.company || s.recipient?.name || "—", s.recipient?.name ? `${s.recipient.name}` : "", recipientAddress || "", s.recipient?.email || "", s.recipient?.phone || ""].filter((l) => l !== ""))}
    ${infoBlock("Delivery Service", [service?.name || "—"])}
    ${infoBlock("Route", [`${origin.name || "—"} → ${destination.name || "—"}`])}
  </div>

  <table class="ledger">
    <thead><tr><th>Description</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead>
    <tbody>
      <tr><td>Delivery — ${service?.name || "Standard service"}${pkg.description ? `<br/><span style="color:${SLATE};font-size:12px;">${pkg.description}</span>` : ""}</td><td class="r">1</td><td class="r">${money(service?.baseFee)}</td><td class="r">${money(service?.baseFee)}</td></tr>
    </tbody>
    <tfoot>
      <tr class="total"><td colspan="3" style="text-align:right;padding:12px 0;">Total</td><td class="r" style="padding:12px 0;">${money(service?.baseFee)}</td></tr>
    </tfoot>
  </table>

  <p style="margin-top:16px;font-size:12px;color:${SLATE};">Declared value for carriage: <strong>${money(pkg.declaredValue)}</strong> · Reference: ${pkg.referenceNumber || "—"} · Fragile: ${pkg.isFragile ? "Yes" : "No"}</p>

  <div class="footer">
    <strong style="color:${NAVY};">Send Clouding</strong> — Courier &amp; Logistics · Amsterdam, Netherlands<br/>
    contact@sendclouding.com · This invoice was generated automatically for shipment ${tn}.
  </div>
</div>

<!-- PACKING SLIP -->
<div class="sheet">
  <div class="header">
    <div>
      <div class="brand">Send <span>Clouding</span></div>
      <div class="brand-tag">Packing Slip</div>
    </div>
    <div>
      <div class="doc-title">Packing Slip</div>
      <span class="status-pill">${statusLabel(s.status)}</span>
    </div>
  </div>

  <div class="grid">
    ${infoBlock("Tracking No", [tn])}
    ${infoBlock("Reference", [pkg.referenceNumber || "—"])}
    ${infoBlock("From", [s.sender?.company || s.sender?.name || "—", senderAddress || "", s.sender?.phone || ""].filter((l) => l !== ""))}
    ${infoBlock("Deliver To", [s.recipient?.company || s.recipient?.name || "—", recipientAddress || "", s.recipient?.phone || ""].filter((l) => l !== ""))}
  </div>

  <table class="ledger">
    <thead><tr><th>Contents</th><th>Description</th><th class="r">Qty</th><th class="r">Weight</th><th class="r">Dimensions (cm)</th></tr></thead>
    <tbody>
      <tr>
        <td>${pkg.content || "—"}</td>
        <td>${pkg.description || "—"}</td>
        <td class="r">${pkg.quantity ?? 1}</td>
        <td class="r">${pkg.weight != null ? `${pkg.weight} ${pkg.weightUnit ?? "kg"}` : "—"}</td>
        <td class="r">${[pkg.length, pkg.width, pkg.height].filter((d) => d != null).join(" × ") || "—"}</td>
      </tr>
    </tbody>
  </table>

  <p style="margin-top:14px;font-size:12px;color:${SLATE};">Special handling: ${pkg.isFragile ? "<strong>FRAGILE — handle with care</strong>" : "None"}${s.notes ? `<br/>Notes: ${s.notes}` : ""}</p>

  <div class="sign">
    <div><div class="sign-line">Shipper signature / date</div></div>
    <div><div class="sign-line">Carrier signature / date</div></div>
  </div>

  <div class="footer">
    <strong style="color:${NAVY};">Send Clouding</strong> — Courier &amp; Logistics · contact@sendclouding.com · ${tn}
  </div>
</div>
</body></html>`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing shipment id" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/shipments/${id}?depth=2`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }
    const shipment = (await res.json()) as ShipmentDoc;
    if (!shipment || !shipment.id) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
    }

    const html = buildDocumentsHtml(shipment);
    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate documents" }, { status: 500 });
  }
}