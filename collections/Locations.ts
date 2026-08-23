import { CollectionConfig } from "payload";
import { readPublic, staffWrite } from "@/lib/shipments/access";

export const Locations: CollectionConfig = {
  slug: "locations",
  labels: {
    singular: "Location",
    plural: "Locations",
  },
  admin: {
    useAsTitle: "name",
    group: "Send Clouding",
    hidden: true,
    defaultColumns: ["name", "type", "city", "country", "isActive"],
    description: "Hubs, depots, and pickup points across the delivery network.",
  },
  access: {
    read: readPublic,
    create: staffWrite,
    update: staffWrite,
    delete: staffWrite,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Name",
    },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "hub",
      options: [
        { label: "Hub", value: "hub" },
        { label: "Sorting Facility", value: "sorting-facility" },
        { label: "Depot", value: "depot" },
        { label: "Pickup Point", value: "pickup-point" },
        { label: "Partner Point", value: "partner-point" },
      ],
      label: "Location Type",
      admin: {
        components: {
          Cell: "/components/StatusBadge#StatusBadge",
        },
      },
    },
    {
      name: "address",
      type: "text",
      label: "Address",
    },
    {
      name: "city",
      type: "text",
      label: "City",
      index: true,
    },
    {
      name: "country",
      type: "text",
      defaultValue: "Netherlands",
      label: "Country",
      index: true,
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      index: true,
      label: "Active",
    },
  ],
  timestamps: true,
};