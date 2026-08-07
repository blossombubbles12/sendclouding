import { NextRequest, NextResponse } from "next/server";

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

export async function GET(req: NextRequest) {
  const orderNumber = req.nextUrl.searchParams.get("order");
  if (!orderNumber) {
    return NextResponse.json({ error: "Missing order number" }, { status: 400 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const res = await fetch(
      `${baseUrl}/api/orders?where[orderNumber][equals]=${encodeURIComponent(orderNumber)}&depth=2`
    );
    const data = await res.json();
    const order = data.docs?.[0];

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const date = new Date(order.createdAt).toLocaleDateString("en-NG", {
      year: "numeric", month: "long", day: "numeric",
    });

    const shipMethod = order.shippingMethod?.name || "";
    const shipZone = order.shippingMethod?.zone || "";

    const itemRows = (order.items || []).map((item: any) =>
      `<tr><td style="padding:10px 0;border-bottom:1px solid #ddd">${item.name}${item.sku ? `<br><span style="font-size:12px;color:#888">SKU: ${item.sku}</span>` : ""}</td><td style="padding:10px 0;border-bottom:1px solid #ddd;text-align:center">${item.quantity}</td><td style="padding:10px 0;border-bottom:1px solid #ddd;text-align:right">${item.price.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</td><td style="padding:10px 0;border-bottom:1px solid #ddd;text-align:right">${item.total.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</td></tr>`
    ).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice ${orderNumber}</title>
<style>body{font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:40px;color:#0F172A}@media print{body{padding:20px}}
.header{display:flex;justify-content:space-between;align-items:start;margin-bottom:40px}
.logo{color:#063E9B;font-size:24px;font-weight:bold}
.invoice-title{font-size:28px;font-weight:bold;color:#063E9B}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-bottom:40px}
.info-box h3{font-size:12px;text-transform:uppercase;color:#888;margin:0 0 8px 0}
.info-box p{margin:2px 0;font-size:14px}
table{width:100%;border-collapse:collapse;margin-bottom:30px}
thead th{text-align:left;font-size:11px;text-transform:uppercase;color:#888;padding:10px 0;border-bottom:2px solid #063E9B}
tfoot td{padding:10px 0}
.total-row{font-size:20px;font-weight:bold;border-top:2px solid #063E9B}
.footer{text-align:center;margin-top:60px;font-size:12px;color:#888;border-top:1px solid #ddd;padding-top:20px}
@media print{.no-print{display:none}}</style></head><body>
<div class="no-print" style="text-align:right;margin-bottom:20px"><button onclick="window.print()" style="background:#063E9B;color:white;border:none;padding:10px 24px;border-radius:50px;cursor:pointer;font-weight:bold">Print Invoice</button></div>
<div class="header"><div><div class="logo">AquaBest Brands</div><p style="margin:5px 0;color:#888">Lagos, Nigeria</p><p style="margin:5px 0;color:#888">hello@aquabestbrands.com</p></div><div class="invoice-title">INVOICE</div></div>
<div class="info-grid">
<div class="info-box"><h3>Invoice No</h3><p style="font-weight:bold">${orderNumber}</p></div>
<div class="info-box"><h3>Date</h3><p>${date}</p></div>
<div class="info-box"><h3>Bill To</h3><p>${order.shippingAddress?.fullName || "Customer"}</p><p>${order.shippingAddress?.address || ""}</p><p>${[order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.postalCode].filter(Boolean).join(", ")}</p><p>${order.shippingAddress?.country || ""}</p></div>
      <div class="info-box"><h3>Status</h3><p style="font-weight:bold;color:#063E9B">${(order.status || "pending").toUpperCase()}</p><p>Payment: ${(order.paymentStatus || "pending").toUpperCase()}</p><p>Method: ${formatPaymentMethod(order.paymentMethod)}</p></div>
</div>
<table><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Total</th></tr></thead><tbody>${itemRows}</tbody><tfoot>
<tr><td colspan="3" style="text-align:right;color:#888">Subtotal</td><td style="text-align:right">₦${(order.subtotal || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</td></tr>
<tr><td colspan="3" style="text-align:right;color:#888">Tax (7.5%)</td><td style="text-align:right">₦${(order.tax || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</td></tr>
<tr><td colspan="3" style="text-align:right;color:#888">Shipping${shipMethod ? ` (${shipMethod}${shipZone ? ` - ${shipZone}` : ""})` : ""}</td><td style="text-align:right">₦${(order.shipping || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</td></tr>
<tr class="total-row"><td colspan="3" style="text-align:right">Total</td><td style="text-align:right">₦${(order.total || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</td></tr>
</tfoot></table>
<div class="footer"><p>Thank you for your business!</p><p>AquaBest Brands — Premium Water & Bakery Products</p></div>
</body></html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 });
  }
}
