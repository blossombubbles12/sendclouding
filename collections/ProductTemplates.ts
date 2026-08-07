import { CollectionConfig } from "payload";

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const ProductTemplates: CollectionConfig = {
  slug: "product-templates",
  admin: {
    useAsTitle: "title",
    group: "Templates",
    defaultColumns: [
      "title",
      "linkedProduct",
      "category",
      "status",
      "isDefault",
      "templateVersion",
      "updatedAt",
    ],
    listSearchableFields: ["title", "tags.tag"],
    components: {
      views: {
        edit: {
          default: {
            Component: "/components/template-builder/TemplateView#TemplateBuilderView",
          },
        },
      },
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === "admin" || user?.role === "manager",
    update: ({ req: { user } }) => user?.role === "admin" || user?.role === "manager",
    delete: ({ req: { user } }) => user?.role === "admin" || user?.role === "manager",
  },

  // ── Fields ─────────────────────────────────────────────────────────
  fields: [
    // ═══════════════════════════════════════════════════════════════
    // General
    // ═══════════════════════════════════════════════════════════════
    {
      name: "title",
      type: "text",
      required: true,
      label: "Template Title",
      admin: {
        description: "A descriptive name for this template (e.g. 'Birthday Mug Design').",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug",
      admin: {
        description:
          "URL-safe identifier. Auto-generated from title if left empty.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      admin: {
        description: "Internal notes about this template — its purpose, style, or usage.",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
        { label: "Archived", value: "archived" },
      ],
      admin: {
        components: {
          Cell: "/components/StatusBadge#StatusBadge",
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // Images
    // ═══════════════════════════════════════════════════════════════
    {
      name: "previewImage",
      type: "upload",
      relationTo: "media",
      label: "Preview Image",
      admin: {
        description:
          "Full-resolution preview shown in the template detail view and gallery.",
      },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      label: "Thumbnail",
      admin: {
        description:
          "Small thumbnail shown in list views and template pickers (recommended: 200x200).",
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // Relationships
    // ═══════════════════════════════════════════════════════════════
    {
      name: "linkedProduct",
      type: "relationship",
      relationTo: "products",
      hasMany: false,
      required: true,
      label: "Linked Product",
      admin: {
        description:
          "The product this template is designed for (e.g. a coffee mug, t-shirt, banner).",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
      label: "Template Category",
      admin: {
        description:
          "Optional theme or occasion category (e.g. Birthday, Corporate, Wedding).",
      },
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      label: "Created By",
      admin: {
        description: "The admin user who created this template.",
        readOnly: true,
      },
    },
    {
      name: "updatedBy",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      label: "Last Updated By",
      admin: {
        description: "The admin user who last modified this template.",
        readOnly: true,
      },
    },

    // ═══════════════════════════════════════════════════════════════
    // Canvas
    // ═══════════════════════════════════════════════════════════════
    {
      name: "canvas",
      type: "group",
      label: "Canvas",
      admin: {
        description:
          "The overall design canvas dimensions. This is the full working area.",
      },
      fields: [
        {
          name: "width",
          type: "number",
          required: true,
          label: "Width",
          min: 1,
          defaultValue: 800,
        },
        {
          name: "height",
          type: "number",
          required: true,
          label: "Height",
          min: 1,
          defaultValue: 800,
        },
        {
          name: "unit",
          type: "select",
          required: true,
          defaultValue: "px",
          label: "Unit",
          options: [
            { label: "Pixels (px)", value: "px" },
            { label: "Millimeters (mm)", value: "mm" },
            { label: "Centimeters (cm)", value: "cm" },
            { label: "Inches (in)", value: "in" },
          ],
        },
        {
          name: "dpi",
          type: "number",
          label: "DPI",
          defaultValue: 300,
          min: 72,
          admin: {
            description:
              "Dots per inch. Determines the print resolution. 300 DPI is standard for print.",
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // Print Areas
    // ═══════════════════════════════════════════════════════════════
    {
      name: "printAreas",
      type: "group",
      label: "Print Areas",
      admin: {
        description:
          "Defines the printable region, bleed, and safe margins within the canvas.",
      },
      fields: [
        {
          name: "printableArea",
          type: "group",
          label: "Printable Area",
          fields: [
            { name: "x", type: "number", label: "X offset", defaultValue: 0 },
            { name: "y", type: "number", label: "Y offset", defaultValue: 0 },
            {
              name: "width",
              type: "number",
              label: "Width",
              required: true,
              min: 1,
              defaultValue: 800,
            },
            {
              name: "height",
              type: "number",
              label: "Height",
              required: true,
              min: 1,
              defaultValue: 800,
            },
          ],
        },
        {
          name: "bleedArea",
          type: "number",
          label: "Bleed Area",
          min: 0,
          defaultValue: 3,
          admin: {
            description:
              "Extra margin beyond the trim line for full-bleed designs. Standard is 3 mm.",
          },
        },
        {
          name: "safeArea",
          type: "number",
          label: "Safe Area (margin inside trim)",
          min: 0,
          defaultValue: 5,
          admin: {
            description:
              "Margin inside the trim line where text and critical content should stay.",
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // Template Data (versioned JSON)
    // ═══════════════════════════════════════════════════════════════
    {
      name: "templateData",
      type: "group",
      label: "Template Data",
      admin: {
        description:
          "The serialized design data. This JSON describes the template layers and their properties.",
      },
      fields: [
        {
          name: "templateVersion",
          type: "text",
          label: "Version",
          defaultValue: "1.0.0",
          admin: {
            description: "Semantic version for this template (e.g. 1.0.0, 2.1.0).",
          },
        },
        {
          name: "templateJSON",
          type: "json",
          label: "Template JSON",
          admin: {
            description:
              "The raw template data in JSON format. Contains layers, text objects, image placeholders, fonts, colors, and positions.",
          },
        },
        {
          name: "layerCount",
          type: "number",
          label: "Total Layers",
          min: 0,
          admin: { readOnly: true },
        },
        {
          name: "editableLayerCount",
          type: "number",
          label: "Editable Layers",
          min: 0,
          admin: {
            readOnly: true,
            description:
              "Number of layers the customer is allowed to edit (excluding locked/locked backgrounds).",
          },
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // Version History
    // ═══════════════════════════════════════════════════════════════
    {
      name: "versionHistory",
      type: "array",
      label: "Version History",
      admin: {
        description:
          "Previous versions of the template data. New entries are pushed automatically on save.",
      },
      fields: [
        {
          name: "version",
          type: "text",
          required: true,
          label: "Version",
        },
        {
          name: "templateJSON",
          type: "json",
          required: true,
          label: "Template JSON (snapshot)",
        },
        {
          name: "changedBy",
          type: "relationship",
          relationTo: "users",
          hasMany: false,
          label: "Changed By",
        },
        {
          name: "changeNote",
          type: "text",
          label: "Change Note",
        },
        {
          name: "changedAt",
          type: "date",
          required: true,
          defaultValue: () => new Date(),
          label: "Changed At",
        },
      ],
    },

    // ═══════════════════════════════════════════════════════════════
    // Metadata
    // ═══════════════════════════════════════════════════════════════
    {
      name: "tags",
      type: "array",
      label: "Tags",
      admin: {
        description: "Keywords for searchability (e.g. birthday, corporate, wedding).",
      },
      fields: [{ name: "tag", type: "text" }],
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Sort Order",
      defaultValue: 0,
      admin: {
        description:
          "Controls display order. Lower numbers appear first.",
      },
    },
    {
      name: "isDefault",
      type: "checkbox",
      label: "Default Template",
      defaultValue: false,
      admin: {
        description:
          "If checked, this template is the default starting point for its linked product.",
        position: "sidebar",
      },
    },
  ],

  // ── Hooks ───────────────────────────────────────────────────────────
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const doc = data as Record<string, unknown> | undefined;
        if (!doc) return;

        // ── Validate canvas dimensions ──
        const canvas = doc.canvas as Record<string, unknown> | undefined;
        if (canvas) {
          if (canvas.width === undefined || canvas.width === null) {
            throw new Error("Canvas width is required.");
          }
          if (canvas.height === undefined || canvas.height === null) {
            throw new Error("Canvas height is required.");
          }
          if (Number(canvas.width) < 1) {
            throw new Error("Canvas width must be at least 1.");
          }
          if (Number(canvas.height) < 1) {
            throw new Error("Canvas height must be at least 1.");
          }
          if (canvas.dpi !== undefined && canvas.dpi !== null && Number(canvas.dpi) < 72) {
            throw new Error("DPI must be at least 72.");
          }
        }

        // ── Validate print areas ──
        const printAreas = doc.printAreas as Record<string, unknown> | undefined;
        if (printAreas) {
          const pa = printAreas.printableArea as Record<string, unknown> | undefined;
          if (pa) {
            if (pa.width !== undefined && Number(pa.width) < 1) {
              throw new Error("Printable area width must be at least 1.");
            }
            if (pa.height !== undefined && Number(pa.height) < 1) {
              throw new Error("Printable area height must be at least 1.");
            }
          }
        }

        // ── Auto-compute layer counts ──
        const templateData = doc.templateData as Record<string, unknown> | undefined;
        if (templateData?.templateJSON) {
          try {
            const json =
              typeof templateData.templateJSON === "string"
                ? JSON.parse(templateData.templateJSON as string)
                : templateData.templateJSON;
            const layers = Array.isArray(json?.layers) ? json.layers : [];
            templateData.layerCount = layers.length;
            templateData.editableLayerCount = layers.filter(
              (l: Record<string, unknown>) => l?.locked !== true
            ).length;
          } catch {
            // JSON is invalid — keep existing counts
          }
        }

        // ── Validate unique slug ──
        if (doc.slug) {
          (doc as Record<string, string>).slug = toSlug(doc.slug as string);
        }
      },
    ],

    beforeChange: [
      async ({ data, originalDoc, req }) => {
        const doc = data as Record<string, unknown> | undefined;
        const original = originalDoc as Record<string, unknown> | undefined;
        if (!doc) return;

        // ── Auto-generate slug ──
        if (doc.title && !doc.slug) {
          doc.slug = toSlug(doc.title as string);
        }

        // ── Push previous version to history ──
        const td = doc.templateData as Record<string, unknown> | undefined;
        const origTd = original?.templateData as Record<string, unknown> | undefined;

        if (
          td?.templateJSON &&
          origTd?.templateJSON &&
          JSON.stringify(td.templateJSON) !== JSON.stringify(origTd.templateJSON)
        ) {
          const history = (doc.versionHistory as Record<string, unknown>[]) || [];
          history.push({
            version: (origTd.templateVersion as string) || "1.0.0",
            templateJSON: origTd.templateJSON,
            changedBy: req?.user?.id || null,
            changeNote: "",
            changedAt: new Date().toISOString(),
          });
          doc.versionHistory = history;
        }

        // ── Track creator / updater ──
        if (!doc.createdBy && !original?.createdBy) {
          doc.createdBy = req?.user?.id || null;
        }
        if (req?.user?.id) {
          doc.updatedBy = req.user.id;
        }

        return data;
      },
    ],

    afterRead: [
      async ({ doc }) => {
        const template = doc as Record<string, unknown>;
        if (!template.sortOrder && template.sortOrder !== 0) {
          template.sortOrder = 0;
        }
        return template;
      },
    ],
  },

  timestamps: true,
};
