"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, Package, MapPin, Truck, Settings } from "lucide-react";

/**
 * Custom Admin Navigation Component.
 * Adds Send Clouding section with Dashboard and collection links.
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
      <div
        style={{
          fontSize: "11px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--theme-elevation-500)",
          padding: "0 12px",
          marginBottom: "4px",
        }}
      >
        Send Clouding
      </div>
      <Link
        href="/admin"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--theme-elevation-700)",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 500,
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "background 0.15s ease, color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--theme-elevation-50)";
          e.currentTarget.style.color = "var(--theme-elevation-1000)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--theme-elevation-700)";
        }}
      >
        <LayoutDashboard size={16} />
        <span>Dashboard</span>
      </Link>
      <Link
        href="/admin/collections/shipments"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--theme-elevation-700)",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 500,
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "background 0.15s ease, color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--theme-elevation-50)";
          e.currentTarget.style.color = "var(--theme-elevation-1000)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--theme-elevation-700)";
        }}
      >
        <Package size={16} />
        <span>Shipments</span>
      </Link>
      <Link
        href="/admin/collections/tracking-events"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--theme-elevation-700)",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 500,
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "background 0.15s ease, color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--theme-elevation-50)";
          e.currentTarget.style.color = "var(--theme-elevation-1000)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--theme-elevation-700)";
        }}
      >
        <Truck size={16} />
        <span>Tracking Events</span>
      </Link>
      <Link
        href="/admin/collections/locations"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--theme-elevation-700)",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 500,
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "background 0.15s ease, color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--theme-elevation-50)";
          e.currentTarget.style.color = "var(--theme-elevation-1000)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--theme-elevation-700)";
        }}
      >
        <MapPin size={16} />
        <span>Locations</span>
      </Link>
      <Link
        href="/admin/collections/shipping-methods"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "var(--theme-elevation-700)",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: 500,
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "background 0.15s ease, color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--theme-elevation-50)";
          e.currentTarget.style.color = "var(--theme-elevation-1000)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--theme-elevation-700)";
        }}
      >
        <Settings size={16} />
        <span>Shipping Methods</span>
      </Link>
    </div>
  );
}

export default Nav;