export type DemoMode = "live" | "quick_scope" | "fallback";
export type DemoScanDepth = "fast" | "deep" | "deep_pro";

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
  data?: {
    score?: number | null;
    aiHealth?: number | null;
    structuralScore?: number | null;
    failureCount?: number;
    gatesPassed?: number;
    gatesFailed?: number;
    durationMs?: number;
    cached?: boolean;
    depth?: string;
    passes?: number;
    failures?: DemoFailure[];
  };
}

export interface DemoFailure {
  id: string;
  title: string;
  severity: string;
  provenance?: string;
  files?: string[];
}

export interface DemoLearningState {
  priorRuns: number;
  trend: "improving" | "degrading" | "stable";
  recentAvgFailures: number;
  earlyAvgFailures: number;
  latestRun?: {
    passed: number;
    failed: number;
    aiDrift: number;
    structural: number;
    security: number;
  } | null;
  scoreHistory?: Array<{
    ts: string;
    passed: number;
    failed: number;
    total: number;
    aiDrift: number;
    structural: number;
    security: number;
  }>;
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
  learningState?: DemoLearningState | null;
  deepPassFailures?: number | null;
}

export interface DemoStartRequest {
  repoUrl?: string;
  scenarioId?: string;
  scanDepth?: DemoScanDepth;
}

export interface DemoStartResponse {
  runId: string;
  mode: DemoMode;
  scanDepth: DemoScanDepth;
  streamUrl: string;
  resultUrl: string;
  repo?: {
    owner: string;
    name: string;
    url: string;
  };
  verification: "verified_public" | "unverified";
  scenarioId?: string;
}

export interface DemoRunData {
  id: string;
  repoUrl: string | null;
  owner: string;
  name: string;
  scenarioId?: string;
  mode: DemoMode;
  scanDepth: DemoScanDepth;
  verification: "verified_public" | "unverified";
  startedAt: number;
  execution: "runner" | "local";
  status: "running" | "done" | "failed";
  events: DemoEvent[];
  summary: DemoRunSummary;
}
