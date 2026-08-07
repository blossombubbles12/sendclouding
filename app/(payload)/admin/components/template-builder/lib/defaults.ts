import type {
  AnyLayer,
  ImageLayer,
  MockupDef,
  PrintGeometry,
  TemplateDesign,
  TextLayer,
} from "./types";

export const APP_NAME = "Template Builder";
export const DESIGN_VERSION = 1;

export const DEFAULT_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Poppins",
  "Lato",
  "Oswald",
  "Playfair Display",
  "Bebas Neue",
  "Cormorant Garamond",
  "Space Grotesk",
  "Archivo Black",
  "Dancing Script",
];

export const PRESET_SHAPES = ["rect", "ellipse", "triangle"] as const;

export const PRESET_SVGS: { id: string; label: string; d: string }[] = [
  { id: "star", label: "Star", d: "M12 2l2.9 6.2 6.6.7-4.9 4.5 1.3 6.6L12 17l-5.9 3 1.3-6.6-4.9-4.5 6.6-.7L12 2z" },
  { id: "heart", label: "Heart", d: "M12 21s-7.5-4.7-9.8-9C.6 8 2.5 4 6.6 4c2.2 0 3.6 1.2 5.4 3 1.8-1.8 3.2-3 5.4-3 4.1 0 6 4 4.4 8-2.3 4.3-9.8 9-9.8 9z" },
  { id: "arrow", label: "Arrow", d: "M2 12h16m0 0-6-6m6 6-6 6" },
  { id: "check", label: "Check", d: "M4 12l5 5L20 6" },
  { id: "sun", label: "Sun", d: "M12 7a5 5 0 100 10 5 5 0 000-10zm0-5v2m0 16v2m7-11h2M3 11h2m11.3 5.2 1.4 1.4M6.3 6.3 7.7 7.7m0 8.6-1.4 1.4m12.7-12-1.4 1.4" },
];

export const DEFAULT_MOCKUPS: MockupDef[] = [
  { kind: "flat", label: "Design", shape: "rect", warp: { startX: 0, startY: 0, width: 1, height: 1, rx: 0 } },
  { kind: "mug", label: "Mug", shape: "banner", warp: { startX: 0.06, startY: 0.3, width: 0.88, height: 0.42, rx: 0.25 } },
  { kind: "canvas", label: "Canvas", shape: "rect", warp: { startX: 0.14, startY: 0.12, width: 0.72, height: 0.72, rx: 0 } },
  { kind: "wall-art", label: "Wall Art", shape: "rect", warp: { startX: 0.1, startY: 0.1, width: 0.8, height: 0.8, rx: 0 } },
  { kind: "poster", label: "Poster", shape: "rect", warp: { startX: 0.08, startY: 0.1, width: 0.84, height: 1.16, rx: 0 } },
  { kind: "tshirt", label: "T-Shirt", shape: "tshirt", warp: { startX: 0.28, startY: 0.26, width: 0.44, height: 0.5, rx: 0 } },
  { kind: "phone-case", label: "Phone Case", shape: "rect", warp: { startX: 0.28, startY: 0.12, width: 0.44, height: 0.86, rx: 0.12 } },
  { kind: "sticker", label: "Sticker", shape: "rect", warp: { startX: 0.28, startY: 0.28, width: 0.44, height: 0.44, rx: 0.08 } },
  { kind: "bag", label: "Bag", shape: "rect", warp: { startX: 0.18, startY: 0.2, width: 0.64, height: 0.6, rx: 0 } },
];

export const SNAP_POINTS_PX = 4;
export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 4;

export function createId(prefix = "obj"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function defaultPrintGeometry(width: number, height: number): PrintGeometry {
  const safe = Math.min(width, height) * 0.05;
  const bleed = 0;
  return {
    printable: { x: 0, y: 0, width, height },
    bleed,
    safe,
  };
}

export function createEmptyDesign(): TemplateDesign {
  return {
    app: "signages-templates",
    version: DESIGN_VERSION,
    title: "Untitled Template",
    width: 800,
    height: 800,
    unit: "px",
    dpi: 300,
    canvasColor: "#ffffff",
    layers: [],
  };
}

export function cloneLayer<T extends AnyLayer>(layer: T): T {
  return JSON.parse(JSON.stringify(layer)) as T;
}

export function defaultTextLayer(partial: Partial<TextLayer>): TextLayer {
  return {
    id: createId("txt"),
    name: "Text",
    type: "text",
    x: 60,
    y: 60,
    width: 300,
    height: 60,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    freelyMovable: true,
    groupId: "",
    zIndex: 10,
    text: "Your text here",
    fontFamily: "Inter",
    fontSize: 28,
    fontWeight: "bold",
    fontStyle: "normal",
    fill: "#18181B",
    textAlign: "center",
    textDecoration: "none",
    letterSpacing: 0,
    lineHeight: 1.2,
    rules: {
      editable: true,
      role: "editable_text",
      required: false,
      placeholder: "Type something…",
      maxLength: 120,
      minLength: 0,
      allowedFormats: [],
      maxFileSizeMB: 0,
      minResolution: { width: 0, height: 0 },
      cropMode: "cover",
      aspectRatioLocked: false,
    },
    ...partial,
  } as TextLayer;
}

export function defaultImageLayer(partial: Partial<ImageLayer>): ImageLayer {
  return {
    id: createId("img"),
    name: "Image",
    type: "image",
    x: 80,
    y: 80,
    width: 300,
    height: 300,
    rotation: 0,
    opacity: 1,
    visible: true,
    locked: false,
    freelyMovable: true,
    groupId: "",
    zIndex: 10,
    src: "",
    mediaId: null,
    imageWidth: 300,
    imageHeight: 300,
    cornerRadius: 0,
    crop: { x: 0, y: 0, width: 300, height: 300 },
    rules: {
      editable: true,
      role: "image_placeholder",
      required: false,
      placeholder: "Upload your photo",
      maxLength: 0,
      minLength: 0,
      allowedFormats: ["png", "jpg", "jpeg", "webp"],
      maxFileSizeMB: 10,
      minResolution: { width: 1200, height: 1200 },
      cropMode: "cover",
      aspectRatioLocked: true,
    },
    ...partial,
  } as ImageLayer;
}