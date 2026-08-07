import { getAvailablePaymentMethods } from "@/lib/payments";

export async function GET() {
  try {
    const methods = await getAvailablePaymentMethods();
    return Response.json({ success: true, methods });
  } catch (err) {
    console.error("[Payment API] Error fetching payment methods:", err);
    return Response.json({
      success: true,
      methods: [
        {
          id: "cod",
          label: "Cash on Delivery",
          description: "Pay with cash when your order is delivered.",
        },
      ],
    });
  }
}
