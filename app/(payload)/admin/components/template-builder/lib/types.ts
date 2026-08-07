// ─────────────────────────────────────────────────────────────────────────────
// Core template data model.
//
// This is the single source of truth for a template's design. It is serialized
// into `templateData.templateJSON` and is intentionally engine-agnostic so it
// can be re-used by the customer-facing designer (Phase 3) without changes.
// -----------------------------------------------------------------------------

export type LayerType = "text" | "image" | "shape" | "svg" | "group" | "background";

export type Role =
  | "static" // locked, non-editable (decorative branding)
  | "design" // editable artwork a customer CAN change
  | "editable_text" // text placeholder the customer can fill
  | "image_placeholder"; // image placeholder the customer must supply

/** All layers share these transform / lifecycle properties. */
export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  x: number;
  y: number;
  width: number;
  height: number;
  /** degrees, clockwise */
  rotation: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  /** Can the end customer move/scale/rotate this layer? */
  freelyMovable: boolean;
  /** Combines the customer-editable + static artwork into one group node. */
  groupId: string;
  zIndex: number;
}

/** Validation rules attached to customer-facing placeholders. */
export interface PlaceholderRules {
  editable: boolean;
  role: Role;
  required: boolean;
  /** Preview text shown when empty (text only). */
  placeholder: string;
  /** Text only */
  maxLength: number;
  minLength: number;
  /** Image only */
  allowedFormats: string[];
  maxFileSizeMB: number;
  minResolution: { width: number; height: number };
  /** "cover" | "contain" | "stretch" | "crop" */
  cropMode: "cover" | "contain" | "stretch" | "crop";
  /** lock canvas width/height ratio when the customer replaces the image */
  aspectRatioLocked: boolean;
}

export interface TextLayer extends BaseLayer {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | "normal" | "bold";
  fontStyle: "normal" | "italic";
  fill: string;
  textAlign: "left" | "center" | "right" | "justify";
  textDecoration: "none" | "underline" | "line-through";
  letterSpacing: number;
  lineHeight: number;
  rules: PlaceholderRules;
}

export interface ImageLayer extends BaseLayer {
  type: "image";
  /** resolved asset — either a Media library doc or a direct URL */
  src: string;
  mediaId: string | null;
  imageWidth: number;
  imageHeight: number;
  cornerRadius: number;
  /** crop window for the placeholder (aspect ratio lock applied here) */
  crop: { x: number; y: number; width: number; height: number };
  rules: PlaceholderRules;
}

export interface ShapeLayer extends BaseLayer {
  type: "shape";
  kind: "rect" | "ellipse" | "triangle";
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowOpacity: number;
}

export interface SvgLayer extends BaseLayer {
  type: "svg";
  /** path `d` string or an object with nested sub-shapes */
  paths: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
  /** A short label used by the asset picker */
  icon: string;
}

export interface GroupLayer extends BaseLayer {
  type: "group";
  children: string[];
}

export interface BackgroundLayer extends BaseLayer {
  type: "background";
  kind: "solid" | "image";
  fill: string;
  src: string | null;
  mediaId: string | null;
}

export type AnyLayer =
  | TextLayer
  | ImageLayer
  | ShapeLayer
  | SvgLayer
  | GroupLayer
  | BackgroundLayer;

/** Top-level serializable design. */
export interface TemplateDesign {
  app: "signages-templates";
  version: number;
  title: string;
  width: number;
  height: number;
  unit: "px" | "mm" | "cm" | "in";
  dpi: number;
  canvasColor: string;
  layers: AnyLayer[];
}

export interface PrintGeometry {
  /** printable area within the canvas */
  printable: { x: number; y: number; width: number; height: number };
  bleed: number;
  safe: number;
}

export type EditorMode = "select" | "pan" | "hand";

export type DrawingTool = "rect" | "ellipse" | "text";

// ── In-editor shape when a layer is being authored (during drag) ─────────────
export interface DraftShape {
  tool: DrawingTool | "image" | "svg";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EditorSnapshot {
  design: TemplateDesign;
  selection: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Payload document shapes (loosely typed — matches the collection)
// ─────────────────────────────────────────────────────────────────────────────

export interface PayloadTemplateDoc {
  id?: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  description?: string | null;
  canvas?: {
    width: number;
    height: number;
    unit: "px" | "mm" | "cm" | "in";
    dpi?: number;
  } | null;
  printAreas?: {
    printableArea?: { x: number; y: number; width: number; height: number } | null;
    bleedArea?: number;
    safeArea?: number;
  } | null;
  templateData?: {
    templateVersion?: string;
    templateJSON?: Record<string, unknown> | null;
    layerCount?: number;
    editableLayerCount?: number;
  } | null;
  linkedProduct?: string | null;
  previewImage?: null;
  thumbnail?: null;
  updatedAt?: string;
}

/** Server component props from Payload's document view. */
export interface PayloadDoc {
  id?: string;
  title?: string;
  slug?: string;
  status?: "draft" | "published" | "archived";
  templateData?: {
    templateVersion?: string;
    templateJSON?: Record<string, unknown> | null;
    layerCount?: number;
    editableLayerCount?: number;
  } | null;
  canvas?: { width: number; height: number; unit: "px" | "mm" | "cm" | "in"; dpi?: number } | null;
  printAreas?: {
    printableArea?: { x: number; y: number; width: number; height: number } | null;
    bleedArea?: number;
    safeArea?: number;
  } | null;
}

export interface DocumentViewProps {
  doc?: PayloadDoc;
  routeSegments?: string[];
  collectionSlug?: string;
  [key: string]: unknown;
}

// ── Mockups ─────────────────────────────────────────────────────────────────
export type MockupKind =
  | "flat"
  | "mug"
  | "canvas"
  | "wall-art"
  | "tshirt"
  | "phone-case"
  | "sticker"
  | "bag"
  | "poster";

export interface MockupDef {
  kind: MockupKind;
  label: string;
  /** draw the design onto this mockup — the editor renders a simple SVG-ish scene */
  shape: "rect" | "banner" | "tshirt";
  /** CSS transform-ish mapping hints for preview rendering */
  warp: { startX: number; startY: number; width: number; height: number; rx: number };
}