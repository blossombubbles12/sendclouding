import type { AnyLayer, TemplateDesign } from "@/app/(payload)/admin/components/template-builder/lib/types";

export { TemplateDesign, AnyLayer };

/**
 * Production workflow states. These mirror the requested lifecycle:
 * Pending Review -> Approved -> Printing -> Quality Check -> Packaging ->
 * Ready for Shipment -> Shipped -> Delivered, with Rejected as a terminal
 * failure state reachable from review or printing.
 */
export const PRODUCTION_STATUSES = [
  "pending_review",
  "approved",
  "printing",
  "quality_check",
  "packaging",
  "ready_for_shipment",
  "shipped",
  "delivered",
  "rejected",
] as const;

export type ProductionStatus = (typeof PRODUCTION_STATUSES)[number];

export const PRODUCTION_STATUS_LABELS: Record<ProductionStatus, string> = {
  pending_review: "Pending Review",
  approved: "Approved",
  printing: "Printing",
  quality_check: "Quality Check",
  packaging: "Packaging",
  ready_for_shipment: "Ready for Shipment",
  shipped: "Shipped",
  delivered: "Delivered",
  rejected: "Rejected",
};

/** Initial status when a job is auto-created from a paid order. */
export const INITIAL_STATUS: ProductionStatus = "pending_review";

/** Statuses that indicate the job is finished (terminal or shipped). */
export const TERMINAL_STATUSES: ProductionStatus[] = ["shipped", "delivered", "rejected"];

/** Supported print provider channels. Registry built in lib/production/providers.ts. */
export const PRINT_PROVIDERS = ["in_house", "printful", "printify", "gelato", "custom"] as const;
export type PrintProviderName = (typeof PRINT_PROVIDERS)[number];

/** Physical print product areas a job item may cover. */
export const PRINT_AREAS = [
  "front",
  "back",
  "inside",
  "wrap",
  "left",
  "right",
  "top",
  "bottom",
] as const;
export type PrintArea = (typeof PRINT_AREAS)[number];

/** Print-ready output formats. */
export const PRINT_FORMATS = ["svg", "png", "pdf"] as const;
export type PrintFormat = (typeof PRINT_FORMATS)[number];

/** One generated print-ready master file attached to a job item. */
export interface PrintReadyFile {
  format: PrintFormat;
  /** width×height of the raster in pixels */
  widthPx: number;
  heightPx: number;
  unit: string;
  dpi: number;
  /** Media doc id for the generated file. */
  mediaId: string;
  url: string;
  name: string;
  size: number;
}

/**
 * Resolved design plus production inputs for one job item. This is the full
 * snapshot needed to reproduce print masters without touching the live order.
 */
export interface ProductionItem {
  product: string;
  productName: string;
  sku?: string;
  quantity: number;
  printAreas: PrintArea[];
  templateId?: string | null;
  templateVersion?: string | null;
  designJSON: TemplateDesign | null;
  options: Record<string, unknown>;
  previewImage?: string | null;
  previewUrl?: string | null;
  assets?: Array<Record<string, unknown>>;
  production: Record<string, unknown>;
  itemPrice?: number;
  itemTotal?: number;
  printReadyFiles?: PrintReadyFile[];
}

/** A single audit entry in a job's history. */
export interface JobHistoryEntry {
  status: ProductionStatus;
  action: string;
  note?: string;
  actor?: string | null;
  at: string;
}