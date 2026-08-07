import { GlobalConfig } from "payload";

export const SEOSettings: GlobalConfig = {
  slug: "seo-settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "defaultTitle",
      type: "text",
      label: "Default Meta Title",
      defaultValue: "AquaBest Brands - Premium Water & Pastries",
    },
    {
      name: "titleTemplate",
      type: "text",
      label: "Title Template",
      defaultValue: "%s | AquaBest Brands",
      admin: {
        description: "Use %s for the page title. Example: %s | AquaBest Brands",
      },
    },
    {
      name: "defaultDescription",
      type: "textarea",
      label: "Default Meta Description",
      defaultValue: "AquaBest Brands offers premium water and pastry products. Quality you can trust, taste you'll love. Shop our range of purified water and fresh pastries.",
    },
    {
      name: "defaultKeywords",
      type: "text",
      label: "Default Keywords",
      defaultValue: "aquabest, water, pastries, premium water, fresh pastries, nigeria, lagos",
      admin: {
        description: "Comma-separated keywords",
      },
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
      label: "Default Open Graph Image",
      admin: {
        description: "Default image for social media sharing (1200x630px recommended)",
      },
    },
    {
      name: "twitterHandle",
      type: "text",
      label: "Twitter/X Handle",
      defaultValue: "@aquabestbrands",
    },
    {
      name: "googleSiteVerification",
      type: "text",
      label: "Google Site Verification Code",
    },
    {
      name: "googleAnalyticsId",
      type: "text",
      label: "Google Analytics ID",
      admin: {
        description: "e.g., G-XXXXXXXXXX or UA-XXXXXXXXX-X",
      },
    },
  ],
};
