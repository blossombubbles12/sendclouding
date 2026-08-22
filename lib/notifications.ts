import { APIError } from "payload";

export async function sendEmail(to: string, subject: string, html: string) {
  // Use Payload's email adapter or fallback to logging
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    await fetch(`${baseUrl}/api/payload/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    });
  } catch {
    console.log(`[Email] To: ${to} | Subject: ${subject}`);
    console.log(html);
  }
}

export function orderConfirmationEmail(data: {
  customerName: string;
  orderNumber: string;
  orderTotal: string;
  items: { name: string; quantity: number; price: string }[];
  orderUrl: string;
}) {
  const itemRows = data.items
    .map((i) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.name} × ${i.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${i.price}</td></tr>`)
    .join("");

  return {
    subject: `Order Confirmed — ${data.orderNumber}`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#0F172A">
      <div style="text-align:center;padding:30px 0"><h1 style="color:#063E9B;margin:0">Send Clouding</h1></div>
      <h2 style="color:#0F172A">Order Confirmation</h2>
      <p>Hi ${data.customerName},</p>
      <p>Thank you for your order! Your order <strong>${data.orderNumber}</strong> has been confirmed and is being processed.</p>
      <table style="width:100%;margin:20px 0;border-collapse:collapse">${itemRows}</table>
      <p style="font-size:18px;font-weight:bold;text-align:right">Total: ${data.orderTotal}</p>
      <div style="text-align:center;margin:30px 0"><a href="${data.orderUrl}" style="background:#063E9B;color:white;padding:12px 30px;border-radius:50px;text-decoration:none;font-weight:bold">View Your Order</a></div>
      <p style="color:#64748B;font-size:13px">Questions? Contact hello@sendclouding.com</p>
    </body></html>`,
  };
}

export function orderStatusEmail(data: {
  customerName: string;
  orderNumber: string;
  status: string;
  orderUrl: string;
}) {
  const statusMessages: Record<string, string> = {
    pending: "has been received and is pending review",
    confirmed: "has been confirmed",
    processing: "is now being processed",
    shipped: "is on its way!",
    delivered: "has been delivered",
    cancelled: "has been cancelled",
    refunded: "has been refunded",
  };

  const msg = statusMessages[data.status] || `status has been updated to ${data.status}`;

  return {
    subject: `Order ${data.orderNumber} — ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#0F172A">
      <div style="text-align:center;padding:30px 0"><h1 style="color:#063E9B;margin:0">Send Clouding</h1></div>
      <h2>Order Update</h2>
      <p>Hi ${data.customerName},</p>
      <p>Your order <strong>${data.orderNumber}</strong> ${msg}.</p>
      <div style="text-align:center;margin:30px 0"><a href="${data.orderUrl}" style="background:#063E9B;color:white;padding:12px 30px;border-radius:50px;text-decoration:none;font-weight:bold">View Order Details</a></div>
      <p style="color:#64748B;font-size:13px">Questions? Contact hello@sendclouding.com</p>
    </body></html>`,
  };
}

export function lowStockAlertEmail(data: {
  productName: string;
  currentStock: number;
  threshold: number;
  productUrl: string;
}) {
  return {
    subject: `Low Stock Alert — ${data.productName}`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#0F172A">
      <h2 style="color:#EF4444">Low Stock Alert</h2>
      <p><strong>${data.productName}</strong> has low inventory.</p>
      <p>Current stock: <strong>${data.currentStock}</strong> (threshold: ${data.threshold})</p>
      <div style="text-align:center;margin:30px 0"><a href="${data.productUrl}" style="background:#EF4444;color:white;padding:12px 30px;border-radius:50px;text-decoration:none;font-weight:bold">Manage Inventory</a></div>
    </body></html>`,
  };
}

export function newOrderAdminEmail(data: {
  orderNumber: string;
  customerName: string;
  orderTotal: string;
  adminUrl: string;
}) {
  return {
    subject: `New Order — ${data.orderNumber}`,
    html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#0F172A">
      <h2 style="color:#063E9B">New Order Received</h2>
      <p>A new order <strong>${data.orderNumber}</strong> has been placed by <strong>${data.customerName}</strong>.</p>
      <p style="font-size:18px;font-weight:bold">Total: ${data.orderTotal}</p>
      <div style="text-align:center;margin:30px 0"><a href="${data.adminUrl}" style="background:#063E9B;color:white;padding:12px 30px;border-radius:50px;text-decoration:none;font-weight:bold">View in Admin</a></div>
    </body></html>`,
  };
}
