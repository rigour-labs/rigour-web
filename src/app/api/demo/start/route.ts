import { NextResponse } from "next/server";
import { createDemoRun } from "@/lib/demo/engine";
import type { DemoStartRequest, DemoStartResponse } from "@/lib/demo/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<DemoStartRequest>;
    const repoUrl = body.repoUrl?.trim();
    const scenarioId = body.scenarioId?.trim();

    if (!repoUrl && !scenarioId) {
      return NextResponse.json({ error: "scenarioId or repoUrl is required" }, { status: 400 });
    }

    const run = await createDemoRun(repoUrl, scenarioId);

    const response: DemoStartResponse = {
      runId: run.id,
      mode: run.mode,
      streamUrl: `/api/demo/stream/${run.id}`,
      resultUrl: `/api/demo/result/${run.id}`,
      ...(run.repoUrl
        ? {
            repo: {
              owner: run.owner,
              name: run.name,
              url: run.repoUrl,
            },
          }
        : {}),
      verification: run.verification,
      scenarioId: run.scenarioId,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start demo run";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
