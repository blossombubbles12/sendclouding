import { getPayload } from "payload";
import config from "@payload-config";

export type Logo = {
  id?: string;
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
} | null;

export async function getSiteSettings() {
  const payload = await getPayload({ config });
  const siteSettings = await payload.findGlobal({
    slug: "site-settings",
  });
  return siteSettings;
}
