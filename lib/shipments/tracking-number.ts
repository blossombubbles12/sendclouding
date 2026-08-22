import type { PayloadRequest } from "payload";

/**
 * Generates a human-readable tracking number in the format SC-YYYY-NNNNNN,
 * e.g. SC-2026-000001. The numeric portion is derived from the count of
 * existing shipments in the current year, incremented by one.
 */
export async function generateTrackingNumber(req: PayloadRequest): Promise<string> {
  const year = new Date().getFullYear();

  const total = await req.payload.count({
    collection: "shipments",
    where: {
      createdAt: {
        greater_than_equal: `${year}-01-01T00:00:00.000Z`,
        less_than_equal: `${year}-12-31T23:59:59.999Z`,
      },
    },
  });

  const sequence = total.totalDocs + 1;
  return `SC-${year}-${String(sequence).padStart(6, "0")}`;
}