import React from "react";
import { getSiteSettings, getLogoUrl, getSiteName } from "@/lib/get-globals";

/**
 * Branded logo shown on the Payload login screen and admin header.
 * Renders the logo uploaded in Site Settings (supports Vercel Blob CDN
 * URLs), falling back to the static brand asset if unavailable.
 */
export async function Logo() {
  const settings = await getSiteSettings();
  const logoUrl = await getLogoUrl(settings);
  const siteName = getSiteName(settings);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={siteName}
        style={{ height: "40px", width: "auto", maxWidth: "220px", objectFit: "contain" }}
      />
    </div>
  );
}

export default Logo;