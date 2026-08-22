import { GlobalConfig } from "payload";

export const ShippingSettings: GlobalConfig = {
  slug: "shipping-settings",
  label: "Shipping Settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "freeShippingThreshold",
      type: "number",
      min: 0,
      defaultValue: 100,
      label: "Free Shipping Threshold (€)",
      admin: {
        description: "Orders with subtotal above this amount qualify for free shipping.",
      },
    },
    {
      name: "zones",
      type: "array",
      label: "Shipping Zones",
      admin: {
        description: "Define delivery zones. The customer's city/state is matched against these.",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          label: "Zone Name",
        },
        {
          name: "key",
          type: "text",
          required: true,
          label: "Zone Key",
          admin: {
            description: "Used internally to match customer location. Use lowercase, e.g. 'amsterdam', 'london'.",
          },
        },
        {
          name: "cities",
          type: "textarea",
          label: "Cities in Zone",
          admin: {
            description: "Comma-separated list of cities in this zone.",
          },
        },
        {
          name: "states",
          type: "textarea",
          label: "States in Zone",
          admin: {
            description: "Comma-separated list of states covered by this zone.",
          },
        },
        {
          name: "isActive",
          type: "checkbox",
          defaultValue: true,
          label: "Active",
        },
      ],
    },
  ],
};
