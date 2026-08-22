import { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      required: true,
      label: "Site Name",
      defaultValue: "Send Clouding",
    },
    {
      name: "siteDescription",
      type: "textarea",
      label: "Site Description",
      defaultValue: "Modern courier and logistics platform for the Netherlands and the UK. Same-day, next-day and freight delivery with live tracking.",
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      label: "Site Logo",
    },
    {
      name: "favicon",
      type: "upload",
      relationTo: "media",
      label: "Favicon",
    },
    {
      name: "contactEmail",
      type: "email",
      label: "Contact Email",
      defaultValue: "info@sendclouding.com",
    },
    {
      name: "contactPhone",
      type: "text",
      label: "Contact Phone",
    },
    {
      name: "address",
      type: "group",
      label: "Business Address",
      fields: [
        {
          name: "street",
          type: "text",
          label: "Street Address",
        },
        {
          name: "city",
          type: "text",
          label: "City",
          defaultValue: "Amsterdam",
        },
        {
          name: "state",
          type: "text",
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
          label: "Country",
          defaultValue: "Netherlands",
        },
      ],
    },
    {
      name: "socialLinks",
      type: "group",
      label: "Social Media Links",
      fields: [
        {
          name: "facebook",
          type: "text",
          label: "Facebook URL",
        },
        {
          name: "instagram",
          type: "text",
          label: "Instagram URL",
        },
        {
          name: "twitter",
          type: "text",
          label: "Twitter/X URL",
        },
        {
          name: "linkedin",
          type: "text",
          label: "LinkedIn URL",
        },
      ],
    },
    {
      name: "currency",
      type: "select",
      label: "Default Currency",
      defaultValue: "EUR",
      options: [
        { label: "EUR (€)", value: "EUR" },
        { label: "GBP (£)", value: "GBP" },
      ],
    },
  ],
};
