"use client";

import type { DesignOptions, DesignPackage, DesignProductionMetadata, DesignMediaRef } from "./types";

const API = "/api/designs";
const UPLOAD_API = "/api/design/upload";

export interface SavedDesignDoc {
  id: string;
  product?: string | { id: string } | null;
  template?: string | null;
  templateVersion?: string | null;
  status?: string;
  orderNumber?: string | null;
}

const GUEST_KEY = "aquabest-design-guest";

export function getGuestToken(): string {
  if (typeof window === "undefined") return "";
  let token = localStorage.getItem(GUEST_KEY);
  if (!token) {
    token = `guest_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(GUEST_KEY, token);
  }
  return token;
}

function headers(): Record<string, string> {
  return { "Content-Type": "application/json", "x-guest-token": getGuestToken() };
}

function findPlaceholderForAsset(options: DesignOptions, assetId: string): string | undefined {
  for (const [placeholderId, ref] of Object.entries(options.images ?? {})) {
    if (ref?.id === assetId) return placeholderId;
  }
  return undefined;
}

/** Persists (creates or updates) a design doc for the current owner/guest. */
export async function saveDesign(
  pkg: DesignPackage,
  existingId?: string | null,
  status: "draft" | "saved" = "saved",
): Promise<SavedDesignDoc> {
  const guestToken = getGuestToken();
  const body = {
    product: pkg.productId,
    template: pkg.templateId || undefined,
    templateVersion: pkg.templateVersion || undefined,
    designJSON: pkg.design,
    options: pkg.options,
    previewImage: pkg.previewMedia?.id || undefined,
    productionMetadata: pkg.production,
    guestToken,
    status,
    assets: pkg.assets.map((a) => ({
      asset: a.id,
      placeholderId: findPlaceholderForAsset(pkg.options, a.id),
    })),
  };

  const url = existingId ? `${API}/${existingId}` : API;
  const res = await fetch(url, {
    method: existingId ? "PATCH" : "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.[0]?.message || "Failed to save design");
  return data.doc;
}

/** Restore a design by id, or null when none/invalid. */
export async function loadDesign(designId: string): Promise<DesignPackage | null> {
  if (!designId) return null;
  const res = await fetch(`${API}/${designId}?depth=1`, { headers: headers() });
  if (!res.ok) return null;
  const data = await res.json();
  const doc = data.doc || data;
  if (!doc?.designJSON) return null;
  return docToPackage(doc);
}

/** Restore unfinished design for the current guest given an optional design id. */
export async function restoreDesign(designId?: string | null): Promise<DesignPackage | null> {
  return designId ? loadDesign(designId) : null;
}

const LAST_KEY_PREFIX = "aquabest-design-last:";

/** Remember the most recently saved design for a product (auto-restore). */
export function rememberLastDesign(productId: string, designId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${LAST_KEY_PREFIX}${productId}`, designId);
}

/** Id of the most recently saved design for a product, if any. */
export function lastDesignIdFor(productId: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${LAST_KEY_PREFIX}${productId}`);
}

/** Map a raw saved doc back into a DesignPackage shape. */
export function docToPackage(doc: Record<string, unknown>): DesignPackage {
  const product = doc.product as { id?: string } | string | null | undefined;
  return {
    designId: String(doc.id),
    productId: String(typeof product === "object" && product?.id ? product.id : product ?? ""),
    productName: "",
    templateId: (doc.template as string | null | undefined) ?? null,
    templateVersion: (doc.templateVersion as string | null | undefined) ?? null,
    design: doc.designJSON as never,
    options: (doc.options as DesignOptions) ?? { text: {}, images: {} },
    previewImage: null,
    previewMedia: null,
    assets: [],
    production: (doc.productionMetadata as DesignProductionMetadata) ?? ({} as DesignProductionMetadata),
  };
}

/** Upload an image to Media via the design upload route. Returns a media ref. */
export async function uploadDesignImage(file: File | Blob, alt = "Customer upload"): Promise<DesignMediaRef> {
  const fd = new FormData();
  fd.append("file", file, file instanceof File ? file.name : "upload.png");
  fd.append("alt", alt);
  const res = await fetch(UPLOAD_API, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Upload failed");
  return data.doc as DesignMediaRef;
}

/** Convert a PNG data-url into a Blob for upload. */
export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, data] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);/)?.[1] || "image/png";
  const bin = atob(data);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}