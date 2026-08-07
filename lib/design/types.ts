import type { AnyLayer, TemplateDesign } from "@/app/(payload)/admin/components/template-builder/lib/types";

export type { TemplateDesign, AnyLayer };

/** A ref to a media asset used by a design placeholder. */
export interface DesignMediaRef {
  id: string;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
}

/** Customization options selected / filled by the customer. */
export interface DesignOptions {
  /** placeholderId -> raw customer answer for text placeholders */
  text: Record<string, string>;
  /** placeholderId -> media ref for image placeholders */
  images: Record<string, DesignMediaRef>;
  /** custom notes captured by the storefront (optional) */
  note?: string;
}

/** Production-ready metadata persisted for the print workflow. */
export interface DesignProductionMetadata {
  productId: string;
  templateId?: string | null;
  templateVersion?: string | null;
  productName: string;
  canvas: { width: number; height: number; unit: string; dpi: number };
  print: {
    widthMm?: number;
    heightMm?: number;
    unit?: string;
    minResolutionDpi?: number;
    productionTimeDays?: number;
    printProvider?: string;
    designApprovalRequired?: boolean;
  };
  requiredPlaceholderCount: number;
  completedPlaceholderCount: number;
  allRequiredCompleted: boolean;
}

/**
 * The full artifact produced by the customer designer and attached to a cart line
 * (and later persisted onto the order). This is the single design-package contract.
 */
export interface DesignPackage {
  designId: string;
  productId: string;
  productName: string;
  templateId?: string | null;
  templateVersion?: string | null;
  /** The filled-in design. The source of truth for production. */
  design: TemplateDesign;
  /** Light denormalised answers for display / validation. */
  options: DesignOptions;
  /** Preview image (base64 data-url OR a media URL once stored). */
  previewImage: string | null;
  /** Preview image persisted as a Media asset (null until it survives the round-trip). */
  previewMedia?: DesignMediaRef | null;
  /** Media assets referenced by image placeholders (securely linked via ids). */
  assets: DesignMediaRef[];
  production: DesignProductionMetadata;
}