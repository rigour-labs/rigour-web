import { NextResponse } from "next/server";
import { getDemoResult, getDemoRun } from "@/lib/demo/engine";

export async function GET(
  _request: Request,
  context: { params: Promise<{ runId: string }> }
) {
  const { runId } = await context.params;
  const run = getDemoRun(runId);
  const summary = await getDemoResult(runId);

  if (!run || !summary) {
    return NextResponse.json({ error: "Run not found" }, { status: 404 });
  }

  return NextResponse.json({
    runId,
    ...(run.repoUrl
      ? {
          repo: {
            owner: run.owner,
            name: run.name,
            url: run.repoUrl,
          },
        }
      : {}),
    scenarioId: run.scenarioId,
    mode: run.mode,
    scanDepth: run.scanDepth,
    status: run.status,
    verification: run.verification,
    summary,
  });
}
