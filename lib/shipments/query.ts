import { getPayload } from "payload";
import config from "@payload-config";
import {
  getShipmentStatusLabel,
  SHIPMENT_STATUSES,
  SHIPMENT_STATUS_COLORS,
} from "@/lib/shipments/statuses";

export { getShipmentStatusLabel, SHIPMENT_STATUSES, SHIPMENT_STATUS_COLORS };

export interface ShipmentListItem {
  id: number;
  trackingNumber: string;
  status: string;
  origin: string | null;
  destination: string | null;
  recipientName: string;
  senderName: string;
  estimatedDelivery: string | null;
  createdAt: string;
  updatedAt: string;
}

function getGroupValue(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object" && value !== null && "name" in value) {
    return String((value as { name: unknown }).name);
  }
  return null;
}

export async function queryShipments(params: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<{ docs: ShipmentListItem[]; totalDocs: number; totalPages: number; page: number }> {
  const payload = await getPayload({ config });

  const where: Record<string, unknown> = {};
  if (params.search) {
    where.trackingNumber = { like: params.search.trim() };
  }
  if (params.status && params.status !== "all") {
    where.status = { equals: params.status };
  }

  const result = await payload.find({
    collection: "shipments",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: where as any,
    sort: "-createdAt",
    limit: params.limit ?? 20,
    page: params.page ?? 1,
    depth: 1,
  });

  const docs: ShipmentListItem[] = result.docs.map((doc) => ({
    id: doc.id,
    trackingNumber: doc.trackingNumber as string,
    status: doc.status as string,
    origin: getGroupValue((doc as { origin?: unknown }).origin),
    destination: getGroupValue((doc as { destination?: unknown }).destination),
    recipientName: ((doc as { recipient?: { name?: string } }).recipient?.name) ?? "—",
    senderName: ((doc as { sender?: { name?: string } }).sender?.name) ?? "—",
    estimatedDelivery: ((doc as { estimatedDelivery?: string }).estimatedDelivery) ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }));

  return {
    docs,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? 1,
  };
}