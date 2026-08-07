// ─────────────────────────────────────────────────────────────────────────────
// Print-ready master generation.
//
// Given a customer-filled `TemplateDesign`, produce print-ready masters:
// a resolution-independent SVG plus 300 DPI rasterized PNG and PDF. Rasterization
// uses sharp (already bundled via Payload). Output is deterministic so re-running
// with the same input is idempotent.
// -----------------------------------------------------------------------------

import sharp from "sharp";
import type { AnyLayer, TemplateDesign } from "@/app/(payload)/admin/components/template-builder/lib/types";

export interface PrintMasterResult {
  svg: string;
  png: Buffer;
  pdf: Buffer;
  widthPx: number;
  heightPx: number;
  unit: string;
  dpi: number;
}

export interface CanvasInfo {
  widthPx: number;
  heightPx: number;
  dpi: number;
  unit: string;
}

const FONT_FAMILY = "Arial, Helvetica, sans-serif";

/**
 * Translate the design's logical canvas into print pixels at the requested DPI.
 * Physical coords (mm/cm/in) scale directly; pixel coords are scaled to density
 * assuming the design was authored at `design.dpi` (defaulting to 72 px/in).
 */
export function computeCanvasForPrint(design: TemplateDesign, requestedDpi = 300): CanvasInfo {
  const dpi = Math.max(72, design.dpi || requestedDpi);
  const unit = design.unit || "px";

  let scale: number;
  if (unit === "mm") scale = dpi / 25.4;
  else if (unit === "cm") scale = dpi / 25.4 / 10;
  else if (unit === "in") scale = dpi;
  else scale = dpi / (design.dpi || 72);

  const widthPx = Math.max(1, Math.round((design.width || 800) * scale));
  const heightPx = Math.max(1, Math.round((design.height || 800) * scale));

  return { widthPx, heightPx, dpi, unit };
}

function esc(s: unknown): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function transformAttrs(opacity: number | undefined, rotation: number | undefined, cx: number, cy: number): string {
  const parts: string[] = [];
  if (typeof opacity === "number" && opacity < 1) parts.push(`opacity="${opacity}"`);
  if (rotation) parts.push(`transform="rotate(${rotation} ${cx} ${cy})"`);
  return parts.length ? ` ${parts.join(" ")}` : "";
}

function renderLayer(layer: AnyLayer, cw: number, ch: number): string {
  switch (layer.type) {
    case "background":
      return renderBackgroundLayer(layer, cw, ch);
    case "text":
      return renderTextLayer(layer);
    case "image":
      return renderImageLayer(layer);
    case "shape":
      return renderShapeLayer(layer);
    case "svg":
      return renderSvgLayer(layer);
    default:
      return "";
  }
}

function renderTextLayer(layer: Extract<AnyLayer, { type: "text" }>): string {
  const cx = layer.x + layer.width / 2;
  const cy = layer.y + layer.height / 2;
  const anchor = layer.textAlign === "center" ? "middle" : layer.textAlign === "right" ? "end" : "start";
  const fontSize = layer.fontSize || 16;
  const lineHeight = fontSize * (layer.lineHeight || 1.2);
  const lines = String(layer.text ?? "").split("\n");
  const tspans = lines
    .map((ln: string, i: number) => `<tspan x="${layer.x}" dy="${i === 0 ? 0 : lineHeight}">${esc(ln)}</tspan>`)
    .join("");

  return `<text x="${layer.x}" y="${layer.y}" font-family="${esc(layer.fontFamily || FONT_FAMILY)}" font-size="${fontSize}" font-style="${layer.fontStyle || "normal"}" ${layer.fontWeight ? `font-weight="${layer.fontWeight}"` : ""} ${layer.fill ? `fill="${esc(layer.fill)}"` : ""} ${layer.letterSpacing ? `letter-spacing="${layer.letterSpacing}"` : ""} text-anchor="${anchor}"${transformAttrs(layer.opacity, layer.rotation, cx, cy)}>${tspans}</text>`;
}

function renderBackgroundLayer(layer: Extract<AnyLayer, { type: "background" }>, cw: number, ch: number): string {
  if (layer.kind === "image" && layer.src) {
    return `<image x="0" y="0" width="${cw}" height="${ch}" href="${esc(layer.src)}" preserveAspectRatio="xMidYMid slice" />`;
  }
  return `<rect x="0" y="0" width="${cw}" height="${ch}" fill="${layer.fill || "#fff"}"${transformAttrs(layer.opacity, layer.rotation, cw / 2, ch / 2)} />`;
}

function renderImageLayer(layer: Extract<AnyLayer, { type: "image" }>): string {
  if (!layer.src) return "";
  const cx = layer.x + layer.width / 2;
  const cy = layer.y + layer.height / 2;
  const crop = layer.crop && layer.crop.width && layer.crop.height
    ? `${layer.crop.x} ${layer.crop.y} ${layer.crop.width} ${layer.crop.height}`
    : `${layer.imageWidth || layer.width} ${layer.imageHeight || layer.height}`;
  const r = layer.cornerRadius || 0;
  const clip = `<clipPath id="clip-${esc(layer.id)}"><rect x="${layer.x}" y="${layer.y}" width="${layer.width}" height="${layer.height}" rx="${r}" /></clipPath>`;
  return `<defs>${clip}</defs><image x="${layer.x}" y="${layer.y}" clip-path="url(#clip-${esc(layer.id)})" href="${esc(layer.src)}" preserveAspectRatio="xMidYMid slice"${transformAttrs(layer.opacity, layer.rotation, cx, cy)} />`;
}

