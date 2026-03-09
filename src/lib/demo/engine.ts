import { randomUUID } from "crypto";
import type {
  DemoEvent,
  DemoLane,
  DemoMode,
  DemoRunData,
  DemoRunSummary,
  DemoSeverity,
  DemoStage,
} from "@/lib/demo/types";

const RUNNER_TIMEOUT_MS = 5_500;
const QUICK_SCOPE_SIZE_THRESHOLD_KB = 180_000;
const RUN_TTL_MS = 30 * 60 * 1000;
const LOCAL_EVENT_INTERVAL_MS = 3_500;
const RUNNER_POLL_MS = 1_500;

const runs = new Map<string, DemoRunData>();

interface ParsedRepo {
  owner: string;
  name: string;
  url: string;
}

interface GitHubRepoMeta {
  private: boolean;
  sizeKb: number;
}

interface RunnerStartResult {
  ok: boolean;
  mode: DemoMode;
}

interface RunnerSnapshot {
  mode?: string;
  status?: string;
  error?: string;
  finishedAt?: string | null;
  events?: unknown[];
  summary?: Record<string, unknown> | null;
}

const STAGE_VALUES: DemoStage[] = ["idle", "preflight", "clone", "scan", "supervise", "fix", "rescan", "pass"];
const LANE_VALUES: DemoLane[] = ["system", "in", "out", "persist"];
const SEVERITY_VALUES: DemoSeverity[] = ["info", "warning", "error", "success"];

function nowIso(): string {
  return new Date().toISOString();
}

function cleanupRuns(): void {
  const cutoff = Date.now() - RUN_TTL_MS;
  for (const [id, run] of runs) {
    if (run.startedAt < cutoff) {
      runs.delete(id);
    }
  }
}

function runnerBaseUrl(): string | null {
  const raw = process.env.DEMO_RUNNER_URL?.trim();
  return raw ? raw.replace(/\/$/, "") : null;
}

function normalizeMode(input: string | undefined, fallback: DemoMode): DemoMode {
  if (input === "live" || input === "quick_scope" || input === "fallback") {
    return input;
  }
  return fallback;
}

function coerceStage(input: unknown): DemoStage {
  if (typeof input === "string" && (STAGE_VALUES as string[]).includes(input)) {
    return input as DemoStage;
  }
  return "supervise";
}

function coerceLane(input: unknown): DemoLane {
  if (typeof input === "string" && (LANE_VALUES as string[]).includes(input)) {
    return input as DemoLane;
  }
  return "system";
}

function coerceSeverity(input: unknown): DemoSeverity {
  if (typeof input === "string" && (SEVERITY_VALUES as string[]).includes(input)) {
    return input as DemoSeverity;
  }
  return "info";
}

function asNumberOrNull(input: unknown): number | null {
  return typeof input === "number" && Number.isFinite(input) ? input : null;
}

function toSummary(runId: string, mode: DemoMode, overrides?: Partial<DemoRunSummary>): DemoRunSummary {
  return {
    runId,
    mode,
    beforeScore: null,
    afterScore: null,
    blockedCount: null,
    fixedCount: null,
    durationMs: 0,
    ...overrides,
  };
}

function mapRunnerEvent(raw: unknown, mode: DemoMode): DemoEvent {
  const event = (raw ?? {}) as Record<string, unknown>;
  return {
    ts: typeof event.ts === "string" ? event.ts : nowIso(),
    stage: coerceStage(event.stage),
    lane: coerceLane(event.lane),
    message: typeof event.message === "string" ? event.message : "Runner event received",
    severity: coerceSeverity(event.severity),
    metric:
      event.metric &&
      typeof event.metric === "object" &&
      typeof (event.metric as Record<string, unknown>).label === "string"
        ? {
            label: (event.metric as Record<string, unknown>).label as string,
            value: ((event.metric as Record<string, unknown>).value as string | number | undefined) ?? "",
          }
        : undefined,
    file: typeof event.file === "string" ? event.file : undefined,
    mode,
  };
}

function summaryFromRunner(run: DemoRunData, snapshot: RunnerSnapshot): DemoRunSummary {
  const summary = snapshot.summary ?? {};
  const durationMs =
    asNumberOrNull(summary.durationMs) ??
    (snapshot.finishedAt ? Math.max(new Date(snapshot.finishedAt).getTime() - run.startedAt, 0) : Date.now() - run.startedAt);

  return {
    runId: run.id,
    mode: run.mode,
    beforeScore: asNumberOrNull(summary.beforeScore),
    afterScore: asNumberOrNull(summary.afterScore),
    blockedCount: asNumberOrNull(summary.blockedCount),
    fixedCount: asNumberOrNull(summary.fixedCount),
    durationMs,
    notes: typeof summary.notes === "string" ? summary.notes : undefined,
    outputTail: typeof summary.outputTail === "string" ? summary.outputTail : undefined,
  };
}

