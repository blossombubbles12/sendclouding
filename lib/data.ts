import { getPayload } from "payload";
import config from "@payload-config";

export async function getPayloadClient() {
  return getPayload({ config });
}

export interface ProductImage {
  id?: string;
  url?: string;
  alt?: string;
}

export interface PayloadProduct {
  id: string;
  name: string;
  slug: string;
  description?: unknown;
  price: number;
  compareAtPrice?: number | null;
  additionalCustomizationPrice?: number | null;
  sku?: string;
  images?: (ProductImage & { image?: ProductImage })[] | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  featured?: boolean;
  status?: string;
  inventory?: {
    quantity?: number;
    lowStockThreshold?: number;
    trackInventory?: boolean;
  } | null;
  tags?: ({ id?: string; tag?: string } | string)[] | null;
  specifications?: { name?: string; value?: string }[] | null;
  isCustomizable?: boolean;
  customization?: PayloadProductCustomization | null;
  templates?: (PayloadTemplate | string)[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PayloadProductCustomization {
  generalSettings?: {
    customizationType?: "text" | "image" | "image_text" | "full_designer";
  };
  productionSettings?: {
    productionTime?: number;
    designApprovalRequired?: boolean;
    printProvider?: "in_house" | "partner_a" | "partner_b" | "partner_c";
  };
  printSpecifications?: {
    printableAreaWidth?: number;
    printableAreaHeight?: number;
    printableAreaUnit?: "mm" | "cm" | "in" | "px";
    minimumImageResolution?: number;
    bleedArea?: number;
    safeArea?: number;
  };
  uploadRules?: {
    maximumUploadSize?: number;
    allowedImageFormats?: string[];
    allowTransparentPNG?: boolean;
  };
}

export interface PayloadTemplate {
  id: string;
  title: string;
  slug: string;
  description?: string;
  status: "draft" | "published" | "archived";
  previewImage?: ProductImage | null;
  thumbnail?: ProductImage | null;
  linkedProduct?: (string | { id: string; name: string; slug: string }) | null;
  category?: (string | { id: string; name: string; slug: string }) | null;
  createdBy?: (string | { id: string; email: string }) | null;
  updatedBy?: (string | { id: string; email: string }) | null;
  canvas?: {
    width: number;
    height: number;
    unit: "px" | "mm" | "cm" | "in";
    dpi?: number;
  } | null;
  printAreas?: {
    printableArea?: { x: number; y: number; width: number; height: number };
    bleedArea?: number;
    safeArea?: number;
  } | null;
  templateData?: {
    templateVersion?: string;
    templateJSON?: unknown;
    layerCount?: number;
    editableLayerCount?: number;
  } | null;
  versionHistory?: {
    version: string;
    templateJSON: unknown;
    changedBy?: string | { id: string; email: string } | null;
    changeNote?: string;
    changedAt: string;
  }[];
  tags?: ({ id?: string; tag?: string } | string)[] | null;
  sortOrder?: number;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PayloadCategory {
  id: string;
  name: string;
  slug: string;
  description?: unknown;
  image?: ProductImage | null;
  featured?: boolean;
  status?: string;
  sortOrder?: number;
}

export async function getProducts({
  limit = 12,
  page = 1,
  featured,
  category,
  status = "active",
}: {
  limit?: number;
  page?: number;
  featured?: boolean;
  category?: string;
  status?: string;
} = {}): Promise<{ products: PayloadProduct[]; totalDocs: number }> {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "products",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: {
      ...(status ? { status: { equals: status } } : {}),
      ...(featured !== undefined ? { featured: { equals: featured } } : {}),
      ...(category ? { "category.slug": { equals: category } } : {}),
    } as any,
    limit,
    page,
    depth: 2,
    sort: "-createdAt",
  });
  return { products: result.docs as unknown as PayloadProduct[], totalDocs: result.totalDocs };
}

export async function getProductBySlug(slug: string): Promise<PayloadProduct | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "products",
    where: { slug: { equals: slug }, status: { equals: "active" } },
    limit: 1,
    depth: 2,
  });
  return (result.docs[0] as unknown as PayloadProduct) ?? null;
}

export async function getCategories({
  featured,
  status = "active",
}: {
  featured?: boolean;
  status?: string;
} = {}): Promise<PayloadCategory[]> {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "categories",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: {
      ...(status ? { status: { equals: status } } : {}),
      ...(featured !== undefined ? { featured: { equals: featured } } : {}),
    } as any,
    limit: 50,
    depth: 1,
    sort: "sortOrder",
  });
  return result.docs as unknown as PayloadCategory[];
}

export function getProductImage(product: PayloadProduct): { url: string; alt: string } | null {
  const images = product.images;
  if (!images || images.length === 0) return null;
  const first = images[0];
  const image = first.image ?? first;
  return {
    url: image.url ?? "",
    alt: image.alt ?? product.name,
  };
}

export function isInStock(product: PayloadProduct): boolean {
  if (!product.inventory?.trackInventory) return true;
  return (product.inventory?.quantity ?? 0) > 0;
}

export function getTags(product: PayloadProduct): string[] {
  if (!product.tags) return [];
  return product.tags.map((t) => (typeof t === "string" ? t : t.tag ?? ""));
}

// ── Templates ─────────────────────────────────────────────────────────

export async function getTemplates({
  limit = 24,
  page = 1,
  productId,
  categoryId,
  status = "published",
  isDefault,
}: {
  limit?: number;
  page?: number;
  productId?: string;
  categoryId?: string;
  status?: string;
  isDefault?: boolean;
} = {}): Promise<{ templates: PayloadTemplate[]; totalDocs: number }> {
  const payload = await getPayloadClient();

  const result = await payload.find({
    collection: "product-templates",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    where: {
      ...(status ? { status: { equals: status } } : {}),
      ...(productId ? { "linkedProduct": { equals: productId } } : {}),
      ...(categoryId ? { "category": { equals: categoryId } } : {}),
      ...(isDefault !== undefined ? { isDefault: { equals: isDefault } } : {}),
    } as any,
    limit,
    page,
    depth: 2,
    sort: "sortOrder",
  });
  return { templates: result.docs as unknown as PayloadTemplate[], totalDocs: result.totalDocs };
}

export async function getTemplateBySlug(slug: string): Promise<PayloadTemplate | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "product-templates",
    where: { slug: { equals: slug }, status: { equals: "published" } },
    limit: 1,
    depth: 2,
  });
  return (result.docs[0] as unknown as PayloadTemplate) ?? null;
}

export async function getDefaultTemplate(
  productId: string,
): Promise<PayloadTemplate | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "product-templates",
    where: {
      linkedProduct: { equals: productId },
      isDefault: { equals: true },
      status: { equals: "published" },
    },
    limit: 1,
    depth: 2,
    sort: "sortOrder",
  });
  return (result.docs[0] as unknown as PayloadTemplate) ?? null;
}

/** Load a single template by id (used to edit an existing design). */
export async function getTemplateById(id: string): Promise<PayloadTemplate | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "product-templates",
    where: { id: { equals: id } },
    limit: 1,
    depth: 2,
  });
  return (result.docs[0] as unknown as PayloadTemplate) ?? null;
}
