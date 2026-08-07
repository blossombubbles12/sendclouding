import { GlobalConfig } from "payload";

export const PaymentSettings: GlobalConfig = {
  slug: "payment-settings",
  label: "Payment Settings",
  admin: {
    group: "Settings",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "cod",
      type: "group",
      label: "Cash on Delivery",
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          label: "Enable Cash on Delivery",
          defaultValue: true,
        },
        {
          name: "label",
          type: "text",
          label: "Display Label",
          defaultValue: "Cash on Delivery",
        },
        {
          name: "description",
          type: "textarea",
          label: "Description",
          defaultValue: "Pay with cash when your order is delivered.",
        },
      ],
    },
    {
      name: "paystack",
      type: "group",
      label: "Paystack",
      fields: [
        {
          name: "paystackEnabled",
          type: "checkbox",
          label: "Enable Paystack",
          defaultValue: false,
        },
        {
          name: "paystackSecretKey",
          type: "text",
          label: "Paystack Secret Key",
        },
      ],
    },
    {
      name: "stripe",
      type: "group",
      label: "Stripe",
      fields: [
        {
          name: "stripeEnabled",
          type: "checkbox",
          label: "Enable Stripe",
          defaultValue: false,
        },
        {
          name: "stripeSecretKey",
          type: "text",
          label: "Stripe Secret Key",
        },
      ],
    },
    {
      name: "flutterwave",
      type: "group",
      label: "Flutterwave",
      fields: [
        {
          name: "flutterwaveEnabled",
          type: "checkbox",
          label: "Enable Flutterwave",
          defaultValue: false,
        },
        {
          name: "flutterwaveSecretKey",
          type: "text",
          label: "Flutterwave Secret Key",
        },
      ],
    },
    {
      name: "bankTransfer",
      type: "group",
      label: "Bank Transfer",
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          label: "Enable Bank Transfer",
          defaultValue: false,
        },
        {
          name: "label",
          type: "text",
          label: "Display Label",
          defaultValue: "Bank Transfer",
        },
        {
          name: "description",
          type: "textarea",
          label: "Description",
          defaultValue:
            "Transfer payment to our bank account. Your order will be processed after payment confirmation.",
        },
        {
          name: "accountName",
          type: "text",
          label: "Account Name",
          admin: {
            condition: (data: any) => data?.bankTransfer?.enabled,
          },
        },
        {
          name: "accountNumber",
          type: "text",
          label: "Account Number",
          admin: {
            condition: (data: any) => data?.bankTransfer?.enabled,
          },
        },
        {
          name: "bankName",
          type: "text",
          label: "Bank Name",
          admin: {
            condition: (data: any) => data?.bankTransfer?.enabled,
          },
        },
      ],
    },
  ],
};
