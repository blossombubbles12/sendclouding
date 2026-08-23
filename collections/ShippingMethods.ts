import { CollectionConfig } from "payload";

export const ShippingMethods: CollectionConfig = {
  slug: "shipping-methods",
  admin: {
    useAsTitle: "name",
    group: "Send Clouding",
    hidden: true,
    defaultColumns: ["name", "baseFee", "estimatedDelivery", "isActive", "createdAt"],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Method Name",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
    },
    {
      name: "baseFee",
      type: "number",
      required: true,
      min: 0,
      defaultValue: 2000,
      label: "Base Delivery Fee (€)",
    },
    {
      name: "estimatedDelivery",
      type: "text",
      label: "Estimated Delivery Time",
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      label: "Active",
    },
    {
      name: "zoneFees",
      type: "array",
      label: "Zone-Specific Fees (optional override)",
      admin: {
        description: "Set different fees for specific zones. Leave empty to use the base fee for all zones.",
      },
      fields: [
        {
          name: "zone",
          type: "select",
          required: true,
          label: "Zone",
          options: [
            { label: "London", value: "london" },
            { label: "Amsterdam", value: "amsterdam" },
            { label: "Manchester", value: "manchester" },
            { label: "Other States", value: "other-states" },
          ],
        },
        {
          name: "fee",
          type: "number",
          required: true,
          min: 0,
          label: "Delivery Fee (€)",
        },
      ],
    },
  ],
  timestamps: true,
};
