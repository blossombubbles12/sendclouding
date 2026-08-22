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
      defaultValue: "Send Clouding - Courier & Logistics in the Netherlands & UK",
    },
    {
      name: "titleTemplate",
      type: "text",
      label: "Title Template",
      defaultValue: "%s | Send Clouding",
      admin: {
        description: "Use %s for the page title. Example: %s | Send Clouding",
      },
    },
    {
      name: "defaultDescription",
      type: "textarea",
      label: "Default Meta Description",
      defaultValue: "Send Clouding offers courier and logistics services across the Netherlands and the UK. Same-day, next-day and international delivery with live tracking on every shipment.",
    },
    {
      name: "defaultKeywords",
      type: "text",
      label: "Default Keywords",
      defaultValue: "courier, logistics, same-day delivery, next-day delivery, express delivery, shipping, freight, parcel delivery, netherlands, united kingdom, amsterdam, london, package tracking",
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
      defaultValue: "@sendclouding",
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
