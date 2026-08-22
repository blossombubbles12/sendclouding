import { getPayload } from "payload";
import config from "@payload-config";
import type { SiteSetting, Media } from "@/payload-types";

type PopulatedMedia = Media & { url?: string };

export type SiteSettings = SiteSetting | null;

/**
 * Resolve a media reference (ID or populated object) to its accessible URL.
 * If only an ID is provided, fetch the media record to get its URL.
 */
export async function resolveMediaUrl(
  media: number | PopulatedMedia | null | undefined
): Promise<string | null> {
  if (!media) return null;

  // Already populated with a URL
  if (typeof media !== "number") {
    if (media.url?.startsWith("http")) return media.url; // Vercel Blob CDN URL
    if (media.url?.startsWith("/api/media/")) return media.url; // Local Payload proxy URL
    if (media.url?.startsWith("/")) return media.url; // Absolute path
    return null;
  }

  // ID only — fetch the media record to resolve its URL
  try {
    const payload = await getPayload({ config });
    const doc = await payload.findByID({
      collection: "media",
      id: media,
      depth: 0,
    });
    if (doc?.url?.startsWith("http")) return doc.url;
    if (doc?.url?.startsWith("/api/media/")) return doc.url;
    if (doc?.url?.startsWith("/")) return doc.url;
    return null;
  } catch {
    return null;
  }
}

export async function getSiteSettings(): Promise<SiteSetting> {
  try {
    const payload = await getPayload({ config });
    const siteSettings = await payload.findGlobal({
      slug: "site-settings",
      depth: 1, // populate logo/favicon media objects
    });
    return siteSettings ?? ({} as SiteSetting);
  } catch {
    // Global not created yet — return empty object with defaults applied downstream
    return {} as SiteSetting;
  }
}

export function getSiteName(settings: SiteSetting | null | undefined): string {
  return settings?.siteName ?? "Send Clouding";
}

export async function getFaviconUrl(
  settings: SiteSetting | null | undefined
): Promise<string> {
  const favicon = settings?.favicon;
  return (
    (await resolveMediaUrl(favicon as number | PopulatedMedia | null | undefined)) ??
    "/sendclouding-logo.svg"
  );
}

export async function getLogoUrl(
  settings: SiteSetting | null | undefined
): Promise<string> {
  const logo = settings?.logo;
  return (
    (await resolveMediaUrl(logo as number | PopulatedMedia | null | undefined)) ??
    "/sendclouding-logo.svg"
  );
}

export function getLogoAlt(settings: SiteSetting | null | undefined): string {
  const logo = settings?.logo;
  if (logo && typeof logo !== "number" && logo.alt) return logo.alt;
  return getSiteName(settings);
}