function renderShapeLayer(layer: Extract<AnyLayer, { type: "shape" }>): string {
  const cx = layer.x + layer.width / 2;
  const cy = layer.y + layer.height / 2;
  const fill = layer.fill || "none";
  const stroke = layer.stroke && layer.stroke !== "none"
    ? ` stroke="${esc(layer.stroke)}" stroke-width="${layer.strokeWidth || 0}"`
    : "";
  if (layer.kind === "ellipse") {
    return `<ellipse cx="${cx}" cy="${cy}" rx="${layer.width / 2}" ry="${layer.height / 2}" fill="${fill}"${stroke}${transformAttrs(layer.opacity, layer.rotation, cx, cy)} />`;
  }
  if (layer.kind === "triangle") {
    return `<path d="M ${layer.x} ${layer.y} L ${layer.x + layer.width / 2} ${layer.y + layer.height} L ${layer.x + layer.width} ${layer.y} Z" fill="${fill}"${stroke}${transformAttrs(layer.opacity, layer.rotation, cx, cy)} />`;
  }
  const r = layer.cornerRadius || 0;
  return `<rect x="${layer.x}" y="${layer.y}" width="${layer.width}" height="${layer.height}" rx="${r}" fill="${fill}"${stroke}${transformAttrs(layer.opacity, layer.rotation, cx, cy)} />`;
}

function renderSvgLayer(layer: Extract<AnyLayer, { type: "svg" }>): string {
  if (!layer.paths) return "";
  const cx = layer.x + layer.width / 2;
  const cy = layer.y + layer.height / 2;
  return `<g${transformAttrs(layer.opacity, layer.rotation, cx, cy)}><path d="${esc(layer.paths)}" fill="${esc(layer.fill || "none")}" ${layer.stroke && layer.stroke !== "none" ? `stroke="${esc(layer.stroke)}" stroke-width="${layer.strokeWidth || 0}"` : ""} /></g>`;
}

/** Serialize a filled design to a self-contained SVG. */
export function designToSvg(design: TemplateDesign): string {
  const w = design.width || 800;
  const h = design.height || 800;
  const layers = (design.layers || [])
    .filter((l) => l?.visible !== false)
    .sort((a, b) => (a?.zIndex ?? 0) - (b?.zIndex ?? 0));

  const body = layers.map((l) => renderLayer(l, w, h)).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
}

/**
 * Produce all masters (SVG text, PNG + PDF buffers) for a filled design.
 */
export async function generatePrintMasters(design: TemplateDesign, requestedDpi = 300): Promise<PrintMasterResult> {
  const canvas = computeCanvasForPrint(design, requestedDpi);
  const svg = designToSvg(design);
  const svgBuffer = Buffer.from(svg);

  const png = await sharp(svgBuffer, { density: canvas.dpi })
    .resize(canvas.widthPx, canvas.heightPx, { fit: "fill" })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const pdf = await buildPdf(png, canvas.widthPx, canvas.heightPx, canvas.dpi);

  return {
    svg,
    png,
    pdf,
    widthPx: canvas.widthPx,
    heightPx: canvas.heightPx,
    unit: canvas.unit,
    dpi: canvas.dpi,
  };
}

// ── Minimal single-page PDF writer (embeds the raster as DCT-decoded JPEG) ──

async function buildPdf(pngBytes: Buffer, widthPx: number, heightPx: number, dpi: number): Promise<Buffer> {
  const widthPt = Math.max(1, (widthPx / dpi) * 72);
  const heightPt = Math.max(1, (heightPx / dpi) * 72);

  // Re-encode as JPEG for DCTDecode embedding.
  const jpeg = await sharp(pngBytes).jpeg({ quality: 92 }).toBuffer();

  const objects: string[] = [];
  const offsets: number[] = [];

  // object 1: catalog
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  // object 2: pages
  objects.push("<< /Type /Pages /Count 1 /Kids [3 0 R] >>");
  // object 3: page
  objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${widthPt} ${heightPt}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`);
  // object 4: image
  objects.push(`<< /Type /XObject /Subtype /Image /Width ${widthPx} /Height ${heightPx} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n` + jpeg.toString("binary") + `\nendstream`);
  // object 5: content stream
  objects.push(`q\n${widthPt} 0 0 ${heightPt} 0 0 cm\n/Im0 Do\nQ`);

  const header = "%PDF-1.4\n%\xe2\xe3\xcf\xd3\n";
  let body = header;
  for (let i = 0; i < objects.length; i++) {
    offsets[i] = body.length;
    body += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xrefPos = body.length;
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";
  for (let i = 0; i < objects.length; i++) {
    body += `${offsetStr(offsets[i])} 00000 n \n`;
  }
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  return Buffer.from(body, "binary");
}

function offsetStr(n: number): string {
  return String(n).padStart(10, "0");
}