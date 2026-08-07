import { getShippingMethods, getShippingSettings, resolveZone, calculateShippingCost, getZoneFees } from "@/lib/shipping";
import type { ShippingMethod } from "@/lib/shipping";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "";
    const state = searchParams.get("state") || "";

    const settings = await getShippingSettings();
    const methods = await getShippingMethods();
    const zone = resolveZone(city, state, settings.zones);

    const results: ShippingMethod[] = [];

    if (city && state) {
      for (const method of methods) {
        const zoneFees = await getZoneFees(method.id);
        const calc = calculateShippingCost(
          method, zone, 0,
          settings.freeShippingThreshold,
          zoneFees
        );
        results.push({ ...method, baseFee: calc.fee });
      }
    } else {
      results.push(...methods);
    }

    return Response.json({
      success: true,
      methods: results,
      zone: zone.name,
      freeThreshold: settings.freeShippingThreshold,
    });
  } catch (err) {
    console.error("[Shipping API] Error:", err);
    return Response.json({
      success: true,
      methods: [
        { id: "home-delivery", name: "Home Delivery", description: "Delivered to your doorstep.", baseFee: 2000, estimatedDelivery: "2-4 business days", isActive: true },
        { id: "store-pickup", name: "Store Pickup", description: "Pick up at our store.", baseFee: 0, estimatedDelivery: "Ready in 24 hours", isActive: true },
      ],
      zone: "Default",
      freeThreshold: 50000,
    });
  }
}
