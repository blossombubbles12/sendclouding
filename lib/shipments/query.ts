import { getPayload } from "payload";
import config from "@payload-config";
import { getShipmentStatusLabel } from "@/lib/shipments/statuses";

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

export const SHIPMENT_STATUSES = [
  "created",
  "pickup-scheduled",
  "picked-up",
  "in-transit",
  "out-for-delivery",
  "delivered",
  "delayed",
  "exception",
  "cancelled",
  "returned",
];

export const SHIPMENT_STATUS_COLORS: Record<string, string> = {
  created: "bg-sky-100 text-sky-700",
  "pickup-scheduled": "bg-sky-100 text-sky-700",
  "picked-up": "bg-indigo-100 text-indigo-700",
  "in-transit": "bg-indigo-100 text-indigo-700",
  "out-for-delivery": "bg-amber-100 text-amber-700",
  delivered: "bg-emerald-100 text-emerald-700",
  delayed: "bg-amber-100 text-amber-700",
  exception: "bg-red-100 text-red-700",
  cancelled: "bg-slate-100 text-slate-600",
  returned: "bg-slate-100 text-slate-600",
};

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

export { getShipmentStatusLabel };