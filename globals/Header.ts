import { GlobalConfig } from "payload";

export const Header: GlobalConfig = {
  slug: "header",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "navItems",
      type: "array",
      required: true,
      label: "Navigation Items",
      minRows: 1,
      maxRows: 15,
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
          admin: {
            description: "Use / for root, e.g., /ship, /about",
          },
        },
        {
          name: "type",
          type: "select",
          defaultValue: "link",
          options: [
            { label: "Link", value: "link" },
            { label: "Dropdown", value: "dropdown" },
          ],
          label: "Type",
        },
        {
          name: "children",
          type: "array",
          label: "Dropdown Children",
          admin: {
            condition: (data, siblingData) => siblingData?.type === "dropdown",
          },
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
          name: "highlighted",
          type: "checkbox",
          label: "Highlighted",
          defaultValue: false,
          admin: {
            description: "Show this item as highlighted/CTA",
          },
        },
      ],
    },
    {
      name: "announcementBar",
      type: "group",
      label: "Announcement Bar",
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          label: "Enable Announcement Bar",
          defaultValue: false,
        },
        {
          name: "text",
          type: "text",
          label: "Announcement Text",
        },
        {
          name: "link",
          type: "text",
          label: "Call-to-Action Link",
        },
        {
          name: "linkLabel",
          type: "text",
          label: "Link Label",
        },
      ],
    },
  ],
};
