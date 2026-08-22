export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  baseFee: number;
  estimatedDelivery: string;
  isActive: boolean;
}

export interface ShippingZone {
  name: string;
  key: string;
  cities: string;
  states: string;
  isActive: boolean;
}

export interface ShippingCalculation {
  method: ShippingMethod;
  fee: number;
  zone: string;
  isFree: boolean;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const DEFAULT_ZONES: ShippingZone[] = [
  { name: "London", key: "london", cities: "London, Birmingham, Leeds, Bristol, Manchester", states: "Greater London, West Midlands, West Yorkshire, City of Bristol, Greater Manchester", isActive: true },
  { name: "Amsterdam", key: "amsterdam", cities: "Amsterdam, Rotterdam, The Hague, Utrecht, Eindhoven", states: "North Holland, South Holland, Utrecht, North Brabant", isActive: true },
  { name: "Other States", key: "other-states", cities: "", states: "", isActive: true },
];

const DEFAULT_METHODS: ShippingMethod[] = [
  { id: "home-delivery", name: "Home Delivery", description: "Delivered to your doorstep.", baseFee: 9.95, estimatedDelivery: "2-4 business days", isActive: true },
  { id: "store-pickup", name: "Store Pickup", description: "Pick up your order at our store.", baseFee: 0, estimatedDelivery: "Ready in 24 hours", isActive: true },
  { id: "express-delivery", name: "Express Delivery", description: "Priority delivery for urgent orders.", baseFee: 14.95, estimatedDelivery: "1-2 business days", isActive: true },
];

export function resolveZone(city: string, state: string, zones: ShippingZone[]): ShippingZone {
  const cityLower = city.trim().toLowerCase();
  const stateLower = state.trim().toLowerCase();

  for (const zone of zones) {
    if (!zone.isActive) continue;

    const zoneCities = zone.cities.toLowerCase().split(",").map((c) => c.trim());
    const zoneStates = zone.states.toLowerCase().split(",").map((s) => s.trim());

    if (zoneCities.includes(cityLower)) return zone;
    if (zoneStates.includes(stateLower)) return zone;
  }

  // Fallback to "Other States" zone or first active zone
  const otherZone = zones.find((z) => z.key === "other-states" && z.isActive);
  if (otherZone) return otherZone;

  const firstActive = zones.find((z) => z.isActive);
  return firstActive || { name: "Default", key: "default", cities: "", states: "", isActive: true };
}

export function calculateShippingCost(
  method: ShippingMethod,
  zone: ShippingZone,
  subtotal: number,
  freeThreshold: number,
  zoneFees?: { zone: string; fee: number }[]
): ShippingCalculation {
  if (subtotal >= freeThreshold && freeThreshold > 0) {
    return { method, fee: 0, zone: zone.name, isFree: true };
  }

  // Check for zone-specific fee override
  if (zoneFees && zoneFees.length > 0) {
    const zf = zoneFees.find((z) => z.zone === zone.key);
    if (zf) {
      return { method, fee: zf.fee, zone: zone.name, isFree: false };
    }
  }

  return { method, fee: method.baseFee, zone: zone.name, isFree: false };
}

export async function getShippingSettings(): Promise<{
  freeShippingThreshold: number;
  zones: ShippingZone[];
}> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${baseUrl}/api/globals/shipping-settings`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      freeShippingThreshold: data.freeShippingThreshold ?? 100,
      zones: (data.zones && data.zones.length > 0) ? data.zones : DEFAULT_ZONES,
    };
  } catch (err) {
    console.warn("[Shipping] Settings unavailable, using defaults:", (err as Error).message);
    return { freeShippingThreshold: 100, zones: DEFAULT_ZONES };
  }
}

export async function getShippingMethods(): Promise<ShippingMethod[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${baseUrl}/api/shipping-methods?where[isActive][equals]=true&limit=50`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data.docs && data.docs.length > 0) {
      return data.docs.map((doc: Record<string, unknown>) => ({
        id: doc.id,
        name: doc.name,
        description: doc.description || "",
        baseFee: doc.baseFee ?? 0,
        estimatedDelivery: doc.estimatedDelivery || "",
        isActive: doc.isActive ?? true,
      }));
    }
  } catch (err) {
    console.warn("[Shipping] Could not fetch admin methods, using defaults:", (err as Error).message);
  }

  return DEFAULT_METHODS;
}

export async function getZoneFees(methodId: string): Promise<{ zone: string; fee: number }[]> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${baseUrl}/api/shipping-methods/${methodId}?depth=0`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.zoneFees || []).map((zf: Record<string, unknown>) => ({ zone: zf.zone as string, fee: zf.fee as number }));
  } catch {
    return [];
  }
}
