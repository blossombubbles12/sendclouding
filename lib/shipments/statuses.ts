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