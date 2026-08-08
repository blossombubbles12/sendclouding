import React from "react";

/**
 * Branded logo shown on the Payload login screen and other auth views.
 * Pure presentational server component — renders the site's actual static
 * logo asset (no Payload/DB call) so it always renders, even if the DB is
 * unreachable.
 */
export function Logo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.jpg.png" alt="Signages" style={{ height: "40px", width: "auto" }} />
    </div>
  );
}

export default Logo;
