import { getPayload } from "payload";
import config from "@payload-config";

export interface TrackingEventItem {
  id: number;
  status: string;
  dateTime: string;
  location: string | null;
  description: string;
}

export interface ShipmentDetail {
  id: number;
  trackingNumber: string;
  status: string;
  origin: string | null;
  destination: string | null;
  originId: number | null;
  destinationId: number | null;
  currentLocation: string | null;
  deliveryService: string | null;
  deliveryServiceId: number | null;
  estimatedDelivery: string | null;
  sender: { name: string; company?: string; phone: string; email?: string };
  recipient: { name: string; company?: string; phone: string; email?: string };
  package: {
    description?: string;
    content?: string;
    quantity?: number;
    weight?: number;
    weightUnit?: string;
    declaredValue?: number;
    referenceNumber?: string;
    isFragile?: boolean;
  };
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  trackingEvents: TrackingEventItem[];
}

function getGroupValue(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object" && value !== null && "name" in value) {
    return String((value as { name: unknown }).name);
  }
  return null;
}

function getRawId(value: unknown): number | null {
  if (!value) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || null;
  if (typeof value === "object" && "id" in (value as object)) {
    return Number((value as { id: unknown }).id) || null;
  }
  return null;
}

export async function getShipmentDetail(id: string | number): Promise<ShipmentDetail | null> {
  try {
    const payload = await getPayload({ config });

    const doc = await payload.findByID({
      collection: "shipments",
      id: typeof id === "string" ? Number(id) : id,
      depth: 1,
    });

    const eventsResult = await payload.find({
      collection: "tracking-events",
      where: { shipment: { equals: doc.id } },
      sort: "-dateTime",
      limit: 100,
      depth: 1,
    });

    const trackingEvents: TrackingEventItem[] = eventsResult.docs.map((e) => ({
      id: e.id,
      status: e.status as string,
      dateTime: (e as { dateTime?: string }).dateTime ?? e.createdAt,
      location: getGroupValue((e as { location?: unknown }).location),
      description: (e as { description?: string }).description ?? "",
    }));

    const typed = doc as unknown as ShipmentDetail;
    return {
      id: doc.id,
      trackingNumber: typed.trackingNumber ?? String(doc.id),
      status: typed.status ?? "created",
      origin: getGroupValue((doc as { origin?: unknown }).origin),
      destination: getGroupValue((doc as { destination?: unknown }).destination),
      originId: getRawId((doc as { origin?: unknown }).origin),
      destinationId: getRawId((doc as { destination?: unknown }).destination),
      currentLocation: getGroupValue((doc as { currentLocation?: unknown }).currentLocation),
      deliveryService: getGroupValue((doc as { deliveryService?: unknown }).deliveryService),
      deliveryServiceId: getRawId((doc as { deliveryService?: unknown }).deliveryService),
      estimatedDelivery: typed.estimatedDelivery ?? null,
      sender: typed.sender ?? { name: "—", phone: "—" },
      recipient: typed.recipient ?? { name: "—", phone: "—" },
      package: typed.package ?? {},
      notes: typed.notes ?? null,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      trackingEvents,
    };
  } catch {
    return null;
  }
}