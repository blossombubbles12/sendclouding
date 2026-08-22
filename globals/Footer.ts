import { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "description",
      type: "textarea",
      label: "Footer Description",
      defaultValue: "Modern logistics technology platform. Ship packages, track shipments in real-time, and manage deliveries with confidence.",
    },
    {
      name: "columns",
      type: "array",
      label: "Footer Columns",
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: "Column Title",
        },
        {
          name: "links",
          type: "array",
          required: true,
          label: "Links",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              label: "Label",
            },
            {
              name: "link",
              type: "text",
              required: true,
              label: "Link",
            },
          ],
        },
      ],
    },
    {
      name: "bottomLinks",
      type: "array",
      label: "Bottom Legal Links",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          label: "Label",
        },
        {
          name: "link",
          type: "text",
          required: true,
          label: "Link",
        },
      ],
    },
    {
      name: "copyright",
      type: "text",
      label: "Copyright Text",
      defaultValue: "© {year} Send Clouding. All rights reserved.",
    },
  ],
};
