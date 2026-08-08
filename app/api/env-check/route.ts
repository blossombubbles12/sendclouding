import { NextResponse } from "next/server";

/**
 * Temporary diagnostic endpoint — confirms whether required server env vars are
 * actually visible to the running deployment, without leaking their values.
 * Safe to delete once the Blob upload issue is confirmed resolved.
 */
export async function GET() {
  return NextResponse.json({
    blobTokenPresent: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    blobStoreIdPresent: Boolean(process.env.BLOB_STORE_ID),
    databaseUriPresent: Boolean(process.env.DATABASE_URI),
    vercelEnv: process.env.VERCEL_ENV || null,
    deployedAt: new Date().toISOString(),
  });
}
