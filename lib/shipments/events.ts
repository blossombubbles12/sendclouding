import type { PayloadRequest } from "payload";

/** Normalizes a relationship value (number | string | object) into its id. */
export function toId(value: unknown): number | string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "number" || typeof value === "string") return value;
  if (typeof value === "object" && "id" in (value as object)) {
    return (value as { id: number | string }).id;
  }
  return undefined;
}

interface CreateTrackingEventInput {
  shipment: number | string;
  status: string;
  dateTime?: string;
  location?: number | string;
  description?: string;
}

/** Creates a tracking event and attaches it to the shipment. */
export async function createTrackingEvent(
  req: PayloadRequest,
  input: CreateTrackingEventInput
): Promise<void> {
  await req.payload.create({
    collection: "tracking-events",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: {
      shipment: input.shipment,
      status: input.status,
      dateTime: input.dateTime ?? new Date().toISOString(),
      location: input.location,
      description: input.description ?? "",
    } as never,
    req,
  });

  await req.payload.update({
    collection: "shipments",
    id: input.shipment as string,
    data: {
      currentLocation: input.location as never,
    } as never,
    req,
  });
}

/** Returns the status of the most recent tracking event for a shipment. */
export async function getLatestEventStatus(
  req: PayloadRequest,
  shipmentId: number | string
): Promise<string | undefined> {
  const events = await req.payload.find({
    collection: "tracking-events",
    where: {
      shipment: {
        equals: shipmentId,
      },
    },
    sort: "-dateTime",
    limit: 1,
    depth: 0,
    req,
  });

  const latest = events.docs[0] as { status?: string } | undefined;
  return latest?.status;
}