import { randomUUID } from "crypto";
import type {
  DemoEvent,
  DemoLane,
  DemoMode,
  DemoRunData,
  DemoRunSummary,
  DemoScanDepth,
  DemoSeverity,
  DemoStage,
} from "@/lib/demo/types";

const RUNNER_TIMEOUT_MS = 5_500;
const QUICK_SCOPE_SIZE_THRESHOLD_KB = 180_000;
const RUN_TTL_MS = 30 * 60 * 1000;
const LOCAL_EVENT_INTERVAL_MS = 650;
const RUNNER_POLL_MS = 1_500;

declare global {
  var __rigourDemoRuns: Map<string, DemoRunData> | undefined;
}

const runs = globalThis.__rigourDemoRuns ?? new Map<string, DemoRunData>();
if (!globalThis.__rigourDemoRuns) {
  globalThis.__rigourDemoRuns = runs;
}

interface ParsedRepo {
  owner: string;
  name: string;
  url: string;
}

interface GitHubRepoMeta {
  private: boolean;
  sizeKb: number;
}

interface GuidedScenario {
  id: string;
  owner: string;
  name: string;
  repoUrl: string;
  mode: DemoMode;
  verification: "verified_public" | "unverified";
  summary: Omit<DemoRunSummary, "runId" | "mode">;
  events: Array<Omit<DemoEvent, "ts" | "mode">>;
}

interface RunnerStartResult {
  ok: boolean;
  mode: DemoMode;
  scanDepth: DemoScanDepth;
}

interface RunnerSnapshot {
  mode?: string;
  scanDepth?: string;
  status?: string;
  error?: string;
  finishedAt?: string | null;
  events?: unknown[];
  summary?: Record<string, unknown> | null;
}

const STAGE_VALUES: DemoStage[] = ["idle", "preflight", "clone", "scan", "supervise", "fix", "rescan", "pass"];
const LANE_VALUES: DemoLane[] = ["system", "in", "out", "persist"];
const SEVERITY_VALUES: DemoSeverity[] = ["info", "warning", "error", "success"];
const DEFAULT_GUIDED_REPO = "";

