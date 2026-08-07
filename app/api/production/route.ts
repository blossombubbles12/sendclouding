import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { generatePrintFilesForJob, transitionJob } from "@/lib/production/service";

/**
 * POST /api/production/generate-files
 * Body: { jobId: string }
 *
 * Background worker endpoint or administrative trigger to generate 300 DPI master files.
 */
export async function POST(req: NextRequest) {
  try {
    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ success: false, error: "Missing jobId" }, { status: 400 });
    }

    await generatePrintFilesForJob(jobId);
    return NextResponse.json({ success: true, message: "Print-ready master files generated successfully." });
  } catch (err: any) {
    console.error("[Production API] Generation error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to generate master files." }, { status: 500 });
  }
}

/**
 * PATCH /api/production/transition
 * Body: { jobId: string, status: string, action: string, note?: string, actorId?: string, submitToProvider?: boolean }
 *
 * Transitions a job status and logs audit comments.
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, status, action, note, actorId, submitToProvider } = body;

    if (!jobId || !status || !action) {
      return NextResponse.json({ success: false, error: "Missing jobId, status or action parameters." }, { status: 400 });
    }

    const result = await transitionJob({
      jobId,
      status,
      action,
      note,
      actor: actorId,
      submitToProvider,
    });

    return NextResponse.json({ success: true, doc: result });
  } catch (err: any) {
    console.error("[Production API] Transition error:", err);
    return NextResponse.json({ success: false, error: err.message || "Failed to transition production job status." }, { status: 500 });
  }
}
