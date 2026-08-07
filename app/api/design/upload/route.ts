import { getPayload } from "payload";
import { NextResponse } from "next/server";
import config from "@payload-config";

/**
 * POST /api/design/upload
 *
 * Accepts a multipart form with a single `file` (image). Persists it as a Media
 * asset through Payload's local API and returns the media doc (id + sized URLs).
 * Used by the customer designer to securely store uploaded artwork and previews.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ success: false, error: "No file provided." }, { status: 400 });
    }

    const alt = (formData.get("alt") as string) || "Customer upload";
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "image/heic", "image/heif"];
    if (!allowed.includes(file.type)) {
      return Response.json(
        { success: false, error: "Unsupported file type. Please upload an image." },
        { status: 415 },
      );
    }

    const maxBytes = 25 * 1024 * 1024; // 25 MB
    if (file.size > maxBytes) {
      return Response.json(
        { success: false, error: "File too large. Maximum size is 25 MB." },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const payload = await getPayload({ config });
    const media = await payload.create({
      collection: "media",
      data: { alt },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name || "customer-upload",
        size: buffer.length,
      },
    });

    const sizes = (media as unknown as { sizes?: Record<string, { url?: string } | null> }).sizes ?? {};

    return NextResponse.json({
      success: true,
      doc: {
        id: media.id,
        url: media.url,
        alt: media.alt,
        thumbnailUrl: sizes.thumbnail?.url ?? media.url,
        cardUrl: sizes.card?.url ?? media.url,
      },
    });
  } catch (err) {
    console.error("[Design Upload] Error:", err);
    return Response.json({ success: false, error: "Upload failed. Please try again." }, { status: 500 });
  }
}