const GUIDED_SCENARIOS: Record<string, GuidedScenario> = {
  breach_stop: {
    id: "breach_stop",
    owner: "guided",
    name: "credential-breach",
    repoUrl: process.env.GUIDED_SCENARIO_BREACH_REPO?.trim() || DEFAULT_GUIDED_REPO,
    mode: "fallback",
    verification: "unverified",
    summary: {
      beforeScore: 27,
      afterScore: 91,
      aiHealth: 22,
      structuralScore: 41,
      blockedCount: 4,
      fixedCount: 4,
      gatesPassed: 23,
      gatesFailed: 4,
      firstScanMs: 1800,
      secondScanMs: 140,
      cached: true,
      durationMs: 4200,
      scanMeta: { mode: "guided", preset: "credential-breach", stack: "TypeScript" },
      severityBreakdown: { critical: 1, high: 2, medium: 1 },
      provenanceBreakdown: { ai_generated: 3, traditional: 1 },
      failures: [
        { id: "security-patterns", title: "Production token committed in client bundle", severity: "critical" },
        { id: "hallucinated-imports", title: "Fake SDK import would crash deployment", severity: "high" },
        { id: "promise-safety", title: "Async write silently drops rollback errors", severity: "high" },
        { id: "memory-governance", title: "Unsafe memory write attempted with credential context", severity: "medium" },
      ],
      notes: "Scripted guided scenario. No public repo is scanned until you explicitly opt into live proof mode.",
    },
    events: [
      { stage: "preflight", lane: "system", message: "Guided scenario loaded: AI agent attempts unsafe production hotfix", severity: "info" },
      { stage: "scan", lane: "in", message: "IN blocked a live credential before model ingress", severity: "error", metric: { label: "Secret", value: "prod token" } },
      { stage: "supervise", lane: "out", message: "OUT stopped a hallucinated dependency and unsafe async path", severity: "warning", metric: { label: "Blocked", value: "2 critical paths" } },
      { stage: "supervise", lane: "persist", message: "PERSIST denied agent memory write containing sensitive context", severity: "warning", metric: { label: "Memory", value: "denied" } },
      { stage: "fix", lane: "system", message: "Fix packet generated with governed remediation steps", severity: "info", metric: { label: "Fix packet", value: "v2" } },
      { stage: "rescan", lane: "system", message: "Recovery proven: score jumps from 27 to 91", severity: "success", metric: { label: "Recovered", value: "+64" } },
      { stage: "pass", lane: "system", message: "Unsafe release contained before merge", severity: "success" },
    ],
  },
  hallucination_stop: {
    id: "hallucination_stop",
    owner: "guided",
    name: "hallucination-stop",
    repoUrl: process.env.GUIDED_SCENARIO_HALLUCINATION_REPO?.trim() || DEFAULT_GUIDED_REPO,
    mode: "fallback",
    verification: "unverified",
    summary: {
      beforeScore: 33,
      afterScore: 89,
      aiHealth: 29,
      structuralScore: 52,
      blockedCount: 4,
      fixedCount: 4,
      gatesPassed: 23,
      gatesFailed: 4,
      firstScanMs: 1900,
      secondScanMs: 160,
      cached: true,
      durationMs: 4300,
      scanMeta: { mode: "guided", preset: "hallucination-stop", stack: "TypeScript + SDK" },
      severityBreakdown: { critical: 1, high: 2, medium: 1 },
      provenanceBreakdown: { ai_generated: 3, hybrid: 1 },
      failures: [
        { id: "hallucinated-imports", title: "AI introduced a fake SDK dependency", severity: "critical" },
        { id: "phantom-apis", title: "Code called a non-existent vendor method", severity: "high" },
        { id: "logic-drift", title: "Patch diverged from the task intent and bypassed validation", severity: "high" },
        { id: "deprecated-apis", title: "Generated code depended on a removed API surface", severity: "medium" },
      ],
      notes: "This scenario keeps the focus on Rigour itself: real AI code drift, deterministic interception, and proof before production.",
    },
    events: [
      { stage: "preflight", lane: "system", message: "Guided scenario loaded: AI patch attempts to add a fake dependency path", severity: "info" },
      { stage: "scan", lane: "out", message: "OUT detected a hallucinated package and phantom API call before review", severity: "error", metric: { label: "Blocked", value: "2 runtime failures" } },
      { stage: "supervise", lane: "out", message: "Rigour halted the patch because the generated code could not exist in the real SDK", severity: "warning", metric: { label: "Confidence", value: "deterministic fail" } },
      { stage: "fix", lane: "system", message: "Fix packet replaced the fake dependency path with a real implementation plan", severity: "info", metric: { label: "Fix packet", value: "generated" } },
      { stage: "rescan", lane: "system", message: "Patch revalidated with real dependencies and governed logic", severity: "success", metric: { label: "Recovered", value: "+56" } },
      { stage: "pass", lane: "system", message: "Hallucinated runtime failure removed before production", severity: "success" },
    ],
  },
  memory_guard: {
    id: "memory_guard",
    owner: "guided",
    name: "memory-guard",
    repoUrl: process.env.GUIDED_SCENARIO_MEMORY_REPO?.trim() || DEFAULT_GUIDED_REPO,
    mode: "fallback",
    verification: "unverified",
    summary: {
      beforeScore: 38,
      afterScore: 94,
      aiHealth: 36,
      structuralScore: 61,
      blockedCount: 3,
      fixedCount: 3,
      gatesPassed: 24,
      gatesFailed: 3,
      firstScanMs: 1700,
      secondScanMs: 120,
      cached: true,
      durationMs: 3900,
      scanMeta: { mode: "guided", preset: "memory-guard", stack: "Agent memory governance" },
      severityBreakdown: { high: 2, medium: 1 },
      provenanceBreakdown: { policy: 2, ai_generated: 1 },
      failures: [
        { id: "memory-governance", title: "Agent attempted to persist secret-bearing context to long-term memory", severity: "high" },
        { id: "memory-governance", title: "Unsafe prior state would have been replayed into future coding sessions", severity: "high" },
        { id: "policy", title: "Persistence request lacked governed justification", severity: "medium" },
      ],
      notes: "This is Rigour's memory-control story: governance does not stop at code generation, it also controls what agents are allowed to remember.",
    },
    events: [
      { stage: "preflight", lane: "system", message: "Guided scenario loaded: agent tries to save poisoned memory and secret context", severity: "info" },
      { stage: "scan", lane: "persist", message: "PERSIST flagged an unauthorized long-term memory write", severity: "error", metric: { label: "Memory", value: "blocked" } },
      { stage: "supervise", lane: "in", message: "IN scrubbed sensitive context before it could be replayed into future sessions", severity: "warning", metric: { label: "Context", value: "sanitized" } },
      { stage: "fix", lane: "system", message: "Rigour issued a governed memory policy patch with explicit allow/deny boundaries", severity: "info", metric: { label: "Policy", value: "tightened" } },
      { stage: "rescan", lane: "system", message: "Memory policy revalidated and unsafe persistence was removed", severity: "success", metric: { label: "Recovered", value: "+56" } },
      { stage: "pass", lane: "system", message: "Agent memory is now governed and safe to reuse", severity: "success" },
    ],
  },
};

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

