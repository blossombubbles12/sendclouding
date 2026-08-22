import { CollectionConfig } from "payload";
import { readPublic, staffWrite } from "@/lib/shipments/access";
import { createTrackingEvent, getLatestEventStatus, toId } from "@/lib/shipments/events";
import { getShipmentStatusLabel } from "@/lib/shipments/statuses";
import { generateTrackingNumber } from "@/lib/shipments/tracking-number";

export const Shipments: CollectionConfig = {
  slug: "shipments",
  labels: {
    singular: "Shipment",
    plural: "Shipments",
  },
  admin: {
    useAsTitle: "trackingNumber",
    group: "Send Clouding",
    defaultColumns: ["trackingNumber", "recipient", "origin", "destination", "status", "estimatedDelivery", "createdAt"],
  },
  access: {
    read: readPublic,
    create: staffWrite,
    update: staffWrite,
    delete: staffWrite,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === "create") {
          if (!data.trackingNumber) {
            data.trackingNumber = await generateTrackingNumber(req);
          }
          if (!data.currentLocation && data.origin) {
            data.currentLocation = data.origin;
          }
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        try {
          if (operation === "create") {
            // Seed the journey with the initial tracking event.
            await createTrackingEvent(req, {
              shipment: doc.id,
              status: doc.status,
              dateTime: doc.createdAt,
              location: toId(doc.currentLocation ?? doc.origin),
              description: `Shipment created. Tracking number: ${doc.trackingNumber}.`,
            });
            return;
          }

          if (operation === "update") {
            const prevStatus = previousDoc?.status;
            if (doc.status && doc.status !== prevStatus) {
              // Guard: if the latest recorded event already carries this status
              // (e.g. the change was mirrored back from a tracking event), don't
              // append a duplicate history entry.
              const latestEventStatus = await getLatestEventStatus(req, doc.id);
              if (latestEventStatus !== doc.status) {
                await createTrackingEvent(req, {
                  shipment: doc.id,
                  status: doc.status,
                  location: toId(doc.currentLocation ?? doc.origin),
                  description: `Status updated to ${getShipmentStatusLabel(doc.status)}.`,
                });
              }
            }
          }
        } catch (err) {
          console.error("[shipments] failed to maintain tracking history:", err);
        }
      },
    ],
  },
  fields: [
    {
      name: "trackingNumber",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Tracking Number",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Auto-generated, human-readable identifier (e.g. SC-2026-000001).",
      },
      validate: (value?: string | null) => {
        if (!value) return true;
        return /^SC-\d{4}-\d{6}$/.test(value)
          ? true
          : "Tracking number must follow the format SC-YYYY-XXXXXX.";
      },
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      index: true,
      label: "Customer",
      admin: {
        description: "Account holder this shipment belongs to, when applicable.",
      },
    },
    {
      name: "sender",
      type: "group",
      required: true,
      label: "Sender",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          label: "Name",
        },
        {
          name: "company",
          type: "text",
          label: "Company",
        },
        {
          name: "phone",
          type: "text",
          required: true,
          label: "Phone",
        },
        {
          name: "email",
          type: "email",
          label: "Email",
        },
      ],
    },
    {
      name: "recipient",
      type: "group",
      required: true,
      label: "Recipient",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          label: "Name",
        },
        {
          name: "company",
          type: "text",
          label: "Company",
        },
        {
          name: "phone",
          type: "text",
          required: true,
          label: "Phone",
        },
        {
          name: "email",
          type: "email",
          label: "Email",
        },
      ],
    },
    {
      name: "origin",
      type: "relationship",
      relationTo: "locations",
      required: true,
      index: true,
      label: "Origin",
    },
    {
      name: "destination",
      type: "relationship",
      relationTo: "locations",
      required: true,
      index: true,
      label: "Destination",
    },
    {
      name: "currentLocation",
      type: "relationship",
      relationTo: "locations",
      index: true,
      label: "Current Location",
      admin: {
        description: "Latest known location. Kept in sync with tracking events.",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "created",
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
      label: "Current Status",
      admin: {
        components: {
          Cell: "/components/StatusBadge#StatusBadge",
        },
      },
    },
    {
      name: "deliveryService",
      type: "relationship",
      relationTo: "shipping-methods",
      index: true,
      label: "Delivery Service",
      admin: {
        description: "The delivery service/method assigned to this shipment.",
      },
    },
    {
      name: "estimatedDelivery",
      type: "date",
      label: "Estimated Delivery",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "package",
      type: "group",
      label: "Package Information",
      fields: [
        {
          name: "description",
          type: "text",
          label: "Description",
        },
        {
          name: "content",
          type: "textarea",
          label: "Content Details",
        },
        {
          name: "quantity",
          type: "number",
          min: 1,
          defaultValue: 1,
          label: "Quantity",
        },
        {
          name: "weight",
          type: "number",
          min: 0,
          label: "Weight",
        },
        {
          name: "weightUnit",
          type: "select",
          defaultValue: "kg",
          options: [
            { label: "Kilograms (kg)", value: "kg" },
            { label: "Pounds (lb)", value: "lb" },
          ],
          label: "Weight Unit",
        },
        {
          name: "length",
          type: "number",
          min: 0,
          label: "Length (cm)",
        },
        {
          name: "width",
          type: "number",
          min: 0,
          label: "Width (cm)",
        },
        {
          name: "height",
          type: "number",
          min: 0,
          label: "Height (cm)",
        },
        {
          name: "declaredValue",
          type: "number",
          min: 0,
          label: "Declared Value (€)",
        },
        {
          name: "referenceNumber",
          type: "text",
          label: "Reference Number",
          admin: {
            description: "Sender's own reference for this package.",
          },
        },
        {
          name: "isFragile",
          type: "checkbox",
          defaultValue: false,
          label: "Fragile",
        },
      ],
    },
    {
      name: "trackingEvents",
      type: "relationship",
      relationTo: "tracking-events",
      hasMany: true,
      index: true,
      label: "Tracking Events",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Historical journey. Events are created automatically from status changes.",
      },
    },
    {
      name: "notes",
      type: "textarea",
      label: "Notes",
    },
  ],
  timestamps: true,
};