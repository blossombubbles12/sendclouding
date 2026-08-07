"use server";

import { getGateway, validatePaymentMethodStable } from "@/lib/payments";

interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes?: string;
}

interface CartItemInput {
  id: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  lineKey?: string;
  isCustomized?: boolean;
  designId?: string;
  templateId?: string;
  templateVersion?: string;
  designJSON?: unknown;
  options?: unknown;
  previewImageId?: string;
  assets?: { id: string }[];
  productionMetadata?: unknown;
}

interface ShippingInfo {
  id: string;
  name: string;
  zone: string;
  fee: number;
}

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  paystackUrl?: string;
  paymentMethod?: string;
  error?: string;
}

export async function createOrder(
  cartItems: CartItemInput[],
  formData: CheckoutFormData,
  paymentMethod: string = "cod",
  shippingInfo?: ShippingInfo
): Promise<CreateOrderResult> {
  "use server";

  if (cartItems.length === 0) {
    return { success: false, error: "Cart is empty" };
  }

  // ── Design validation gate ──────────────────────────────────────────
  // A customized line must have all required placeholders completed and a
  // persisted design id before the order can be placed.
  for (const item of cartItems) {
    if (!item.isCustomized) continue;
    const production = (item.productionMetadata ?? {}) as Record<string, unknown>;
    const ready = production["allRequiredCompleted"] !== false;
    if (!item.designId || !ready) {
      return {
        success: false,
        error: `"${item.name}" has an incomplete design. Please complete all required fields before checkout.`,
      };
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const api = `${baseUrl}/api`;

  try {
    // 0. Validate / resolve payment method (always falls back to COD)
    const resolved = validatePaymentMethodStable(paymentMethod);
    const finalMethod = resolved.fallbackId;

    console.log("[Orders] Creating order with payment method:", finalMethod);

    // 1. Find or create customer
    let customerId: string;
    const existingCustomers = await fetch(
      `${api}/customers?where[email][equals]=${encodeURIComponent(formData.email)}`
    );
    const customerResult = await existingCustomers.json();

    if (customerResult.totalDocs > 0) {
      customerId = customerResult.docs[0].id;
    } else {
      const newCustomer = await fetch(`${api}/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          addresses: [{
            label: "Default",
            fullName: `${formData.firstName} ${formData.lastName}`,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
            phone: formData.phone,
            isDefault: true,
          }],
          status: "active",
        }),
      });
      const newCustomerResult = await newCustomer.json();
      if (newCustomerResult.doc) customerId = newCustomerResult.doc.id;
      else return { success: false, error: "Failed to create customer record" };
    }

    // 2. Calculate totals
    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = shippingInfo?.fee ?? (subtotal > 50000 ? 0 : 2000);
    const tax = Math.round(subtotal * 0.075);
    const total = subtotal + shipping + tax;

    // 3. Generate order number
    const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`;

    // 4. Create order in Payload
    const orderResponse = await fetch(`${api}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNumber,
        customer: customerId,
        items: cartItems.map((item) => ({
          product: item.id,
          name: item.name,
          sku: item.sku || "",
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
          ...(item.isCustomized
            ? {
                design: {
                  designId: item.designId,
                  templateId: item.templateId || "",
                  templateVersion: item.templateVersion || "",
                  designJSON: item.designJSON ?? null,
                  options: item.options ?? null,
                  previewImage: item.previewImageId || null,
                  assets: (item.assets ?? []).map((a) => ({ asset: a.id })),
                  productionMetadata: item.productionMetadata ?? null,
                },
              }
            : {}),
        })),
        subtotal,
        tax,
        shipping,
        total,
        status: "pending",
        paymentStatus: "pending",
        paymentMethod: finalMethod,
        shippingMethod: shippingInfo ? {
          id: shippingInfo.id,
          name: shippingInfo.name,
          zone: shippingInfo.zone,
        } : undefined,
        shippingAddress: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        notes: formData.notes || "",
      }),
    });

    const orderResult = await orderResponse.json();
    if (!orderResult.doc) {
      console.error("[Orders] Failed to create order document");
      return { success: false, error: "Failed to create order" };
    }

    const orderId = orderResult.doc.id;

    // 4b. Attach the design package to the order: mark each customized design
    //     as "ordered" so it is preserved for the print workflow.
    for (const item of cartItems) {
      if (!item.isCustomized || !item.designId) continue;
      try {
        await fetch(`${api}/designs/${item.designId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ordered", orderNumber }),
        });
      } catch (err) {
        console.warn(`[Orders] Failed to finalize design ${item.designId}:`, err);
      }
    }

    // 5. Initialize payment via gateway
    const gateway = getGateway(finalMethod);
    if (!gateway) {
      console.error(`[Orders] No gateway available for method: ${finalMethod}`);
      return { success: false, error: "Payment method unavailable. Please try again." };
    }

    const paymentResult = await gateway.initialize({
      email: formData.email,
      amount: total,
      reference: orderNumber,
      callbackUrl: `${baseUrl}/checkout/success`,
      metadata: { orderId, orderNumber },
    });

    if (!paymentResult.success) {
      console.error("[Orders] Payment initialization failed:", paymentResult.error);
      return { success: false, error: paymentResult.error || "Payment initialization failed" };
    }

    // 6. Return result
    if (paymentResult.authorizationUrl) {
      return {
        success: true,
        orderId,
        orderNumber,
        paystackUrl: paymentResult.authorizationUrl,
        paymentMethod: finalMethod,
      };
    }

    // COD or bank transfer - no redirect needed
    return {
      success: true,
      orderId,
      orderNumber,
      paymentMethod: finalMethod,
    };
  } catch (err) {
    console.error("[Orders] Checkout error:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
