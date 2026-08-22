// ─────────────────────────────────────────────────────────────────────────────
// Production orchestration service.
//
// - `createJobForOrder`: auto-generate a production job from a paid customized
//   order (idempotent).
// - `transitionJob`: advance/review a job with full audit history + optional
//   external provider dispatch.
// - `generatePrintFilesForJob`: build and persist SVG/PNG/PDF masters.
//
// All reads use an overrideAccess payload client so automation (paystack hooks,
// scheduled tasks) behaves identically to authenticated staff.
// -----------------------------------------------------------------------------

import { getPayload, type Payload } from "payload";
import config from "@payload-config";
import { getPrintProvider } from "./providers";
import type { PrintProviderName, ProductionStatus } from "./types";
import { INITIAL_STATUS, PRODUCTION_STATUSES, TERMINAL_STATUSES } from "./types";
import type { ProductionJob } from "@/payload-types";
import type { Order } from "@/payload-types";

type PayloadClient = Awaited<ReturnType<typeof getPayload>>;

export interface CreateJobResult {
  job?: Record<string, unknown>;
  created: boolean;
  skipped: boolean;
  reason?: string;
}

/** Load an order with its nested design group fully populated. */
async function loadOrder(payload: Payload, orderId: string): Promise<Record<string, unknown> | null> {
  const res = await payload.findByID({
    collection: "orders",
    id: orderId,
    depth: 2,
    overrideAccess: true,
  });
  return res as unknown as Record<string, unknown>;
}

/** Extract customized lines (those carrying a design) from an order. */
function customizedItems(order: Record<string, unknown>): Array<Record<string, unknown>> {
  const items = order.items as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(items)) return [];
  return items.filter((it) => {
    const design = it?.design as Record<string, unknown> | undefined;
    return design && design.designJSON;
  });
}

/**
 * Create a production job for an order if (a) it has customized lines and
 * (b) no job already exists for that order. Called after payment is confirmed.
 */
export async function createJobForOrder(orderId: string): Promise<CreateJobResult> {
  const payload = await getPayload({ config });
  const order = await loadOrder(payload, orderId);
  if (!order) {
    return { created: false, skipped: true, reason: "Order not found" };
  }

  const items = customizedItems(order);
  if (items.length === 0) {
    return { created: false, skipped: true, reason: "Order has no customized items" };
  }

  const existing = await payload.find({
    collection: "production-jobs",
    where: { order: { equals: orderId } },
    limit: 1,
    overrideAccess: true,
  });
  if (existing.docs.length > 0) {
    return {
      created: false,
      skipped: true,
      reason: "Job already exists",
      job: existing.docs[0] as unknown as Record<string, unknown>,
    };
  }

  const orderNumber = (order.orderNumber as string) || orderId;
  const jobNumber = `PRD-${Date.now().toString(36).toUpperCase()}`;

  const job = await payload.create({
    collection: "production-jobs",
    overrideAccess: true,
    data: {
      jobNumber,
      order: Number(orderId),
      status: INITIAL_STATUS,
      itemCount: items.length,
      items: items.map((it) => mapItem(it)),
      history: [
        {
          status: INITIAL_STATUS,
          action: "Job created automatically from paid order",
          note: `Order ${orderNumber} — ${items.length} customized item(s).`,
          at: new Date().toISOString(),
        },
      ],
    } as unknown as ProductionJob,
  });

  return { created: true, job: job as unknown as Record<string, unknown>, skipped: false };
}

function mapItem(item: Record<string, unknown>): Record<string, unknown> {
  const design = (item.design ?? {}) as Record<string, unknown>;
  const production = (design.production as Record<string, unknown>) ?? {};
  return {
    product: (item.product as Record<string, unknown>)?.id ?? item.product,
    name: (item.name as string) || (design as Record<string, unknown>).productName || "Custom item",
    sku: item.sku || undefined,
    quantity: item.quantity || 1,
    unitPrice: item.price || 0,
    printAreas: (production.printAreas as string[]) || ["front"],
    templateVersion: design.templateVersion || undefined,
    designJSON: design.designJSON,
    options: design.options || undefined,
    production,
    previewImage: (design.previewImage as Record<string, unknown>)?.id ?? undefined,
    assets: ((design.assets as Array<Record<string, unknown>>) || []).map((a) => ({
      asset: (a.asset as Record<string, unknown>)?.id ?? a.asset,
      placeholderId: a.placeholderId,
    })),
  };
}

/** Update job status with full audit, provider dispatch and order sync. */
interface TransitionInput {
  jobId: string;
  status: ProductionStatus;
  action: string;
  note?: string;
  actor?: string | null;
  /** Automatically dispatch to the configured external provider on 'approved'. */
  submitToProvider?: boolean;
}

