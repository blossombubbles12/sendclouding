"use server";

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactMessageResult {
  success: boolean;
  error?: string;
}

export async function submitContactMessage(
  data: ContactFormData
): Promise<ContactMessageResult> {
  if (!data.name || !data.email || !data.subject || !data.message) {
    return { success: false, error: "Please fill in all required fields." };
  }
  if (!data.email.includes("@")) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/contact-messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        subject: data.subject,
        message: data.message,
        status: "new",
      }),
    });

    const result = await response.json();
    if (response.ok && result.doc) {
      return { success: true };
    }

    const message =
      result.errors?.[0]?.message || result.message || "Failed to send message.";
    return { success: false, error: message };
  } catch (err) {
    console.error("Contact message error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}