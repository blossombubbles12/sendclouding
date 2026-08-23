"use client";

import React from "react";
import { useDocumentInfo } from "@payloadcms/ui";

/**
 * Renders a "Invoice & Packing Slip" button in the Shipments document header.
 * Links to the branded invoice/packing-slip document for the current shipment.
 */
export function ShipmentDocumentsButton() {
  const { id, collectionSlug } = useDocumentInfo();

  if (collectionSlug !== "shipments" || !id) return null;

  return (
    <a
      href={`/api/shipments/${id}/documents`}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        marginRight: "10px",
        padding: "8px 16px",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: 600,
        lineHeight: "20px",
        color: "#ffffff",
        background: "#0EA5E9",
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Invoice &amp; Packing Slip
    </a>
  );
}

export default ShipmentDocumentsButton;