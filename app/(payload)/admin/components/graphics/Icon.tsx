import React from "react";
import { getSiteSettings, getLogoUrl, getSiteName } from "@/lib/get-globals";

/**
 * Compact brand mark used for the collapsed navigation / favicon-style slot.
 * Uses the logo uploaded in Site Settings, falling back to the static asset.
 */
export async function Icon() {
  const settings = await getSiteSettings();
  const logoUrl = await getLogoUrl(settings);
  const siteName = getSiteName(settings);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={siteName}
      width={24}
      height={24}
      style={{ objectFit: "contain" }}
    />
  );
}

export default Icon;