export function parseGitHubRepoUrl(rawUrl: string): ParsedRepo | null {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:" || url.hostname !== "github.com") {
    return null;
  }

  const segments = url.pathname.split("/").filter(Boolean);
  if (segments.length < 2) {
    return null;
  }

  const [owner, repoPart] = segments;
  const name = repoPart.replace(/\.git$/, "");

  if (!owner || !name) {
    return null;
  }

  return {
    owner,
    name,
    url: `https://github.com/${owner}/${name}`,
  };
}

async function fetchGithubMeta(repo: ParsedRepo): Promise<GitHubRepoMeta | null> {
  const token = process.env.GITHUB_TOKEN;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4_000);

  try {
    const response = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}`, {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      private: Boolean(data.private),
      sizeKb: Number(data.size ?? 0),
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function triggerRunner(repo: ParsedRepo, runId: string, mode: DemoMode): Promise<RunnerStartResult> {
  const baseUrl = runnerBaseUrl();

  if (!baseUrl) {
    return { ok: false, mode: "fallback" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RUNNER_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.DEMO_RUNNER_TOKEN ? { Authorization: `Bearer ${process.env.DEMO_RUNNER_TOKEN}` } : {}),
      },
      body: JSON.stringify({ runId, repoUrl: repo.url, mode }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      return { ok: false, mode: "fallback" };
    }

    const payload = (await response.json()) as { mode?: string };
    return { ok: true, mode: normalizeMode(payload.mode, mode) };
  } catch {
    return { ok: false, mode: "fallback" };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchRunnerSnapshot(runId: string): Promise<RunnerSnapshot | null> {
  const baseUrl = runnerBaseUrl();
  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/runs/${runId}`, {
      headers: {
        ...(process.env.DEMO_RUNNER_TOKEN ? { Authorization: `Bearer ${process.env.DEMO_RUNNER_TOKEN}` } : {}),
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as RunnerSnapshot;
  } catch {
    return null;
  }
}

function buildEventTemplate(mode: DemoMode, repoLabel: string): Array<Omit<DemoEvent, "ts">> {
  const scopeNote = mode === "quick_scope" ? "Large Repo: Smart Sampling Enabled" : "Full repo scope";

  return [
    {
      stage: "preflight",
      lane: "system",
      message: `Preflight complete for ${repoLabel}`,
      severity: "info",
      metric: { label: "Scope", value: scopeNote },
      mode,
    },
    {
      stage: "clone",
      lane: "system",
      message: `Shallow clone prepared (${repoLabel})`,
      severity: "info",
      metric: { label: "Depth", value: 1 },
      mode,
    },
    {
      stage: "scan",
      lane: "in",
      message: "IN lane: DLP pre-hook blocked a credential before model ingress",
      severity: "error",
      mode,
    },
    {
      stage: "supervise",
      lane: "out",
      message: "OUT lane: Quality gate stopped unsafe/hallucinated output",
      severity: "warning",
      metric: { label: "Gate", value: "quality" },
      mode,
    },
    {
      stage: "supervise",
      lane: "persist",
      message: "PERSIST lane: Native memory write blocked and governed",
      severity: "warning",
      metric: { label: "Gate", value: "governance" },
      mode,
    },
    {
      stage: "fix",
      lane: "system",
      message: "Fix packet generated and sent to the agent",
      severity: "info",
      metric: { label: "Fix Packet", value: "v2" },
      mode,
    },
    {
      stage: "rescan",
      lane: "system",
      message: "Rescan complete: failing gates resolved",
      severity: "success",
      metric: { label: "Result", value: "PASS" },
      mode,
    },
    {
      stage: "pass",
      lane: "system",
      message: "Rigour supervision cycle complete",
      severity: "success",
      mode,
    },
  ];
}

function toTimedEvents(mode: DemoMode, repoLabel: string): DemoEvent[] {
  const template = buildEventTemplate(mode, repoLabel);
  return template.map((event, index) => ({
    ...event,
    ts: new Date(Date.now() + index * LOCAL_EVENT_INTERVAL_MS).toISOString(),
  }));
}

export async function createDemoRun(repoUrl: string): Promise<DemoRunData> {
  cleanupRuns();

  const parsed = parseGitHubRepoUrl(repoUrl);
  if (!parsed) {
    throw new Error("Please provide a valid public GitHub repository URL (https://github.com/owner/repo).");
  }

  const meta = await fetchGithubMeta(parsed);

  let verification: "verified_public" | "unverified" = "unverified";
  if (meta) {
    if (meta.private) {
      throw new Error("Private repositories are not supported in summit demo mode.");
    }
    verification = "verified_public";
  }

  const isQuickScope = Boolean(meta && meta.sizeKb >= QUICK_SCOPE_SIZE_THRESHOLD_KB);
  const preferredMode: DemoMode = verification === "verified_public" ? (isQuickScope ? "quick_scope" : "live") : "fallback";

  const runId = randomUUID();
  const summary = toSummary(runId, preferredMode);

  const run: DemoRunData = {
    id: runId,
    repoUrl: parsed.url,
    owner: parsed.owner,
    name: parsed.name,
    mode: preferredMode,
    verification,
    startedAt: Date.now(),
    execution: "local",
    status: "running",
    events: [],
    summary,
  };

  if (preferredMode !== "fallback") {
    const runner = await triggerRunner(parsed, runId, preferredMode);
    if (runner.ok) {
      run.execution = "runner";
      run.mode = runner.mode;
      run.summary = toSummary(runId, run.mode);
      runs.set(run.id, run);
      return run;
    }
  }

  run.mode = "fallback";
  run.execution = "local";
  run.events = toTimedEvents(run.mode, `${parsed.owner}/${parsed.name}`);
  run.summary = toSummary(runId, run.mode, {
    durationMs: run.events.length * LOCAL_EVENT_INTERVAL_MS,
    notes:
      verification === "unverified"
        ? "Live verification unavailable, switched to deterministic booth-safe path"
        : "Live runner unavailable, switched to deterministic booth-safe path",
  });

  runs.set(run.id, run);
  return run;
}

