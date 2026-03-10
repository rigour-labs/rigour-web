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

export interface DemoFailure {
  id: string;
  title: string;
  severity: string;
  provenance?: string;
  files?: string[];
}

export interface DemoRunSummary {
  runId: string;
  mode: DemoMode;
  beforeScore: number | null;
  afterScore: number | null;
  aiHealth?: number | null;
  structuralScore?: number | null;
  blockedCount: number | null;
  fixedCount: number | null;
  gatesPassed?: number | null;
  gatesFailed?: number | null;
  firstScanMs?: number | null;
  secondScanMs?: number | null;
  cached?: boolean;
  durationMs: number;
  scanMeta?: { mode?: string; preset?: string; stack?: string } | null;
  severityBreakdown?: Record<string, number> | null;
  provenanceBreakdown?: Record<string, number> | null;
  failures?: DemoFailure[];
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
