import { CollectionConfig } from "payload";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  admin: {
    useAsTitle: "subject",
    group: "Commerce",
    defaultColumns: ["name", "email", "subject", "status", "createdAt"],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin" || user.role === "manager") return true;
      return false;
    },
    update: ({ req: { user } }) =>
      user?.role === "admin" || user?.role === "manager",
    delete: ({ req: { user } }) =>
      user?.role === "admin" || user?.role === "manager",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Full Name",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "Email",
    },
    {
      name: "phone",
      type: "text",
      label: "Phone Number",
    },
    {
      name: "subject",
      type: "text",
      required: true,
      defaultValue: "General Enquiry",
      label: "Subject",
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: "Message",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      label: "Status",
      options: [
        { label: "New", value: "new" },
        { label: "In Progress", value: "in-progress" },
        { label: "Resolved", value: "resolved" },
        { label: "Closed", value: "closed" },
      ],
    },
  ],
  timestamps: true,
};