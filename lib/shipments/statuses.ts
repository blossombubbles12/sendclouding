export type ShipmentStatus =
  | "created"
  | "pickup-scheduled"
  | "picked-up"
  | "in-transit"
  | "out-for-delivery"
  | "delivered"
  | "delayed"
  | "exception"
  | "cancelled"
  | "returned";

export const SHIPMENT_STATUSES: ShipmentStatus[] = [
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

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  created: "Created",
  "pickup-scheduled": "Pickup Scheduled",
  "picked-up": "Picked Up",
  "in-transit": "In Transit",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  delayed: "Delayed",
  exception: "Exception",
  cancelled: "Cancelled",
  returned: "Returned",
};

export function getShipmentStatusLabel(status?: string | null): string {
  if (!status) return "Created";
  return STATUS_LABELS[status as ShipmentStatus] ?? status;
}