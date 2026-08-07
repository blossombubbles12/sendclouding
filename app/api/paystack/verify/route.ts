import { NextRequest, NextResponse } from "next/server";
import { getGateway } from "@/lib/payments";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ success: false, error: "Missing reference" }, { status: 400 });
  }

  const gateway = getGateway("paystack");
  if (!gateway) {
    return NextResponse.json({ success: false, error: "Payment service unavailable" }, { status: 503 });
  }

  const result = await gateway.verify(reference);

  if (result.success) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

      const orderRes = await fetch(
        `${baseUrl}/api/orders?where[orderNumber][equals]=${encodeURIComponent(reference)}&limit=1`
      );
      const orderData = await orderRes.json();

      if (orderData.docs?.[0]) {
        const order = orderData.docs[0];
        if (order.paymentStatus !== "paid") {
          await fetch(`${baseUrl}/api/orders/${order.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentStatus: "paid",
              paymentMethod: `paystack_${reference}`,
              status: "confirmed",
            }),
          });
        }
      }
    } catch (err) {
      console.error("[Paystack Verify] Failed to update order:", err);
    }

    return NextResponse.json({ success: true, status: result.status });
  }

  return NextResponse.json({ success: false, error: result.error, status: result.status });
}
