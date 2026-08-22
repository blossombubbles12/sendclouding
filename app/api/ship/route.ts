import { NextRequest } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config });

    const body = await req.json().catch(() => ({}));

    const sender = body.sender as { name?: string; phone?: string } | undefined;
    const recipient = body.recipient as { name?: string; phone?: string } | undefined;

    if (!sender?.name || !sender.phone || !recipient?.name || !recipient.phone) {
      return Response.json(
        { success: false, error: "Sender and recipient name + phone are required" },
        { status: 400 }
      );
    }

    // The beforeChange hook auto-generates the tracking number and the
    // afterChange hook seeds the initial tracking event.
    const doc = await payload.create({
      collection: "shipments",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        sender: {
          name: sender.name,
          company: body.sender?.company ?? "",
          phone: sender.phone,
          email: body.sender?.email ?? "",
        },
        recipient: {
          name: recipient.name,
          company: body.recipient?.company ?? "",
          phone: recipient.phone,
          email: body.recipient?.email ?? "",
        },
        deliveryService: body.deliveryService ?? null,
        estimatedDelivery: body.estimatedDelivery ?? null,
        status: "created",
        package: {
          description: body.package?.description ?? "",
          content: body.package?.content ?? "",
          quantity: body.package?.quantity ?? 1,
          weight: body.package?.weight ?? null,
          weightUnit: body.package?.weightUnit ?? "kg",
          length: body.package?.length ?? null,
          width: body.package?.width ?? null,
          height: body.package?.height ?? null,
          declaredValue: body.package?.declaredValue ?? null,
          referenceNumber: body.package?.referenceNumber ?? "",
          isFragile: body.package?.isFragile ?? false,
        },
        notes: body.notes ?? "",
      } as never,
      req: { user: undefined } as never,
    });

    return Response.json(
      {
        success: true,
        id: doc.id,
        trackingNumber: (doc as unknown as { trackingNumber?: string }).trackingNumber ?? null,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[ship] booking failed:", err);
    return Response.json(
      { success: false, error: err instanceof Error ? err.message : "Failed to book shipment" },
      { status: 500 }
    );
  }
}