function normalizeScanDepth(input: string | undefined, fallback: DemoScanDepth): DemoScanDepth {
  if (input === "fast" || input === "deep" || input === "deep_pro") {
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

function toTimedScenarioEvents(scenario: GuidedScenario): DemoEvent[] {
  return scenario.events.map((event, index) => ({
    ...event,
    mode: scenario.mode,
    ts: new Date(Date.now() + index * LOCAL_EVENT_INTERVAL_MS).toISOString(),
  }));
}

function buildScenarioRun(scenario: GuidedScenario): DemoRunData {
  const runId = randomUUID();
  return {
    id: runId,
    repoUrl: null,
    owner: scenario.owner,
    name: scenario.name,
    scenarioId: scenario.id,
    mode: scenario.mode,
    scanDepth: "fast",
    verification: scenario.verification,
    startedAt: Date.now(),
    execution: "local",
    status: "running",
    events: toTimedScenarioEvents(scenario),
    summary: {
      runId,
      mode: scenario.mode,
      ...scenario.summary,
    },
  };
}

function mapRunnerEvent(raw: unknown, mode: DemoMode): DemoEvent {
  const event = (raw ?? {}) as Record<string, unknown>;
  const mapped: DemoEvent = {
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
  if (event.data && typeof event.data === "object") {
    mapped.data = event.data as DemoEvent["data"];
  }
  return mapped;
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
    aiHealth: asNumberOrNull(summary.aiHealth),
    structuralScore: asNumberOrNull(summary.structuralScore),
    blockedCount: asNumberOrNull(summary.blockedCount),
    fixedCount: asNumberOrNull(summary.fixedCount),
    gatesPassed: asNumberOrNull(summary.gatesPassed),
    gatesFailed: asNumberOrNull(summary.gatesFailed),
    firstScanMs: asNumberOrNull(summary.firstScanMs),
    secondScanMs: asNumberOrNull(summary.secondScanMs),
    cached: typeof summary.cached === "boolean" ? summary.cached : undefined,
    durationMs,
    scanMeta: summary.scanMeta && typeof summary.scanMeta === "object" ? summary.scanMeta as DemoRunSummary["scanMeta"] : null,
    severityBreakdown: summary.severityBreakdown && typeof summary.severityBreakdown === "object" ? summary.severityBreakdown as Record<string, number> : null,
    provenanceBreakdown: summary.provenanceBreakdown && typeof summary.provenanceBreakdown === "object" ? summary.provenanceBreakdown as Record<string, number> : null,
    failures: Array.isArray(summary.failures) ? summary.failures as DemoRunSummary["failures"] : undefined,
    notes: typeof summary.notes === "string" ? summary.notes : undefined,
    outputTail: typeof summary.outputTail === "string" ? summary.outputTail : undefined,
    learningState: summary.learningState && typeof summary.learningState === "object" ? summary.learningState as DemoRunSummary["learningState"] : null,
    deepPassFailures: typeof summary.deepPassFailures === "number" ? summary.deepPassFailures : null,
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

async function triggerRunner(
  repo: ParsedRepo,
  runId: string,
  mode: DemoMode,
  scanDepth: DemoScanDepth,
  scenarioId?: string
): Promise<RunnerStartResult> {
  const baseUrl = runnerBaseUrl();

  if (!baseUrl) {
    return { ok: false, mode: "fallback", scanDepth };
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
      body: JSON.stringify({
        runId,
        repoUrl: repo.url,
        mode,
        scanDepth,
        ...(scenarioId ? { scenarioId } : {}),
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      return { ok: false, mode: "fallback", scanDepth };
    }

    const payload = (await response.json()) as { mode?: string; scanDepth?: string };
    return {
      ok: true,
      mode: normalizeMode(payload.mode, mode),
      scanDepth: normalizeScanDepth(payload.scanDepth, scanDepth),
    };
  } catch {
    return { ok: false, mode: "fallback", scanDepth };
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

export async function createDemoRun(
  repoUrl?: string,
  scenarioId?: string,
  requestedScanDepth: DemoScanDepth = "fast"
): Promise<DemoRunData> {
  cleanupRuns();

  if (scenarioId && GUIDED_SCENARIOS[scenarioId]) {
    const scenario = GUIDED_SCENARIOS[scenarioId];
    const parsedScenarioRepo = parseGitHubRepoUrl(scenario.repoUrl);
    const run = buildScenarioRun(scenario);
    run.scanDepth = requestedScanDepth;

    if (parsedScenarioRepo) {
      const meta = await fetchGithubMeta(parsedScenarioRepo);
      let verification: "verified_public" | "unverified" = "unverified";
      if (meta) {
        if (meta.private) {
          throw new Error("Guided scenario repositories must remain public.");
        }
        verification = "verified_public";
      }

      run.repoUrl = parsedScenarioRepo.url;
      run.owner = parsedScenarioRepo.owner;
      run.name = parsedScenarioRepo.name;
      run.verification = verification;

      const isQuickScope = Boolean(meta && meta.sizeKb >= QUICK_SCOPE_SIZE_THRESHOLD_KB);
      const preferredMode: DemoMode = isQuickScope ? "quick_scope" : "live";
      const runner = await triggerRunner(parsedScenarioRepo, run.id, preferredMode, requestedScanDepth, scenario.id);

      if (runner.ok) {
        run.execution = "runner";
        run.mode = runner.mode;
        run.scanDepth = runner.scanDepth;
        run.events = [];
        run.summary = toSummary(run.id, run.mode, {
          notes: "Running real guided Rigour scenario on a persistent repo workspace.",
        });
        runs.set(run.id, run);
        return run;
      }
    }

    runs.set(run.id, run);
    return run;
  }

  const parsed = parseGitHubRepoUrl(repoUrl || "");
  if (!parsed) {
    throw new Error("Please provide a valid public GitHub repository URL (https://github.com/owner/repo).");
  }

  const meta = await fetchGithubMeta(parsed);

  let verification: "verified_public" | "unverified" = "unverified";
  if (meta) {
    if (meta.private) {
      throw new Error("Private repositories are not supported in guided demo mode.");
    }
    verification = "verified_public";
  }

  const isQuickScope = Boolean(meta && meta.sizeKb >= QUICK_SCOPE_SIZE_THRESHOLD_KB);
  const preferredMode: DemoMode = isQuickScope ? "quick_scope" : "live";

  const runId = randomUUID();
  const summary = toSummary(runId, preferredMode);

  const run: DemoRunData = {
    id: runId,
    repoUrl: parsed.url,
    owner: parsed.owner,
    name: parsed.name,
    scenarioId,
    mode: preferredMode,
    scanDepth: requestedScanDepth,
    verification,
    startedAt: Date.now(),
    execution: "local",
    status: "running",
    events: [],
    summary,
  };

  const runner = await triggerRunner(parsed, runId, preferredMode, requestedScanDepth);
  if (runner.ok) {
    run.execution = "runner";
    run.mode = runner.mode;
    run.scanDepth = runner.scanDepth;
    run.summary = toSummary(runId, run.mode);
    runs.set(run.id, run);
    return run;
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
  run.scanDepth = normalizeScanDepth(snapshot.scanDepth, run.scanDepth);
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
        encoder.encode(
          `event: meta\ndata: ${JSON.stringify({ runId: run.id, mode: run.mode, scanDepth: run.scanDepth, startedAt: nowIso() })}\n\n`
        )
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
        encoder.encode(
          `event: meta\ndata: ${JSON.stringify({ runId: run.id, mode: run.mode, scanDepth: run.scanDepth, startedAt: nowIso() })}\n\n`
        )
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
