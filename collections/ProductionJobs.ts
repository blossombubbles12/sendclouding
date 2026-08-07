import { CollectionConfig } from "payload";
import { INITIAL_STATUS, PRINT_AREAS, PRODUCTION_STATUSES } from "../lib/production/types";

export const ProductionJobs: CollectionConfig = {
  slug: "production-jobs",
  admin: {
    useAsTitle: "jobNumber",
    group: "Fulfilment",
    defaultColumns: [
      "jobNumber",
      "order",
      "status",
      "provider",
      "assignedTo",
      "itemCount",
      "updatedAt",
    ],
    description:
      "Print production jobs auto-created from customized orders after payment is confirmed.",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => user?.role === "admin" || user?.role === "manager",
    update: ({ req: { user } }) => user?.role === "admin" || user?.role === "manager",
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "jobNumber",
      type: "text",
      required: true,
      unique: true,
      label: "Job Number",
      admin: { description: "Human-readable reference (e.g. PRD-XXXX)." },
    },
    {
      name: "order",
      type: "relationship",
      relationTo: "orders",
      required: true,
      label: "Source Order",
      admin: { description: "The order this production job fulfils." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: INITIAL_STATUS,
      options: PRODUCTION_STATUSES.map((s) => ({
        label: s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: s,
      })),
      admin: {
        description: "Current step in the production workflow.",
      },
    },
    {
      name: "provider",
      type: "select",
      required: true,
      defaultValue: "in_house",
      options: [
        { label: "In-House", value: "in_house" },
        { label: "Printful", value: "printful" },
        { label: "Printify", value: "printify" },
        { label: "Gelato", value: "gelato" },
        { label: "Custom Provider", value: "custom" },
      ],
      label: "Print Provider",
    },
    {
      name: "externalId",
      type: "text",
      admin: {
        readOnly: true,
        description: "Provider-side job/order id once dispatched externally.",
      },
    },
    {
      name: "externalStatus",
      type: "text",
      admin: { readOnly: true, description: "Raw status string reported by the provider." },
    },
    {
      name: "submittedAt",
      type: "date",
      admin: { readOnly: true, description: "When the job was dispatched to the provider." },
    },

    // ── Review ──────────────────────────────────────────────────────
    {
      name: "review",
      type: "group",
      label: "Artwork Review",
      admin: {
        description: "Production sign-off before printing begins.",
      },
      fields: [
        {
          name: "status",
          type: "select",
          defaultValue: "pending",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ],
        },
        {
          name: "reviewedBy",
          type: "relationship",
          relationTo: "users",
          admin: { readOnly: true },
        },
        {
          name: "reviewedAt",
          type: "date",
          admin: { readOnly: true },
        },
        {
          name: "comments",
          type: "textarea",
          admin: {
            description: "Production review notes for the artwork.",
          },
        },
        {
          name: "approvalNote",
          type: "textarea",
          admin: { description: "Internal approval note (optional)." },
        },
      ],
    },

    // ── Plan & items ────────────────────────────────────────────────
    {
      name: "itemCount",
      type: "number",
      min: 0,
      defaultValue: 0,
      admin: { readOnly: true, position: "sidebar" },
    },
    {
      name: "items",
      type: "array",
      label: "Production Items",
      admin: {
        description: "Each customized line isolated one per product/print area.",
      },
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          label: "Product",
        },
        { name: "name", type: "text", label: "Product name" },
        { name: "sku", type: "text", label: "SKU" },
        { name: "quantity", type: "number", min: 1, defaultValue: 1 },
        { name: "unitPrice", type: "number", min: 0 },
        {
          name: "printAreas",
          type: "select",
          hasMany: true,
          defaultValue: ["front"],
          options: PRINT_AREAS.map((a) => ({ label: a, value: a })),
          label: "Print areas",
          admin: { description: "Where on the product this design is printed." },
        },
        {
          name: "templateVersion",
          type: "text",
          label: "Template version",
        },
        {
          name: "designJSON",
          type: "json",
          label: "Design JSON",
          admin: { description: "Full serialized customer design (source of truth)." },
        },
        {
          name: "options",
          type: "json",
          label: "Customization",
          admin: { description: "Customer text/image answers keyed by placeholder id." },
        },
        {
          name: "production",
          type: "json",
          label: "Production metadata",
        },
        {
          name: "previewImage",
          type: "upload",
          relationTo: "media",
          label: "Preview image",
        },
        {
          name: "assets",
          type: "array",
          label: "Source assets",
          fields: [
            {
              name: "asset",
              type: "upload",
              relationTo: "media",
              label: "Asset file",
              required: true,
            },
            { name: "placeholderId", type: "text", label: "Placeholder" },
          ],
        },
        {
          name: "printReadyFiles",
          type: "array",
          label: "Print-ready files",
          admin: { description: "Generated SVG/PNG/PDF masters." },
          fields: [
            { name: "format", type: "text", label: "Format" },
            { name: "widthPx", type: "number" },
            { name: "heightPx", type: "number" },
            { name: "unit", type: "text" },
            { name: "dpi", type: "number" },
            {
              name: "file",
              type: "upload",
              relationTo: "media",
              label: "Generated file",
            },
            { name: "name", type: "text" },
            { name: "size", type: "number", admin: { description: "Byte size." } },
          ],
        },
      ],
    },

    // ── History / audit ─────────────────────────────────────────────
    {
      name: "history",
      type: "array",
      label: "History",
      admin: {
        readOnly: true,
        description: "Audit trail of status changes and staff actions.",
      },
      fields: [
        { name: "status", type: "text" },
        { name: "action", type: "text", required: true },
        { name: "note", type: "textarea" },
        {
          name: "actor",
          type: "relationship",
          relationTo: "users",
        },
        { name: "at", type: "date" },
      ],
    },
    {
      name: "staffNotes",
      type: "textarea",
      admin: { description: "Internal comms across shifts." },
    },
  ],
  timestamps: true,
};