import { CollectionConfig } from "payload";

export const BlogCategories: CollectionConfig = {
  slug: "blog-categories",
  admin: {
    useAsTitle: "name",
    group: "News & Blog",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Category Name",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug",
      admin: {
        description: "URL-friendly version of the name (auto-generated from name)",
      },
    },
    {
      name: "description",
      type: "richText",
      label: "Description",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Category Image",
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Featured Category",
      defaultValue: false,
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "active",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Sort Order",
      defaultValue: 0,
      admin: {
        description: "Lower numbers appear first",
      },
    },
  ],
  timestamps: true,
};