export function getDemoRun(runId: string): DemoRunData | null {
  cleanupRuns();
  return runs.get(runId) ?? null;
}

export async function getDemoResult(runId: string): Promise<DemoRunSummary | null> {
  const run = getDemoRun(runId);
  if (!run) {
    return null;
  }

  if (run.execution !== "runner") {
    return run.summary;
  }

  const snapshot = await fetchRunnerSnapshot(run.id);
  if (!snapshot) {
    return run.summary;
  }

  run.mode = normalizeMode(snapshot.mode, run.mode);
  run.summary = summaryFromRunner(run, snapshot);
  run.status = snapshot.status === "failed" ? "failed" : snapshot.status === "done" ? "done" : "running";

  if (run.status === "failed" && snapshot.error) {
    run.summary.notes = snapshot.error;
  }

  return run.summary;
}

function buildLocalSseStream(run: DemoRunData): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const timers: NodeJS.Timeout[] = [];

  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        encoder.encode(`event: meta\ndata: ${JSON.stringify({ runId: run.id, mode: run.mode, startedAt: nowIso() })}\n\n`)
      );

      run.events.forEach((event, idx) => {
        const timer = setTimeout(() => {
          controller.enqueue(encoder.encode(`event: progress\ndata: ${JSON.stringify(event)}\n\n`));
          if (idx === run.events.length - 1) {
            run.status = "done";
            controller.enqueue(encoder.encode(`event: done\ndata: ${JSON.stringify(run.summary)}\n\n`));
            controller.close();
          }
        }, idx * LOCAL_EVENT_INTERVAL_MS);

        timers.push(timer);
      });
    },
    cancel() {
      for (const t of timers) {
        clearTimeout(t);
      }
    },
  });
}

function buildRunnerSseStream(run: DemoRunData): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let timer: NodeJS.Timeout | null = null;
  let cancelled = false;
  let sentCount = 0;
  let failedPolls = 0;

  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        encoder.encode(`event: meta\ndata: ${JSON.stringify({ runId: run.id, mode: run.mode, startedAt: nowIso() })}\n\n`)
      );

      const tick = async () => {
        if (cancelled) {
          return;
        }

        const snapshot = await fetchRunnerSnapshot(run.id);

        if (!snapshot) {
          failedPolls += 1;
          if (failedPolls >= 3) {
            run.status = "failed";
            run.summary = toSummary(run.id, run.mode, {
              durationMs: Date.now() - run.startedAt,
              notes: "Runner stream unavailable during live execution",
            });
            controller.enqueue(
              encoder.encode(
                `event: done\ndata: ${JSON.stringify(run.summary)}\n\n`
              )
            );
            controller.close();
            return;
          }

          timer = setTimeout(() => void tick(), RUNNER_POLL_MS);
          return;
        }

        failedPolls = 0;

        run.mode = normalizeMode(snapshot.mode, run.mode);

        const rawEvents = Array.isArray(snapshot.events) ? snapshot.events : [];
        const newEvents = rawEvents.slice(sentCount);

        for (const rawEvent of newEvents) {
          const event = mapRunnerEvent(rawEvent, run.mode);
          run.events.push(event);
          controller.enqueue(encoder.encode(`event: progress\ndata: ${JSON.stringify(event)}\n\n`));
          sentCount += 1;
        }

        const status = snapshot.status;
        if (status === "done" || status === "failed") {
          run.status = status;
          run.summary = summaryFromRunner(run, snapshot);
          if (status === "failed" && snapshot.error) {
            run.summary.notes = snapshot.error;
          }
          controller.enqueue(encoder.encode(`event: done\ndata: ${JSON.stringify(run.summary)}\n\n`));
          controller.close();
          return;
        }

        timer = setTimeout(() => void tick(), RUNNER_POLL_MS);
      };

      void tick();
    },
    cancel() {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    },
  });
}

export function buildSseStream(run: DemoRunData): ReadableStream<Uint8Array> {
  return run.execution === "runner" ? buildRunnerSseStream(run) : buildLocalSseStream(run);
}

export function stageIndex(stage: DemoStage): number {
  return STAGE_VALUES.indexOf(stage);
}
