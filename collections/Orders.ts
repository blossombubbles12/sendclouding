import { CollectionConfig } from "payload";
import {
  sendEmail,
  orderConfirmationEmail,
  orderStatusEmail,
  newOrderAdminEmail,
} from "@/lib/notifications";
import { formatCurrency } from "@/lib/utils";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    group: "Commerce",
    defaultColumns: ["orderNumber", "customer", "total", "status", "createdAt"],
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      required: true,
      unique: true,
      label: "Order Number",
      admin: {
        description: "Unique order identifier (e.g., ORD-000001)",
      },
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
      label: "Customer",
    },
    {
      name: "items",
      type: "array",
      required: true,
      label: "Order Items",
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "name",
          type: "text",
          required: true,
          label: "Product Name",
        },
        {
          name: "sku",
          type: "text",
          label: "SKU",
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          min: 1,
          label: "Quantity",
        },
        {
          name: "price",
          type: "number",
          required: true,
          min: 0,
          label: "Unit Price",
        },
        {
          name: "total",
          type: "number",
          required: true,
          min: 0,
          label: "Line Total",
        },
        {
          name: "design",
          type: "group",
          label: "Design (Customization)",
          admin: {
            description:
              "Captured only for customized products. Persists the full design package onto the order for the print workflow.",
          },
          fields: [
            {
              name: "designId",
              type: "relationship",
              relationTo: "designs",
              label: "Design",
            },
            {
              name: "templateId",
              type: "text",
              label: "Template ID",
            },
            {
              name: "templateVersion",
              type: "text",
              label: "Template Version",
            },
            {
              name: "designJSON",
              type: "json",
              label: "Design JSON",
            },
            {
              name: "options",
              type: "json",
              label: "Customization Options",
            },
            {
              name: "previewImage",
              type: "upload",
              relationTo: "media",
              label: "Preview Image",
            },
            {
              name: "assets",
              type: "array",
              label: "Assets",
              fields: [
                {
                  name: "asset",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                  label: "Asset",
                },
              ],
            },
            {
              name: "productionMetadata",
              type: "json",
              label: "Production Metadata",
            },
          ],
        },
      ],
    },
    {
      name: "subtotal",
      type: "number",
      required: true,
      min: 0,
      label: "Subtotal",
    },
    {
      name: "tax",
      type: "number",
      defaultValue: 0,
      min: 0,
      label: "Tax",
    },
    {
      name: "shipping",
      type: "number",
      defaultValue: 0,
      min: 0,
      label: "Shipping Cost",
    },
    {
      name: "shippingMethod",
      type: "group",
      label: "Shipping Method",
      fields: [
        {
          name: "id",
          type: "text",
          label: "Method ID",
        },
        {
          name: "name",
          type: "text",
          label: "Method Name",
        },
        {
          name: "zone",
          type: "text",
          label: "Zone",
        },
      ],
    },
    {
      name: "total",
      type: "number",
      required: true,
      min: 0,
      label: "Total",
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Processing", value: "processing" },
        { label: "Shipped", value: "shipped" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Refunded", value: "refunded" },
      ],
      admin: {
        components: {
          Cell: "/components/StatusBadge#StatusBadge",
        },
      },
    },
    {
      name: "paymentStatus",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Paid", value: "paid" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
      ],
      admin: {
        components: {
          Cell: "/components/StatusBadge#StatusBadge",
        },
      },
    },
    {
      name: "paymentMethod",
      type: "text",
      label: "Payment Method",
    },
    {
      name: "shippingAddress",
      type: "group",
      label: "Shipping Address",
      fields: [
        {
          name: "fullName",
          type: "text",
          required: true,
          label: "Full Name",
        },
        {
          name: "address",
          type: "text",
          required: true,
          label: "Address",
        },
        {
          name: "city",
          type: "text",
          required: true,
          label: "City",
        },
        {
          name: "state",
          type: "text",
          required: true,
          label: "State",
        },
        {
          name: "postalCode",
          type: "text",
          label: "Postal Code",
        },
        {
          name: "country",
          type: "text",
          required: true,
          defaultValue: "Netherlands",
          label: "Country",
        },
        {
          name: "phone",
          type: "text",
          required: true,
          label: "Phone",
        },
      ],
    },
    {
      name: "notes",
      type: "textarea",
      label: "Order Notes",
    },
    {
      name: "trackingNumber",
      type: "text",
      label: "Tracking Number",
    },
    {
      name: "trackingUrl",
      type: "text",
      label: "Tracking URL",
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        const order = doc as Record<string, any>;
        const prev = previousDoc as Record<string, any> | undefined;

        try {
          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
          const orderUrl = `${baseUrl}/account/orders/${order.orderNumber}`;
          const adminUrl = `${baseUrl}/admin/collections/orders/${order.id}`;

          // Get customer info
          let customerEmail = "";
          let customerName = "Customer";
          try {
            const custRes = await fetch(`${baseUrl}/api/customers/${(order.customer as any)?.id || order.customer}`);
            const custData = await custRes.json();
            customerEmail = custData.email || "";
            customerName = `${custData.firstName || ""} ${custData.lastName || ""}`.trim() || "Customer";
          } catch {}

          // On create: deduct inventory + send confirmation + notify admin
          if (operation === "create") {
            // Deduct inventory for each item
            if (order.items) {
              for (const item of order.items) {
                try {
                  const prodId = (item.product as any)?.id || item.product;
                  const prodRes = await fetch(`${baseUrl}/api/products/${prodId}`);
                  const prodData = await prodRes.json();
                  const currentQty = prodData.inventory_quantity || 0;
                  const newQty = Math.max(0, currentQty - (item.quantity || 0));
                  await fetch(`${baseUrl}/api/products/${prodId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ inventory_quantity: newQty }),
                  });
                } catch {}
              }
            }

            // Order confirmation email to customer
            if (customerEmail) {
              const { subject, html } = orderConfirmationEmail({
                customerName,
                orderNumber: order.orderNumber,
                orderTotal: formatCurrency(order.total || 0),
                items: (order.items || []).map((i: any) => ({
                  name: i.name,
                  quantity: i.quantity,
                  price: formatCurrency(i.price),
                })),
                orderUrl,
              });
              await sendEmail(customerEmail, subject, html);
            }

            // Admin notification
            const { subject: aSubject, html: aHtml } = newOrderAdminEmail({
              orderNumber: order.orderNumber,
              customerName,
              orderTotal: formatCurrency(order.total || 0),
              adminUrl,
            });
            await sendEmail("admin@sendclouding.com", aSubject, aHtml);
          }

          // On update: send status change email + trigger production jobs upon success payment confirmation
          if (operation === "update" && prev) {
            if (order.status !== prev.status && customerEmail) {
              const { subject, html } = orderStatusEmail({
                customerName,
                orderNumber: order.orderNumber,
                status: order.status,
                orderUrl,
              });
              await sendEmail(customerEmail, subject, html);
            }

            // If order was transitioned or paid, make sure to automatically initiate production job
            const wasPaid = order.paymentStatus === "paid" && prev.paymentStatus !== "paid";
            const wasConfirmed = order.status === "confirmed" && prev.status !== "confirmed";
            if (wasPaid || wasConfirmed) {
              try {
                // Auto-create production job using the module service
                const { createJobForOrder } = await import("@/lib/production/service");
                await createJobForOrder(order.id);
              } catch (err) {
                console.error("Failed to auto-create production job for order:", order.id, err);
              }
            }

            // Restore inventory on cancellation/refund
            if ((order.status === "cancelled" || order.status === "refunded") && order.items) {
              for (const item of order.items) {
                try {
                  const prodId = (item.product as any)?.id || item.product;
                  const prodRes = await fetch(`${baseUrl}/api/products/${prodId}`);
                  const prodData = await prodRes.json();
                  const currentQty = prodData.inventory_quantity || 0;
                  const restored = currentQty + (item.quantity || 0);
                  await fetch(`${baseUrl}/api/products/${prodId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ inventory_quantity: restored }),
                  });
                } catch {}
              }
            }
          }
        } catch (err) {
          console.error("Order hook error:", err);
        }
      },
    ],
  },
  timestamps: true,
};
