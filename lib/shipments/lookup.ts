import { getPayload } from "payload";
import config from "@payload-config";
import bwipjs from "bwip-js";

export interface PublicTrackingEvent {
  id: number;
  status: string;
  dateTime: string;
  location: string | null;
  description: string;
}

export interface PublicParty {
  name: string;
  company?: string;
  phone?: string;
  email?: string;
}

export interface PublicPackageSummary {
  description?: string;
  content?: string;
  quantity?: number;
  weight?: number;
  weightUnit?: string;
  length?: number;
  width?: number;
  height?: number;
  declaredValue?: number;
  referenceNumber?: string;
  isFragile?: boolean;
}

export interface PublicTrackingResult {
  id: number;
  trackingNumber: string;
  status: string;
  origin: string | null;
  destination: string | null;
  currentLocation: string | null;
  deliveryService: string | null;
  estimatedDelivery: string | null;
  sender: PublicParty;
  recipient: PublicParty;
  packageSummary: PublicPackageSummary;
  barcodeSvg: string | null;
  events: PublicTrackingEvent[];
}

function groupValue(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "object" && value !== null && "name" in value) {
    return String((value as { name: unknown }).name);
  }
  return null;
}

function generateBarcode(text: string): string | null {
  try {
    const toSVG = (bwipjs as unknown as { toSVG: (opts: Record<string, unknown>) => string }).toSVG;
    return toSVG({
      bcid: "code128",
      text,
      scale: 2,
      height: 10,
      includetext: true,
      textxalign: "center",
      textsize: 11,
      paddingwidth: 6,
      paddingheight: 4,
    });
  } catch {
    return null;
  }
}

export async function lookupShipmentByTrackingNumber(
  trackingNumber: string
): Promise<PublicTrackingResult | null> {
  const tn = trackingNumber.trim().toUpperCase();
  if (!tn) return null;

  try {
    const payload = await getPayload({ config });

    const found = await payload.find({
      collection: "shipments",
      where: { trackingNumber: { equals: tn } },
      limit: 1,
      depth: 1,
    });

    const doc = found.docs[0];
    if (!doc) return null;

    const raw = doc as unknown as {
      trackingNumber?: string;
      status?: string;
      sender?: PublicParty;
      recipient?: PublicParty;
      package?: Partial<PublicPackageSummary>;
      estimatedDelivery?: string;
    };

    const trackingNumber = raw.trackingNumber ?? tn;

    const eventsRes = await payload.find({
      collection: "tracking-events",
      where: { shipment: { equals: doc.id } },
      sort: "-dateTime",
      limit: 100,
      depth: 1,
    });

    const events: PublicTrackingEvent[] = eventsRes.docs.map((e) => ({
      id: e.id,
      status: e.status as string,
      dateTime: (e as { dateTime?: string }).dateTime ?? e.createdAt,
      location: groupValue((e as { location?: unknown }).location),
      description: (e as { description?: string }).description ?? "",
    }));

    const pkg = raw.package ?? {};

    return {
      id: doc.id,
      trackingNumber,
      status: raw.status ?? "created",
      origin: groupValue((doc as { origin?: unknown }).origin),
      destination: groupValue((doc as { destination?: unknown }).destination),
      currentLocation: groupValue((doc as { currentLocation?: unknown }).currentLocation),
      deliveryService: groupValue((doc as { deliveryService?: unknown }).deliveryService),
      estimatedDelivery: raw.estimatedDelivery ?? null,
      sender: {
        name: raw.sender?.name ?? "",
        company: raw.sender?.company,
        phone: raw.sender?.phone,
        email: raw.sender?.email,
      },
      recipient: {
        name: raw.recipient?.name ?? "",
        company: raw.recipient?.company,
        phone: raw.recipient?.phone,
        email: raw.recipient?.email,
      },
      packageSummary: {
        description: pkg.description,
        content: pkg.content,
        quantity: pkg.quantity,
        weight: pkg.weight,
        weightUnit: pkg.weightUnit,
        length: pkg.length,
        width: pkg.width,
        height: pkg.height,
        declaredValue: pkg.declaredValue,
        referenceNumber: pkg.referenceNumber,
        isFragile: pkg.isFragile,
      },
      barcodeSvg: generateBarcode(trackingNumber),
      events,
    };
  } catch {
    return null;
  }
}