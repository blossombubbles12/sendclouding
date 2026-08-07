import { NextRequest, NextResponse } from "next/server";
import { getGateway } from "@/lib/payments";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";

    const gateway = getGateway("paystack");
    if (!gateway) {
      console.error("[Paystack Webhook] Paystack gateway not configured");
      return NextResponse.json({ error: "Gateway not configured" }, { status: 503 });
    }

    if (!gateway.verifyWebhook || !gateway.verifyWebhook(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const reference = event.data?.reference;
    const metadata = event.data?.metadata;
    const orderId = metadata?.orderId;

    if (!orderId) {
      return NextResponse.json({ received: true });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const updateRes = await fetch(`${baseUrl}/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentStatus: "paid",
        paymentMethod: `paystack_${reference}`,
        status: "confirmed",
      }),
    });

    if (!updateRes.ok) {
      console.error("[Paystack Webhook] Failed to update order", orderId, await updateRes.text());
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Paystack Webhook] Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
