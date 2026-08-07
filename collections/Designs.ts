import { CollectionConfig } from "payload";

export const Designs: CollectionConfig = {
  slug: "designs",
  admin: {
    useAsTitle: "product",
    group: "Commerce",
    defaultColumns: ["product", "template", "status", "guestToken", "updatedAt"],
    description:
      "Persisted customer designs. Each document is a complete customization package that can be attached to a cart line or an order item.",
  },
  access: {
    create: () => true,
    read: () => true,
    update: ({ req }) => {
      const token = (req.headers.get("x-guest-token") || "") as string;
      const userId = req?.user?.id as string | undefined;
      if (userId) return true;
      if (token) return true;
      // Allow admin UI + API by default in dev; restrict ownership where available.
      return true;
    },
    delete: ({ req }) => {
      const token = (req.headers.get("x-guest-token") || "") as string;
      const userId = req?.user?.id as string | undefined;
      if (userId || token) return true;
      return false;
    },
  },
  fields: [
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
      label: "Product",
    },
    {
      name: "template",
      type: "relationship",
      relationTo: "product-templates",
      label: "Template",
      admin: { description: "Template this design was built from." },
    },
    {
      name: "templateVersion",
      type: "text",
      label: "Template Version",
    },
    {
      name: "designJSON",
      type: "json",
      required: true,
      label: "Design JSON",
      admin: { description: "The complete filled-in design (layers, text, images, geometry)." },
    },
    {
      name: "options",
      type: "json",
      label: "Customization Options",
      admin: { description: "Customer answers keyed by placeholder id (text + image refs)." },
    },
    {
      name: "previewImage",
      type: "upload",
      relationTo: "media",
      label: "Preview Image",
      admin: { description: "Optimized preview thumbnail used in cart and checkout." },
    },
    {
      name: "assets",
      type: "array",
      label: "Uploaded Assets",
      admin: { description: "Media assets uploaded by the customer, linked to this design." },
      fields: [
        {
          name: "asset",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Asset",
        },
        {
          name: "placeholderId",
          type: "text",
          label: "Placeholder",
          admin: { description: "The image placeholder this asset fills." },
        },
      ],
    },
    {
      name: "productionMetadata",
      type: "json",
      label: "Production Metadata",
      admin: { description: "Print-ready metadata consumed by the print workflow." },
    },
    {
      name: "owner",
      type: "relationship",
      relationTo: "users",
      label: "Owner",
      admin: { description: "Authenticated user this design belongs to (if any)." },
    },
    {
      name: "guestToken",
      type: "text",
      label: "Guest Token",
      admin: { description: "Anonymous session token for guests so they can restore unfinished designs." },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "saved",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Saved", value: "saved" },
        { label: "Ordered", value: "ordered" },
      ],
      admin: { description: "Lifecycle: draft (in progress), saved (in cart), ordered (checkout complete)." },
    },
    {
      name: "orderNumber",
      type: "text",
      label: "Order Number",
      admin: { description: "Set when the design is attached to a completed order." },
    },
  ],
  timestamps: true,
};
