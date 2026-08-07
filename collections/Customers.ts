import { CollectionConfig } from "payload";

export const Customers: CollectionConfig = {
  slug: "customers",
  admin: {
    useAsTitle: "email",
    group: "Commerce",
    defaultColumns: ["firstName", "lastName", "email", "totalOrders", "status"],
  },
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      name: "firstName",
      type: "text",
      required: true,
      label: "First Name",
    },
    {
      name: "lastName",
      type: "text",
      required: true,
      label: "Last Name",
    },
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      label: "Email",
    },
    {
      name: "phone",
      type: "text",
      label: "Phone Number",
    },
    {
      name: "addresses",
      type: "array",
      label: "Addresses",
      fields: [
        {
          name: "label",
          type: "text",
          label: "Address Label (e.g., Home, Work)",
        },
        {
          name: "fullName",
          type: "text",
          required: true,
          label: "Full Name",
        },
        {
          name: "address",
          type: "text",
          required: true,
          label: "Address",
        },
        {
          name: "city",
          type: "text",
          required: true,
          label: "City",
        },
        {
          name: "state",
          type: "text",
          required: true,
          label: "State",
        },
        {
          name: "postalCode",
          type: "text",
          label: "Postal Code",
        },
        {
          name: "country",
          type: "text",
          required: true,
          defaultValue: "Nigeria",
          label: "Country",
        },
        {
          name: "phone",
          type: "text",
          required: true,
          label: "Phone",
        },
        {
          name: "isDefault",
          type: "checkbox",
          label: "Default Address",
          defaultValue: false,
        },
      ],
    },
    {
      name: "totalOrders",
      type: "number",
      defaultValue: 0,
      label: "Total Orders",
    },
    {
      name: "totalSpent",
      type: "number",
      defaultValue: 0,
      label: "Total Spent (NGN)",
    },
    {
      name: "notes",
      type: "textarea",
      label: "Customer Notes",
      admin: {
        description: "Internal notes about this customer",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "active",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Blocked", value: "blocked" },
      ],
      admin: {
        components: {
          Cell: "/components/StatusBadge#StatusBadge",
        },
      },
    },
  ],
  timestamps: true,
};
