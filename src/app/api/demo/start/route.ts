import { NextResponse } from "next/server";
import { createDemoRun } from "@/lib/demo/engine";
import type { DemoStartRequest, DemoStartResponse } from "@/lib/demo/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<DemoStartRequest>;
    const repoUrl = body.repoUrl?.trim();

    if (!repoUrl) {
      return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });
    }

    const run = await createDemoRun(repoUrl);

    const response: DemoStartResponse = {
      runId: run.id,
      mode: run.mode,
      streamUrl: `/api/demo/stream/${run.id}`,
      resultUrl: `/api/demo/result/${run.id}`,
      repo: {
        owner: run.owner,
        name: run.name,
        url: run.repoUrl,
      },
      verification: run.verification,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not start demo run";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
