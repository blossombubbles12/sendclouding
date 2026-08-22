import { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    group: "Catalog",
    defaultColumns: ["name", "price", "status", "category", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    // ── General ──────────────────────────────────────────────────────
    {
      name: "name",
      type: "text",
      required: true,
      label: "Product Name",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug",
      admin: { description: "URL-friendly version of the name" },
    },
    {
      name: "description",
      type: "richText",
      label: "Description",
    },
    {
      name: "price",
      type: "number",
      required: true,
      label: "Price (EUR)",
      min: 0,
    },
    {
      name: "compareAtPrice",
      type: "number",
      label: "Compare-at Price (EUR)",
      min: 0,
    },
    {
      name: "additionalCustomizationPrice",
      type: "number",
      label: "Additional Customization Price (EUR)",
      min: 0,
      defaultValue: 0,
      admin: {
        description:
          "Extra charge applied per unit when the customer customizes this product. Added on top of the base price.",
      },
    },

    // ── Identifiers ──────────────────────────────────────────────────
    {
      name: "sku",
      type: "text",
      label: "SKU",
      unique: true,
    },
    {
      name: "barcode",
      type: "text",
      label: "Barcode",
    },

    // ── Media ────────────────────────────────────────────────────────
    {
      name: "images",
      type: "array",
      label: "Product Images",
      minRows: 0,
      maxRows: 10,
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "alt",
          type: "text",
          label: "Alt Text",
        },
      ],
    },

    // ── Category ────────────────────────────────────────────────────
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: "Category",
      hasMany: false,
      required: true,
    },

    // ── Inventory ────────────────────────────────────────────────────
    {
      name: "inventory",
      type: "group",
      label: "Inventory",
      fields: [
        {
          name: "quantity",
          type: "number",
          label: "Quantity",
          defaultValue: 0,
          min: 0,
        },
        {
          name: "lowStockThreshold",
          type: "number",
          label: "Low Stock Threshold",
          defaultValue: 10,
          min: 0,
        },
        {
          name: "trackInventory",
          type: "checkbox",
          label: "Track Inventory",
          defaultValue: true,
        },
      ],
    },

    // ── Status ──────────────────────────────────────────────────────
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Draft", value: "draft" },
        { label: "Out of Stock", value: "outOfStock" },
      ],
      admin: {
        components: {
          Cell: "/components/StatusBadge#StatusBadge",
        },
      },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Featured Product",
      defaultValue: false,
    },

    // ── Tags ─────────────────────────────────────────────────────────
    {
      name: "tags",
      type: "array",
      label: "Tags",
      fields: [{ name: "tag", type: "text" }],
    },

    // ── Shipping ────────────────────────────────────────────────────
    {
      name: "weight",
      type: "number",
      label: "Weight (kg)",
      min: 0,
    },
    {
      name: "dimensions",
      type: "group",
      label: "Dimensions (cm)",
      fields: [
        { name: "length", type: "number", label: "Length", min: 0 },
        { name: "width", type: "number", label: "Width", min: 0 },
        { name: "height", type: "number", label: "Height", min: 0 },
      ],
    },

    // ── Specifications ──────────────────────────────────────────────
    {
      name: "specifications",
      type: "array",
      label: "Specifications",
      fields: [
        { name: "name", type: "text", required: true, label: "Specification Name" },
        { name: "value", type: "text", required: true, label: "Value" },
      ],
    },

    // ── POD Customization Toggle ────────────────────────────────────
    {
      name: "isCustomizable",
      type: "checkbox",
      label: "Enable Customization",
      defaultValue: false,
      admin: {
        description:
          "When enabled, customers can personalize this product with text, images, or a full design before adding to cart.",
        position: "sidebar",
      },
    },

    // ── Templates ──────────────────────────────────────────────────
    {
      name: "templates",
      type: "relationship",
      relationTo: "product-templates",
      hasMany: true,
      label: "Design Templates",
      admin: {
        description:
          "Design templates available for this product. Shown in the customer designer for quick-start customization.",
      },
    },

    // ══════════════════════════════════════════════════════════════════
    // Customization Settings (visible only when isCustomizable = true)
    // ══════════════════════════════════════════════════════════════════
    {
      name: "customization",
      type: "group",
      label: "Customization Settings",
      admin: {
        condition: (_, siblingData) => siblingData?.isCustomizable === true,
        description: "Configure how customers can personalize this product.",
      },
      fields: [
        // ── General ──────────────────────────────────────────────
        {
          name: "generalSettings",
          type: "group",
          label: "General",
          fields: [
            {
              name: "customizationType",
              type: "select",
              dbName: "customType",
              required: true,
              defaultValue: "text",
              label: "Customization Type",
              options: [
                { label: "Text Only", value: "text" },
                { label: "Image Upload", value: "image" },
                { label: "Image + Text", value: "image_text" },
                { label: "Full Designer", value: "full_designer" },
              ],
              admin: {
                description:
                  "What kind of customization the customer can perform on this product.",
              },
            },
          ],
        },

        // ── Production ───────────────────────────────────────────
        {
          name: "productionSettings",
          type: "group",
          label: "Production",
          fields: [
            {
              name: "productionTime",
              type: "number",
              label: "Production Time (days)",
              min: 0,
              defaultValue: 3,
              admin: {
                description:
                  "Estimated additional production days for customized orders.",
              },
            },
            {
              name: "designApprovalRequired",
              type: "checkbox",
              label: "Require Design Approval",
              defaultValue: true,
              admin: {
                description:
                  "If enabled, the customer receives a proof for approval before production begins.",
              },
            },
            {
              name: "printProvider",
              type: "select",
              dbName: "printProvider",
              label: "Print Provider",
              options: [
                { label: "In-House", value: "in_house" },
                { label: "Partner A", value: "partner_a" },
                { label: "Partner B", value: "partner_b" },
                { label: "Partner C", value: "partner_c" },
              ],
              defaultValue: "in_house",
              admin: {
                description:
                  "Which facility or partner handles production of this customizable product.",
              },
            },
          ],
        },

        // ── Print Specifications ─────────────────────────────────
        {
          name: "printSpecifications",
          type: "group",
          label: "Print Specifications",
          fields: [
            {
              name: "printableAreaWidth",
              type: "number",
              required: true,
              label: "Printable Area Width",
              min: 1,
              admin: { description: "Width of the area available for printing." },
            },
            {
              name: "printableAreaHeight",
              type: "number",
              required: true,
              label: "Printable Area Height",
              min: 1,
              admin: { description: "Height of the area available for printing." },
            },
            {
              name: "printableAreaUnit",
              type: "select",
              dbName: "printAreaUnit",
              required: true,
              defaultValue: "mm",
              label: "Unit",
              options: [
                { label: "Millimeters (mm)", value: "mm" },
                { label: "Centimeters (cm)", value: "cm" },
                { label: "Inches (in)", value: "in" },
                { label: "Pixels (px)", value: "px" },
              ],
            },
            {
              name: "minimumImageResolution",
              type: "number",
              label: "Minimum Image Resolution (DPI)",
              defaultValue: 300,
              min: 72,
              admin: {
                description:
                  "Minimum recommended resolution for uploaded images. 300 DPI is standard for print.",
              },
            },
            {
              name: "bleedArea",
              type: "number",
              label: "Bleed Area",
              min: 0,
              defaultValue: 3,
              admin: {
                description:
                  "Extra margin beyond the trim line (in the selected unit). Standard is 3 mm.",
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
                  "Margin inside the trim line where critical content should stay. Standard is 5 mm.",
              },
            },
          ],
        },

        // ── Upload Rules ─────────────────────────────────────────
        {
          name: "uploadRules",
          type: "group",
          label: "Upload Rules",
          fields: [
            {
              name: "maximumUploadSize",
              type: "number",
              label: "Maximum Upload Size (MB)",
              defaultValue: 25,
              min: 1,
              max: 100,
              admin: {
                description: "Maximum file size for customer-uploaded designs.",
              },
            },
            {
              name: "allowedImageFormats",
              type: "select",
              hasMany: true,
              label: "Allowed Image Formats",
              defaultValue: ["png", "jpg", "jpeg", "svg", "pdf"],
              options: [
                { label: "PNG", value: "png" },
                { label: "JPEG", value: "jpg" },
                { label: "JPEG (alt)", value: "jpeg" },
                { label: "SVG", value: "svg" },
                { label: "PDF", value: "pdf" },
                { label: "AI (Adobe Illustrator)", value: "ai" },
                { label: "PSD (Photoshop)", value: "psd" },
                { label: "TIFF", value: "tiff" },
              ],
            },
            {
              name: "allowTransparentPNG",
              type: "checkbox",
              label: "Allow Transparent PNG",
              defaultValue: true,
              admin: {
                description:
                  "If enabled, customers can upload PNGs with transparent backgrounds.",
              },
            },
          ],
        },
      ],
    },

    // ── SEO ──────────────────────────────────────────────────────────
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        { name: "metaTitle", type: "text", label: "Meta Title" },
        { name: "metaDescription", type: "textarea", label: "Meta Description" },
        {
          name: "keywords",
          type: "text",
          label: "Keywords",
          admin: { description: "Comma-separated keywords" },
        },
      ],
    },
  ],

  // ── Hooks ──────────────────────────────────────────────────────────
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const doc = data as Record<string, unknown> | undefined;
        if (!doc || !doc.isCustomizable) return;
        const c = doc.customization as Record<string, unknown> | undefined;
        if (!c) return;

        // ── Validation: print specifications must be present ──
        const printSpec = c.printSpecifications as Record<string, unknown> | undefined;
        if (printSpec) {
          const w = printSpec.printableAreaWidth;
          const h = printSpec.printableAreaHeight;
          const unit = printSpec.printableAreaUnit;

          if (w === undefined || w === null) {
            throw new Error("Printable Area Width is required for customizable products.");
          }
          if (h === undefined || h === null) {
            throw new Error("Printable Area Height is required for customizable products.");
          }
          if (Number(w) <= 0) {
            throw new Error("Printable Area Width must be greater than 0.");
          }
          if (Number(h) <= 0) {
            throw new Error("Printable Area Height must be greater than 0.");
          }
          if (!unit) {
            throw new Error("Printable Area Unit is required for customizable products.");
          }
        }

        // ── Validation: upload rules ──
        const upload = c.uploadRules as Record<string, unknown> | undefined;
        if (upload) {
          const maxSize = upload.maximumUploadSize;
          if (maxSize !== undefined && maxSize !== null) {
            if (Number(maxSize) < 1) {
              throw new Error("Maximum Upload Size must be at least 1 MB.");
            }
            if (Number(maxSize) > 100) {
              throw new Error("Maximum Upload Size cannot exceed 100 MB.");
            }
          }

          const resolutions = c.printSpecifications as Record<string, unknown> | undefined;
          if (resolutions) {
            const minRes = resolutions.minimumImageResolution;
            if (minRes !== undefined && minRes !== null) {
              if (Number(minRes) < 72) {
                throw new Error("Minimum Image Resolution must be at least 72 DPI.");
              }
            }
          }
        }
      },
    ],

    afterChange: [
      async ({ doc }) => {
        const product = doc as Record<string, unknown>;
        try {
          const qty = (product.inventory as Record<string, unknown> | undefined)
            ?.quantity as number | undefined ?? 0;
          const threshold = (product.inventory as Record<string, unknown> | undefined)
            ?.lowStockThreshold as number | undefined ?? 10;
          const tracking = (product.inventory as Record<string, unknown> | undefined)
            ?.trackInventory as boolean | undefined ?? true;

          if (tracking && qty <= threshold && qty > 0) {
            const baseUrl =
              process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
            const { lowStockAlertEmail, sendEmail } =
              await import("@/lib/notifications");
            const { subject, html } = lowStockAlertEmail({
              productName: product.name as string,
              currentStock: qty,
              threshold,
              productUrl: `${baseUrl}/admin/collections/products/${product.id}`,
            });
            await sendEmail("admin@sendclouding.com", subject, html);
          }
        } catch {
          // email is best-effort; do not fail the save
        }
      },
    ],

    beforeDelete: [
      async ({ req, id }) => {
        const payload = req.payload;

        // Orders are permanent business/financial records — never delete
        // them or silently detach them. Block the delete with a clear,
        // actionable message instead (previously this crashed with a raw
        // 500: the DB tries to null out orders_items.product_id on delete,
        // but that column is required/NOT NULL).
        const orders = await payload.find({
          collection: "orders",
          where: { "items.product": { equals: id } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        });
        if (orders.totalDocs > 0) {
          throw new Error(
            "This product can't be deleted because it has existing orders referencing it. Set its status to Inactive instead to hide it from customers while preserving order history."
          );
        }

        // Saved customer designs and design templates are linked to a
        // product via a required (NOT NULL) relationship, so they can't be
        // "unlinked" on delete either. Since we've already confirmed above
        // that no order uses this product (so none of these designs were
        // ever placed), it's safe to clean them up here.
        const designs = await payload.find({
          collection: "designs",
          where: { product: { equals: id } },
          limit: 1000,
          depth: 0,
          overrideAccess: true,
        });
        for (const design of designs.docs) {
          await payload.delete({ collection: "designs", id: design.id, overrideAccess: true });
        }

        const templates = await payload.find({
          collection: "product-templates",
          where: { linkedProduct: { equals: id } },
          limit: 1000,
          depth: 0,
          overrideAccess: true,
        });
        for (const template of templates.docs) {
          await payload.delete({ collection: "product-templates", id: template.id, overrideAccess: true });
        }
      },
    ],
  },
  timestamps: true,
};
