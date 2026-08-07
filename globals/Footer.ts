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
      defaultValue: "AquaBest Brands - Premium water and pastry products for a healthier lifestyle. Quality you can trust, taste you'll love.",
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
      defaultValue: "© {year} AquaBest Brands. All rights reserved.",
    },
  ],
};
