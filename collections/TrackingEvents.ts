import { CollectionConfig } from "payload";
import { readPublic, staffWrite } from "@/lib/shipments/access";

export const TrackingEvents: CollectionConfig = {
  slug: "tracking-events",
  labels: {
    singular: "Tracking Event",
    plural: "Tracking Events",
  },
  admin: {
    useAsTitle: "description",
    group: "Send Clouding",
    hidden: true,
    defaultColumns: ["shipment", "status", "dateTime", "location", "description"],
    description: "Historical journey milestones for shipments. Created automatically from status changes.",
  },
  access: {
    read: readPublic,
    create: staffWrite,
    update: staffWrite,
    delete: staffWrite,
  },
  fields: [
    {
      name: "shipment",
      type: "relationship",
      relationTo: "shipments",
      required: true,
      index: true,
      label: "Shipment",
    },
    {
      name: "status",
      type: "select",
      required: true,
      index: true,
      options: [
        { label: "Created", value: "created" },
        { label: "Pickup Scheduled", value: "pickup-scheduled" },
        { label: "Picked Up", value: "picked-up" },
        { label: "In Transit", value: "in-transit" },
        { label: "Out for Delivery", value: "out-for-delivery" },
        { label: "Delivered", value: "delivered" },
        { label: "Delayed", value: "delayed" },
        { label: "Exception", value: "exception" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Returned", value: "returned" },
      ],
      label: "Status",
      admin: {
        components: {
          Cell: "/components/StatusBadge#StatusBadge",
        },
      },
    },
    {
      name: "dateTime",
      type: "date",
      required: true,
      index: true,
      label: "Date & Time",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "location",
      type: "relationship",
      relationTo: "locations",
      index: true,
      label: "Location",
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
    },
  ],
  timestamps: true,
};