async function transitionJob(input: TransitionInput): Promise<Record<string, unknown>> {
  const payload = await getPayload({ config });
  const job = await payload.findByID({
    collection: "production-jobs",
    id: input.jobId,
    depth: 2,
    overrideAccess: true,
  });

  if (!PRODUCTION_STATUSES.includes(input.status)) {
    throw new Error(`Unknown production status: ${input.status}`);
  }

  const actor = input.actor || null;
  const entry = {
    status: input.status,
    action: input.action,
    note: input.note || "",
    actor,
    at: new Date().toISOString(),
  };

  const history = [ ...((job.history as unknown[]) || []) ];
  history.push(entry);

  const data: Record<string, unknown> = {
    status: input.status,
    history,
    review: {
      status: input.status === "rejected" ? "rejected" : input.status === "approved" ? "approved" : (job as any).review?.status,
      reviewedBy: actor || undefined,
      reviewedAt: input.status === "approved" || input.status === "rejected" ? new Date().toISOString() : undefined,
      comments: input.note || (job as any).review?.comments,
    },
  };

  // Optional external dispatch on approval.
  if (input.submitToProvider && input.status === "approved") {
    const provider = getPrintProvider((job.provider as PrintProviderName) || "in_house");
    const files: Array<{ format: string; name: string; url: string }> = [];
    // Collect first print-ready file of each item so the provider can produce masters.
    for (const it of (job.items as Array<Record<string, unknown>>) || []) {
      const fr = (it.printReadyFiles as Array<Record<string, Record<string, any>>>) || [];
      const url = fr[0]?.file?.url || fr[0]?.url;
      if (url) files.push({ format: String(fr[0]?.format || "png"), name: String(it.name || "design"), url: String(url) });
    }
    const submit = await provider.submit({
      externalRef: String(job.jobNumber),
      provider: provider.name,
      quantity: 1,
      productName: String((job.items as any)?.[0]?.name || "Custom item"),
      files,
      metadata: { order: String((job.order as any)?.id || job.order) },
    });
    if (submit.externalId) {
      data.externalId = submit.externalId;
      data.externalStatus = submit.status || null;
      data.submittedAt = new Date().toISOString();
    }
  }

  const updated = await payload.update({
    collection: "production-jobs",
    id: input.jobId,
    overrideAccess: true,
    data,
  });

  // Mirror noteworthy terminal states back onto the source order.
  if (input.status === "shipped" || input.status === "delivered") {
    await syncOrderStatus(payload, job.order, input.status === "shipped" ? "shipped" : "delivered");
  }

  return updated as unknown as Record<string, unknown>;
}

/**
 * Generate print masters for each item in the job and save them to the media library.
 */
export async function generatePrintFilesForJob(jobId: string): Promise<void> {
  const payload = await getPayload({ config });
  const { generatePrintMasters } = await import("./print-files");

  const job = await payload.findByID({
    collection: "production-jobs",
    id: jobId,
    depth: 0,
    overrideAccess: true,
  });

  if (!job) {
    throw new Error(`Job not found: ${jobId}`);
  }

  const items = [ ...((job.items as Array<any>) || []) ];
  let updated = false;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.designJSON) continue;
    if (item.printReadyFiles && item.printReadyFiles.length > 0) continue;

    // Generate masters
    const result = await generatePrintMasters(item.designJSON, 300);

    // Save SVG file
    const svgMedia = await payload.create({
      collection: "media",
      overrideAccess: true,
      data: {
        alt: `${item.name || "Custom item"} Print SVG`,
      },
      file: {
        data: Buffer.from(result.svg),
        mimetype: "image/svg+xml",
        name: `prd-${job.jobNumber}-${i}-master.svg`,
        size: Buffer.byteLength(result.svg),
      },
    });

    // Save PNG file
    const pngMedia = await payload.create({
      collection: "media",
      overrideAccess: true,
      data: {
        alt: `${item.name || "Custom item"} Print PNG`,
      },
      file: {
        data: result.png,
        mimetype: "image/png",
        name: `prd-${job.jobNumber}-${i}-master.png`,
        size: result.png.length,
      },
    });

    // Save PDF file
    const pdfMedia = await payload.create({
      collection: "media",
      overrideAccess: true,
      data: {
        alt: `${item.name || "Custom item"} Print PDF`,
      },
      file: {
        data: result.pdf,
        mimetype: "application/pdf",
        name: `prd-${job.jobNumber}-${i}-master.pdf`,
        size: result.pdf.length,
      },
    });

    item.printReadyFiles = [
      {
        format: "svg",
        widthPx: result.widthPx,
        heightPx: result.heightPx,
        unit: result.unit,
        dpi: result.dpi,
        file: svgMedia.id,
        name: `prd-${job.jobNumber}-${i}-master.svg`,
        size: Buffer.byteLength(result.svg),
      },
      {
        format: "png",
        widthPx: result.widthPx,
        heightPx: result.heightPx,
        unit: result.unit,
        dpi: result.dpi,
        file: pngMedia.id,
        name: `prd-${job.jobNumber}-${i}-master.png`,
        size: result.png.length,
      },
      {
        format: "pdf",
        widthPx: result.widthPx,
        heightPx: result.heightPx,
        unit: result.unit,
        dpi: result.dpi,
        file: pdfMedia.id,
        name: `prd-${job.jobNumber}-${i}-master.pdf`,
        size: result.pdf.length,
      },
    ];
    updated = true;
  }

  if (updated) {
    await payload.update({
      collection: "production-jobs",
      id: jobId,
      overrideAccess: true,
      data: {
        items,
      },
    });
  }
}

async function syncOrderStatus(payload: Payload, orderRef: unknown, status: string): Promise<void> {
  if (!orderRef) return;
  const orderId = (orderRef as Record<string, unknown>)?.id ?? orderRef;
  try {
    await payload.update({
      collection: "orders",
      id: String(orderId),
      overrideAccess: true,
      data: { status: status as Order["status"] },
    });
  } catch {
    /* non-fatal */
  }
}

export { TERMINAL_STATUSES, transitionJob }; // funnel