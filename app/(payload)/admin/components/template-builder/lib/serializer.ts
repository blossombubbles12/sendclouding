import { createEmptyDesign, DESIGN_VERSION } from "./defaults";
import type { AnyLayer, PayloadTemplateDoc, TemplateDesign } from "./types";

export type DesignPayload = {
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  canvas: { width: number; height: number; unit: string; dpi: number };
  templateData: {
    templateVersion: string;
    templateJSON: TemplateDesign;
    layerCount: number;
    editableLayerCount: number;
  };
  previewImage?: Record<string, unknown> | null;
};

export interface SavePayload {
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  canvas: { width: number; height: number; unit: string; dpi: number };
  templateData: {
    templateVersion: string;
    templateJSON: TemplateDesign;
    layerCount: number;
    editableLayerCount: number;
  };
  previewImage?: Record<string, unknown> | null;
}

/**
 * Turns a TemplateDesign (or a raw JSON object that may be from an older doc)
 * into a guaranteed-correct design object. Missing fields are defaulted so the
 * editor never has to defend against bad shapes.
 */
export function normalizeDesign(raw: unknown): TemplateDesign {
  const fallback = createEmptyDesign();
  if (!raw || typeof raw !== "object") return fallback;

  const r = raw as Record<string, unknown>;
  const layers = Array.isArray(r.layers) ? (r.layers as AnyLayer[]) : [];

  return {
    ...fallback,
    ...r,
    version: typeof r.version === "number" ? r.version : DESIGN_VERSION,
    width: typeof r.width === "number" ? r.width : fallback.width,
    height: typeof r.height === "number" ? r.height : fallback.height,
    layers,
  };
}

export function designToSavePayload(
  design: TemplateDesign,
  existing: {
    title?: string;
    slug?: string;
    status?: "draft" | "published" | "archived";
    templateData?: PayloadTemplateDoc["templateData"];
    previewImage?: Record<string, unknown> | null;
  },
): DesignPayload {
  const editableLayerCount = design.layers.filter(
    (l) => l.type !== "background" && !l.locked && l.freelyMovable !== false,
  ).length;
  return {
    title: existing.title || design.title || "Untitled Template",
    slug: existing.slug || "untitled-template",
    status: existing.status || "draft",
    canvas: { width: design.width, height: design.height, unit: design.unit, dpi: design.dpi },
    templateData: {
      templateVersion: existing?.templateData?.templateVersion || "1.0.0",
      templateJSON: design,
      layerCount: design.layers.length,
      editableLayerCount,
    },
    previewImage: existing?.previewImage ?? null,
  };
}