import { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    useAPIKey: true,
    tokenExpiration: 7200,
    maxLoginAttempts: 5,
    lockTime: 600000,
  },
  admin: {
    useAsTitle: "email",
    group: "Admin",
  },
  access: {
    create: () => true,
    read: () => true,
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === "admin") return true;
      return { id: { equals: user.id } };
    },
    delete: ({ req: { user } }) => user?.role === "admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Full Name",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "customer",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Manager", value: "manager" },
        { label: "Editor", value: "editor" },
        { label: "Customer", value: "customer" },
      ],
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
  ],
  timestamps: true,
};
