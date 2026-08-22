import { getPayload } from "payload";
import config from "@payload-config";
import type { LocationOption, MethodOption } from "@/components/ops/shipments/shipment-form";

export async function getShipmentFormOptions(): Promise<{
  locations: LocationOption[];
  methods: MethodOption[];
}> {
  const payload = await getPayload({ config });

  const [locationsRes, methodsRes] = await Promise.all([
    payload.find({
      collection: "locations",
      limit: 500,
      sort: "name",
      depth: 0,
      where: { isActive: { equals: true } },
    }),
    payload.find({
      collection: "shipping-methods",
      limit: 500,
      sort: "name",
      depth: 0,
    }),
  ]);

  const locations: LocationOption[] = locationsRes.docs.map((l) => ({
    id: l.id,
    name: (l as { name?: string }).name ?? `Location ${l.id}`,
    city: (l as { city?: string }).city ?? null,
    country: (l as { country?: string }).country ?? null,
  }));

  const methods: MethodOption[] = methodsRes.docs.map((m) => ({
    id: m.id,
    name: (m as { name?: string }).name ?? `Method ${m.id}`,
  }));

  return { locations, methods };
}