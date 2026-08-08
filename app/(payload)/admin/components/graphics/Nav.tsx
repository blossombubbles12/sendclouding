import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";

/**
 * Custom Admin Navigation Component.
 * Extends the default Payload Hub/nav array with direct top hooks.
 */
export function Nav() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "16px 20px 8px",
        borderBottom: "1px solid var(--theme-elevation-100)",
        marginBottom: "8px",
      }}
    >
      <Link
        href="/admin"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--theme-elevation-800)",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 600,
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "background 0.15s ease, color 0.15s ease",
        }}
        // Hover effects styled seamlessly using native CSS var overrides
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--theme-elevation-50)";
          e.currentTarget.style.color = "var(--theme-elevation-1000)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--theme-elevation-800)";
        }}
      >
        <Home size={16} />
        <span>Dashboard Home</span>
      </Link>
    </div>
  );
}

export default Nav;
