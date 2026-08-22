import { getPayload } from "payload";
import config from "@payload-config";

export interface PublicTrackingEvent {
  id: number;
  status: string;
  dateTime: string;
  location: string | null;
  description: string;
}

export interface PublicTrackingResult {
  id: number;
  trackingNumber: string;
  status: string;
  origin: string | null;
  destination: string | null;
  currentLocation: string | null;
  deliveryService: string | null;
  estimatedDelivery: string | null;
  recipientName: string;
  packageSummary: {
    description?: string;
    weight?: number;
    weightUnit?: string;
    quantity?: number;
  };
  events: PublicTrackingEvent[];
}

function groupValue(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object" && value !== null && "name" in value) {
    return String((value as { name: unknown }).name);
  }
  return null;
}

export async function lookupShipmentByTrackingNumber(
  trackingNumber: string
): Promise<PublicTrackingResult | null> {
  const tn = trackingNumber.trim().toUpperCase();
  if (!tn) return null;

  try {
    const payload = await getPayload({ config });

    const found = await payload.find({
      collection: "shipments",
      where: { trackingNumber: { equals: tn } },
      limit: 1,
      depth: 1,
    });

    const doc = found.docs[0];
    if (!doc) return null;

    const eventsRes = await payload.find({
      collection: "tracking-events",
      where: { shipment: { equals: doc.id } },
      sort: "-dateTime",
      limit: 100,
      depth: 1,
    });

    const events: PublicTrackingEvent[] = eventsRes.docs.map((e) => ({
      id: e.id,
      status: e.status as string,
      dateTime: (e as { dateTime?: string }).dateTime ?? e.createdAt,
      location: groupValue((e as { location?: unknown }).location),
      description: (e as { description?: string }).description ?? "",
    }));

    const pkg = (doc as { package?: { description?: string; weight?: number; weightUnit?: string; quantity?: number } }).package;

    return {
      id: doc.id,
      trackingNumber: (doc as { trackingNumber?: string }).trackingNumber ?? tn,
      status: (doc as { status?: string }).status ?? "created",
      origin: groupValue((doc as { origin?: unknown }).origin),
      destination: groupValue((doc as { destination?: unknown }).destination),
      currentLocation: groupValue((doc as { currentLocation?: unknown }).currentLocation),
      deliveryService: groupValue((doc as { deliveryService?: unknown }).deliveryService),
      estimatedDelivery: (doc as { estimatedDelivery?: string }).estimatedDelivery ?? null,
      recipientName: (doc as { recipient?: { name?: string } }).recipient?.name ?? "",
      packageSummary: {
        description: pkg?.description,
        weight: pkg?.weight,
        weightUnit: pkg?.weightUnit,
        quantity: pkg?.quantity,
      },
      events,
    };
  } catch {
    return null;
  }
}