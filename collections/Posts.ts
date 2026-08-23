import { CollectionConfig } from "payload";

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    group: "News & Blog",
    defaultColumns: ["title", "category", "publishDate", "status", "featured", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Title",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug",
      admin: {
        description: "URL-friendly version of the title (auto-generated if left blank)",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Excerpt",
      admin: {
        description: "A short summary shown on cards and search results.",
      },
    },
    {
      name: "content",
      type: "richText",
      required: false,
      label: "Article Content",
      admin: {
        description: "The full article body. Use headings for the table of contents.",
      },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      label: "Hero / Featured Image",
      admin: {
        description: "Large banner image used at the top of the article and on cards.",
      },
    },
    {
      name: "gallery",
      type: "array",
      label: "Image Gallery",
      minRows: 0,
      maxRows: 12,
      admin: {
        description: "Optional additional images displayed within the article.",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "alt",
          type: "text",
          label: "Alt Text",
        },
        {
          name: "caption",
          type: "text",
          label: "Caption",
        },
      ],
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "blog-categories",
      hasMany: false,
      label: "Category",
    },
    {
      name: "tags",
      type: "array",
      label: "Tags",
      fields: [
        {
          name: "tag",
          type: "text",
        },
      ],
    },
    {
      name: "author",
      type: "group",
      label: "Author",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          label: "Name",
        },
        {
          name: "role",
          type: "text",
          label: "Role / Title",
        },
        {
          name: "avatar",
          type: "upload",
          relationTo: "media",
          label: "Avatar",
        },
        {
          name: "bio",
          type: "textarea",
          label: "Short Bio",
        },
      ],
    },
    {
      name: "publishDate",
      type: "date",
      required: true,
      defaultValue: () => new Date(),
      label: "Publish Date",
      admin: {
        description: "When the article was published.",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Featured Article",
      defaultValue: false,
      admin: {
        description: "Featured articles appear in the hero carousel on the news page.",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
    },
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        {
          name: "metaTitle",
          type: "text",
          label: "Meta Title",
        },
        {
          name: "metaDescription",
          type: "textarea",
          label: "Meta Description",
        },
        {
          name: "keywords",
          type: "text",
          label: "Keywords",
          admin: {
            description: "Comma-separated keywords",
          },
        },
        {
          name: "ogImage",
          type: "upload",
          relationTo: "media",
          label: "Open Graph Image",
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doc = data as Record<string, any>;
        if (doc.title && !doc.slug) {
          doc.slug = toSlug(doc.title);
        }
        if (doc.slug) {
          doc.slug = toSlug(doc.slug);
        }
        return doc;
      },
    ],
    afterRead: [
      async ({ doc }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const post = doc as Record<string, any>;
        if (!post.publishDate) {
          post.publishDate = post.createdAt;
        }
        return post;
      },
    ],
  },
  timestamps: true,
};