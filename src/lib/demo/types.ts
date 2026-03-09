export type DemoMode = "live" | "quick_scope" | "fallback";

export type DemoStage =
  | "idle"
  | "preflight"
  | "clone"
  | "scan"
  | "supervise"
  | "fix"
  | "rescan"
  | "pass";

export type DemoLane = "system" | "in" | "out" | "persist";

export type DemoSeverity = "info" | "warning" | "error" | "success";

export interface DemoMetric {
  label: string;
  value: string | number;
}

export interface DemoEvent {
  ts: string;
  stage: DemoStage;
  lane: DemoLane;
  message: string;
  severity?: DemoSeverity;
  metric?: DemoMetric;
  file?: string;
  mode: DemoMode;
}

export interface DemoRunSummary {
  runId: string;
  mode: DemoMode;
  beforeScore: number | null;
  afterScore: number | null;
  blockedCount: number | null;
  fixedCount: number | null;
  durationMs: number;
  notes?: string;
  outputTail?: string;
}

export interface DemoStartRequest {
  repoUrl: string;
}

export interface DemoStartResponse {
  runId: string;
  mode: DemoMode;
  streamUrl: string;
  resultUrl: string;
  repo: {
    owner: string;
    name: string;
    url: string;
  };
  verification: "verified_public" | "unverified";
}

export interface DemoRunData {
  id: string;
  repoUrl: string;
  owner: string;
  name: string;
  mode: DemoMode;
  verification: "verified_public" | "unverified";
  startedAt: number;
  execution: "runner" | "local";
  status: "running" | "done" | "failed";
  events: DemoEvent[];
  summary: DemoRunSummary;
}
