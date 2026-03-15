"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  TerminalSquare,
  Zap,
  XCircle,
  Activity,
  Timer,
  BarChart3,
  Shield,
  CheckCircle2,
  Lock,
  Eye,
  Database,
  Volume2,
  VolumeX,
  Brain,
  TrendingUp,
  TrendingDown,
  Minus,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import type {
  DemoEvent,
  DemoFailure,
  DemoLearningState,
  DemoMode,
  DemoRunSummary,
  DemoScanDepth,
  DemoSeverity,
  DemoStage,
  DemoStartResponse,
} from "@/lib/demo/types";

const STAGES: DemoStage[] = ["idle", "preflight", "clone", "scan", "supervise", "fix", "rescan", "pass"];

type RunStatus = "idle" | "running" | "done" | "error";

interface LaneDef {
  lane: "in" | "out" | "persist";
  title: string;
  subtitle: string;
  icon: typeof Shield;
  description: string;
}

const LANES: LaneDef[] = [
  { lane: "in", title: "IN", subtitle: "DLP Pre-Hook", icon: Lock, description: "Secrets & credential interception" },
  { lane: "out", title: "OUT", subtitle: "Quality Gates", icon: Eye, description: "AI drift, hallucinations & code quality" },
  { lane: "persist", title: "PERSIST", subtitle: "Memory Governance", icon: Database, description: "Agent memory & state governance" },
];

/** Map provenance/finding-id to the lane it belongs to */
function findingToLane(f: DemoFailure): "in" | "out" | "persist" {
  const id = f.id?.toLowerCase() ?? "";
  const title = f.title?.toLowerCase() ?? "";
  const prov = f.provenance?.toLowerCase() ?? "";

  // Security findings → IN lane
  if (prov === "security" || id === "security-patterns" || id === "frontend-secret-exposure") return "in";
  if (title.includes("secret") || title.includes("credential") || title.includes("token") || title.includes("injection")) return "in";

  // Governance findings → PERSIST lane
  if (prov === "governance" || prov === "policy" || id.includes("memory") || id.includes("checkpoint") || id.includes("retry-loop")) return "persist";
  if (title.includes("memory") || title.includes("persist") || title.includes("governance") || title.includes("policy")) return "persist";

  // Everything else → OUT lane (ai-drift, traditional, deep-analysis)
  return "out";
}

function severityClass(severity?: DemoSeverity | string): string {
  const s = severity?.toLowerCase();
  if (s === "error" || s === "critical") return "text-red-300";
  if (s === "warning" || s === "high") return "text-amber-300";
  if (s === "success") return "text-emerald-300";
  return "text-zinc-300";
}

function severityBadgeClass(severity: string): string {
  const s = severity.toLowerCase();
  if (s === "critical") return "bg-red-500/20 text-red-300 border-red-500/30";
  if (s === "high") return "bg-red-500/15 text-red-300 border-red-500/20";
  if (s === "medium" || s === "warning") return "bg-amber-500/20 text-amber-300 border-amber-500/30";
  return "bg-zinc-700/50 text-zinc-400 border-zinc-600/30";
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function scoreBorderColor(score: number): string {
  if (score >= 80) return "border-emerald-500/50";
  if (score >= 60) return "border-amber-500/50";
  return "border-red-500/50";
}

function scoreGlowColor(score: number): string {
  if (score >= 80) return "shadow-emerald-500/20";
  if (score >= 60) return "shadow-amber-500/20";
  return "shadow-red-500/20";
}

function severityRank(severity: string): number {
  const normalized = severity.toLowerCase();
  if (normalized === "critical") return 5;
  if (normalized === "high") return 4;
  if (normalized === "medium") return 3;
  if (normalized === "warning") return 2;
  if (normalized === "low") return 1;
  return 0;
}

function isUspFinding(title: string): boolean {
  const t = title.toLowerCase();
  return [
    "secret",
    "credential",
    "hallucin",
    "phantom",
    "memory",
    "govern",
    "prompt",
    "leak",
    "unsafe",
    "policy",
    "auth",
    "injection",
  ].some((keyword) => t.includes(keyword));
}

function getStageIndex(stage: DemoStage): number {
  return STAGES.indexOf(stage);
}

function formatMs(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

function stageLabel(stage: DemoStage): string {
  switch (stage) {
    case "preflight":
      return "Preflight";
    case "clone":
      return "Load Context";
    case "scan":
      return "Detect";
    case "supervise":
      return "Intercept";
    case "fix":
      return "Repair";
    case "rescan":
      return "Verify";
    case "pass":
      return "Recover";
    default:
      return "Ready";
  }
}

function stageTone(stage: DemoStage): string {
  switch (stage) {
    case "scan":
    case "supervise":
      return "border-amber-500/30 bg-amber-500/10 text-amber-200";
    case "fix":
    case "rescan":
    case "pass":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
    default:
      return "border-zinc-700 bg-zinc-900/80 text-zinc-200";
  }
}

function clipText(text: string, max = 220): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 3)}...`;
}

function depthLabel(depth: DemoScanDepth): string {
  if (depth === "deep_pro") return "Deep Pro";
  if (depth === "deep") return "Deep";
  return "Fast";
}

/* ── Provenance display helpers ── */
const PROVENANCE_LABELS: Record<string, string> = {
  "ai-drift": "AI Drift",
  "deep-analysis": "Deep Analysis (LLM)",
  traditional: "Traditional",
  security: "Security",
  governance: "Governance",
};

const PROVENANCE_ZERO_HINTS: Record<string, string> = {
  "deep-analysis": "Requires deep/deep_pro scan with working local inference or cloud provider",
  governance: "Triggers on agent memory writes, checkpoint drift, and retry loops",
};

/* ── Brain Learning Card ── */
function BrainLearningCard({ learning }: { learning: DemoLearningState }) {
  const hasMultipleRuns = learning.priorRuns > 1;
  const TrendIcon = learning.trend === "improving" ? TrendingUp : learning.trend === "degrading" ? TrendingDown : Minus;
  const trendColor = learning.trend === "improving" ? "text-emerald-400" : learning.trend === "degrading" ? "text-red-400" : "text-violet-400";
  const history = learning.scoreHistory ?? [];
  const maxTotal = Math.max(...history.map((h) => h.total), 1);
  const lr = learning.latestRun;
  const totalFindings = lr ? lr.aiDrift + lr.structural + lr.security : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Brain className="h-3.5 w-3.5 text-violet-400" />
          <span className="text-xs font-semibold text-zinc-300">Rigour Brain</span>
        </div>
        {hasMultipleRuns ? (
          <div className="flex items-center gap-1">
            <TrendIcon className={`h-3 w-3 ${trendColor}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${trendColor}`}>
              {learning.trend} ({learning.priorRuns} scans)
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-violet-400 font-semibold uppercase tracking-wider">Provenance Split</span>
        )}
      </div>

      {/* Multi-scan sparkline */}
      {hasMultipleRuns && history.length > 1 && (
        <div className="flex items-end gap-px h-8 mb-2">
          {history.map((h, i) => {
            const height = Math.max(4, (h.total / maxTotal) * 100);
            const aiPct = h.total > 0 ? (h.aiDrift / h.total) * 100 : 0;
            return (
              <div
                key={i}
                className="flex-1 rounded-t-sm overflow-hidden relative"
                style={{ height: `${height}%` }}
                title={`Scan ${i + 1}: ${h.total} findings (${h.aiDrift} AI drift, ${h.structural} structural, ${h.security} security)`}
              >
                <div className="absolute bottom-0 w-full bg-violet-500/40" style={{ height: `${100 - aiPct}%` }} />
                <div className="absolute top-0 w-full bg-amber-500/50" style={{ height: `${aiPct}%` }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Provenance split bar — always shows */}
      {lr && totalFindings > 0 && (
        <div className="mb-2">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800 flex">
            {lr.aiDrift > 0 && (
              <div className="h-full bg-amber-500/70" style={{ width: `${(lr.aiDrift / totalFindings) * 100}%` }} />
            )}
            {lr.structural > 0 && (
              <div className="h-full bg-violet-500/60" style={{ width: `${(lr.structural / totalFindings) * 100}%` }} />
            )}
            {lr.security > 0 && (
              <div className="h-full bg-red-500/70" style={{ width: `${(lr.security / totalFindings) * 100}%` }} />
            )}
          </div>
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500/70" /> AI drift {lr.aiDrift}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-500/60" /> Structural {lr.structural}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-zinc-500">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500/70" /> Security {lr.security}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Multi-scan trend stats */}
      {hasMultipleRuns && (
        <div className="grid grid-cols-3 gap-2 text-center mb-1">
          <div>
            <p className="text-[10px] text-zinc-600">Early avg</p>
            <p className="text-xs font-mono text-zinc-400">{learning.earlyAvgFailures}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">Recent avg</p>
            <p className={`text-xs font-mono ${trendColor}`}>{learning.recentAvgFailures}</p>
          </div>
          <div>
            <p className="text-[10px] text-zinc-600">AI drift ratio</p>
            <p className="text-xs font-mono text-amber-400">
              {lr && totalFindings > 0 ? `${Math.round((lr.aiDrift / totalFindings) * 100)}%` : "0%"}
            </p>
          </div>
        </div>
      )}

      <p className="text-[10px] text-zinc-600 mt-1">
        {hasMultipleRuns
          ? "Adaptive thresholds use EWMA + Z-score to tighten gates where quality degrades."
          : "Rigour separates AI-generated findings from traditional code issues — enabling targeted governance."}
      </p>
    </motion.div>
  );
}

/* ── Findings by Lane ── */
function categorizeFindingsByLane(findings: DemoFailure[]): Record<"in" | "out" | "persist", DemoFailure[]> {
  const result: Record<"in" | "out" | "persist", DemoFailure[]> = { in: [], out: [], persist: [] };
  for (const f of findings) {
    result[findingToLane(f)].push(f);
  }
  return result;
}

/* ── Results Panel (the "aha moment") ── */
function ResultsPanel({ summary }: { summary: DemoRunSummary }) {
  const score = summary.beforeScore;
  const hasScore = score !== null && score !== undefined;
  const findings = summary.blockedCount ?? 0;
  const gatesPassed = summary.gatesPassed ?? 0;
  const gatesFailed = summary.gatesFailed ?? 0;
  const totalGates = gatesPassed + gatesFailed;
  const firstScanMs = summary.firstScanMs;
  const secondScanMs = summary.secondScanMs;
  const cached = summary.cached;
  const prioritizedFindings = (() => {
    const source = summary.failures ?? [];
    const deduped: typeof source = [];
    const seen = new Set<string>();
    for (const item of source) {
      const key = item.title.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(item);
      }
    }

    const sorted = [...deduped].sort((a, b) => {
      const severityDelta = severityRank(b.severity) - severityRank(a.severity);
      if (severityDelta !== 0) return severityDelta;

      const uspDelta = Number(isUspFinding(b.title)) - Number(isUspFinding(a.title));
      if (uspDelta !== 0) return uspDelta;

      return a.title.localeCompare(b.title);
    });

    const strong = sorted.filter((item) => severityRank(item.severity) >= 3);
    const pool = strong.length > 0 ? strong : sorted;
    return pool.slice(0, 8);
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* Big score hero */}
      <div className={`rounded-2xl border ${hasScore ? scoreBorderColor(score!) : "border-zinc-700"} bg-zinc-900/80 p-6 shadow-lg ${hasScore ? scoreGlowColor(score!) : ""}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-outfit">Scan Results</h2>
          {summary.scanMeta?.stack && (
            <span className="rounded-full border border-zinc-700 bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
              {summary.scanMeta.stack}
            </span>
          )}
        </div>

        <div className="flex items-end gap-6">
          {/* Score */}
          <div className="flex-shrink-0">
            <p className="text-xs text-zinc-500 mb-1">Quality Score</p>
            <p className={`text-6xl font-bold font-outfit tabular-nums ${hasScore ? scoreColor(score!) : "text-zinc-500"}`}>
              {hasScore ? score : "—"}
              <span className="text-2xl text-zinc-600">/100</span>
            </p>
          </div>

          {/* Gate bar */}
          {totalGates > 0 && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                <span>{totalGates} gates evaluated</span>
                <span>{gatesPassed} passed, {gatesFailed} failed</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800 flex">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(gatesPassed / totalGates) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-emerald-500 rounded-l-full"
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(gatesFailed / totalGates) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-full bg-red-500 rounded-r-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <XCircle className="h-3.5 w-3.5 text-red-400" />
            <span className="text-[10px] uppercase tracking-wide text-zinc-500">Findings</span>
          </div>
          <p className="text-2xl font-bold font-outfit text-zinc-100">{findings}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Activity className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-[10px] uppercase tracking-wide text-zinc-500">AI Health</span>
          </div>
          <p className="text-2xl font-bold font-outfit text-zinc-100">
            {summary.aiHealth !== null && summary.aiHealth !== undefined ? summary.aiHealth : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Timer className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[10px] uppercase tracking-wide text-zinc-500">Scan Time</span>
          </div>
          <p className="text-2xl font-bold font-outfit text-zinc-100">
            {firstScanMs ? formatMs(firstScanMs) : "—"}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[10px] uppercase tracking-wide text-zinc-500">Cache</span>
          </div>
          <p className="text-2xl font-bold font-outfit text-zinc-100">
            {cached && secondScanMs ? (
              <span className="text-emerald-400">{formatMs(secondScanMs)}</span>
            ) : (
              "miss"
            )}
          </p>
          {cached && firstScanMs && secondScanMs && secondScanMs > 0 && (
            <p className="text-[10px] text-emerald-400 mt-0.5">{Math.round(firstScanMs / secondScanMs)}x faster</p>
          )}
        </div>
      </div>

      {/* Severity & provenance breakdown */}
      {(summary.severityBreakdown || summary.provenanceBreakdown) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {summary.severityBreakdown && Object.keys(summary.severityBreakdown).length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <BarChart3 className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-300">By Severity</span>
              </div>
              <div className="space-y-1.5">
                {Object.entries(summary.severityBreakdown).map(([key, count]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className={`text-xs ${key === "critical" || key === "high" ? "text-red-400" : key === "medium" ? "text-amber-400" : "text-zinc-400"}`}>
                      {key}
                    </span>
                    <span className="text-xs font-mono text-zinc-300">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {summary.provenanceBreakdown && Object.keys(summary.provenanceBreakdown).length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <BarChart3 className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-300">By Provenance</span>
              </div>
              <div className="space-y-1.5">
                {Object.entries(summary.provenanceBreakdown).map(([key, count]) => {
                  const label = PROVENANCE_LABELS[key] ?? key.replace(/[-_]/g, " ");
                  const isZero = count === 0;
                  const hint = isZero ? PROVENANCE_ZERO_HINTS[key] : undefined;
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${isZero ? "text-zinc-600" : "text-zinc-400"}`}>{label}</span>
                        <span className={`text-xs font-mono ${isZero ? "text-zinc-600" : "text-zinc-300"}`}>{count}</span>
                      </div>
                      {hint && <p className="text-[10px] text-zinc-600 pl-1 mt-0.5">{hint}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rigour Brain — adaptive learning */}
      {summary.learningState && summary.learningState.priorRuns > 0 && (
        <BrainLearningCard learning={summary.learningState} />
      )}

      {/* Deep pass failure notice */}
      {summary.deepPassFailures != null && summary.deepPassFailures > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2">
          <TriangleAlert className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-amber-300">Deep analysis passes failed ({summary.deepPassFailures})</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              deep-analysis provenance shows 0 because the local inference engine could not complete.
              Ensure llama-cli is installed or configure a cloud provider fallback.
            </p>
          </div>
        </div>
      )}

      {/* Top failures */}
      {prioritizedFindings.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
          <p className="text-xs font-semibold text-zinc-300 mb-2">Rigour Proof Findings ({prioritizedFindings.length} of {findings})</p>
          <div className="space-y-1.5 max-h-[200px] overflow-auto">
            {prioritizedFindings.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`mt-0.5 flex-shrink-0 rounded border px-1 py-0.5 text-[10px] font-semibold uppercase ${severityBadgeClass(f.severity)}`}>
                  {f.severity}
                </span>
                <span className="text-zinc-300 leading-tight">{f.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {summary.notes && (
        <p className="rounded border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          {summary.notes}
        </p>
      )}
    </motion.div>
  );
}

/* ── Lane Finding Card (what each control point caught) ── */
function LaneFindingCard({
  laneDef,
  event,
  findings,
  isDone,
}: {
  laneDef: LaneDef;
  event?: DemoEvent;
  findings: DemoFailure[];
  isDone: boolean;
}) {
  const LaneIcon = laneDef.icon;
  const hasCritical = findings.some((f) => f.severity === "critical" || f.severity === "high");
  const hasFindings = findings.length > 0;

  // Determine card styling
  let borderClass = "border-zinc-800 bg-zinc-900/70";
  let pulseClass = "bg-zinc-700";

  if (isDone && hasFindings) {
    borderClass = hasCritical
      ? "border-red-500/30 bg-red-500/10"
      : "border-amber-500/30 bg-amber-500/10";
    pulseClass = hasCritical ? "bg-red-400" : "bg-amber-400";
  } else if (isDone && !hasFindings) {
    borderClass = "border-emerald-500/30 bg-emerald-500/10";
    pulseClass = "bg-emerald-400";
  } else if (event) {
    borderClass = event.severity === "error"
      ? "border-red-500/30 bg-red-500/10"
      : event.severity === "warning"
        ? "border-amber-500/30 bg-amber-500/10"
        : "border-emerald-500/30 bg-emerald-500/10";
    pulseClass = "bg-current animate-pulse";
  }

  return (
    <div className={`rounded-xl border px-3 py-3 transition-all duration-300 ${borderClass}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LaneIcon className="h-4 w-4 text-zinc-400" />
          <div>
            <p className="text-sm font-semibold text-zinc-100">{laneDef.title}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{laneDef.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDone && hasFindings && (
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${hasCritical ? "bg-red-500/20 text-red-300" : "bg-amber-500/20 text-amber-300"}`}>
              {findings.length}
            </span>
          )}
          {isDone && !hasFindings && (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          )}
          <span className={`h-2.5 w-2.5 rounded-full ${pulseClass}`} />
        </div>
      </div>

      {/* During scan — show live event message */}
      {!isDone && (
        <p className={`mt-3 text-sm leading-relaxed ${event ? severityClass(event.severity) : "text-zinc-500"}`}>
          {event ? clipText(event.message, 180) : laneDef.description}
        </p>
      )}

      {/* After scan — show categorized findings */}
      {isDone && hasFindings && (
        <div className="mt-3 space-y-1.5">
          {findings.slice(0, 4).map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="flex items-start gap-2 text-xs"
            >
              <span className={`mt-0.5 flex-shrink-0 rounded border px-1 py-0.5 text-[9px] font-bold uppercase ${severityBadgeClass(f.severity)}`}>
                {f.severity}
              </span>
              <span className="text-zinc-200 leading-tight">{f.title}</span>
            </motion.div>
          ))}
          {findings.length > 4 && (
            <p className="text-[10px] text-zinc-500 pl-1">+{findings.length - 4} more</p>
          )}
        </div>
      )}

      {/* After scan — clean lane */}
      {isDone && !hasFindings && (
        <p className="mt-3 text-sm leading-relaxed text-emerald-300">
          All clear — no issues in this lane.
        </p>
      )}
    </div>
  );
}

/* ── Main Component ── */
export function DemoExperience() {
  const [repoUrl, setRepoUrl] = useState("");
  const [status, setStatus] = useState<RunStatus>("idle");
  const [stage, setStage] = useState<DemoStage>("idle");
  const [, setMode] = useState<DemoMode | null>(null);
  const [, setVerification] = useState<"verified_public" | "unverified" | null>(null);
  const [events, setEvents] = useState<DemoEvent[]>([]);
  const [summary, setSummary] = useState<DemoRunSummary | null>(null);
  const [showEvidence, setShowEvidence] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [scanDepth, setScanDepth] = useState<DemoScanDepth>("fast");
  const [isAdFullscreen, setIsAdFullscreen] = useState(false);
  const [videosMuted, setVideosMuted] = useState(true);
  const streamRef = useRef<EventSource | null>(null);
  const adFrameRef = useRef<HTMLDivElement | null>(null);
  const hrVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (status !== "running" || !startedAt) {
      return;
    }

    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 200);

    return () => clearInterval(interval);
  }, [status, startedAt]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsAdFullscreen(document.fullscreenElement === adFrameRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Auto-expand evidence on completion
  useEffect(() => {
    if (status === "done" && summary) {
      setShowEvidence(true);
    }
  }, [status, summary]);

  // Sync mute state to HR video element (YouTube is handled via iframe key)
  useEffect(() => {
    if (hrVideoRef.current) hrVideoRef.current.muted = videosMuted;
  }, [videosMuted]);

  const progressPct = useMemo(() => {
    if (status === "done") return 100;
    return Math.max(getStageIndex(stage), 0) / (STAGES.length - 1) * 100;
  }, [stage, status]);

  const laneEvents = useMemo(() => {
    const lookup: Partial<Record<"in" | "out" | "persist", DemoEvent>> = {};
    for (const event of events) {
      if (event.lane === "in" || event.lane === "out" || event.lane === "persist") {
        lookup[event.lane] = event;
      }
    }
    return lookup;
  }, [events]);

  /** Collect all failures from events + summary for lane categorization */
  const allFindings = useMemo(() => {
    const fromSummary = summary?.failures ?? [];
    // Also check scan events for inline failures
    const fromEvents: DemoFailure[] = [];
    for (const event of events) {
      if (Array.isArray(event.data?.failures)) {
        for (const f of event.data.failures) {
          fromEvents.push(f);
        }
      }
    }
    // Merge, dedupe by title
    const seen = new Set<string>();
    const merged: DemoFailure[] = [];
    for (const f of [...fromSummary, ...fromEvents]) {
      const key = f.title.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(f);
      }
    }
    return merged;
  }, [summary, events]);

  const laneFindings = useMemo(() => categorizeFindingsByLane(allFindings), [allFindings]);

  const latestEvent = events.length > 0 ? events[events.length - 1] : null;
  const isDone = status === "done";
  const totalFindings = allFindings.length;
  const hasCriticalFindings = allFindings.some((f) => severityRank(f.severity) >= 4);

  async function startRun() {
    if (streamRef.current) {
      streamRef.current.close();
    }
    if (!repoUrl.trim()) {
      setError("Please enter a public GitHub repo URL.");
      return;
    }

    track("demo_start_clicked", {
      scenario: "live_public_repo",
      repo_url: repoUrl,
      source: "custom_repo",
      scan_depth: scanDepth,
    });

    setStatus("running");
    setError(null);
    setEvents([]);
    setSummary(null);
    setShowEvidence(false);
    setStage("idle");
    setStartedAt(Date.now());
    setElapsedMs(0);

    try {
      const response = await fetch("/api/demo/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, scanDepth }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Unable to start run");
      }

      const data = (await response.json()) as DemoStartResponse;
      setMode(data.mode);
      setScanDepth(data.scanDepth);
      setVerification(data.verification);
      setError(null);

      track("demo_started", {
        scenario: "live_public_repo",
        mode: data.mode,
        scan_depth: data.scanDepth,
        verification: data.verification,
        repo_owner: data.repo?.owner ?? "",
        repo_name: data.repo?.name ?? "",
        source: "custom_repo",
      });

      const source = new EventSource(data.streamUrl);
      streamRef.current = source;

      source.addEventListener("progress", (rawEvent) => {
        const payload = JSON.parse((rawEvent as MessageEvent).data) as DemoEvent;
        setEvents((prev) => [...prev, payload]);
        setStage(payload.stage);
        setMode(payload.mode);
        setError(null);
      });

      source.addEventListener("done", (rawEvent) => {
        const payload = JSON.parse((rawEvent as MessageEvent).data) as DemoRunSummary;
        setSummary(payload);
        setStage("pass");
        setStatus("done");
        setError(null);
        track("demo_completed", {
          scenario: "live_public_repo",
          mode: payload.mode,
          scan_depth: scanDepth,
          before_score: payload.beforeScore ?? -1,
          findings: payload.blockedCount ?? -1,
          cached: payload.cached ?? false,
          duration_ms: payload.durationMs,
        });
        source.close();
      });

      source.onerror = async () => {
        try {
          const resultResponse = await fetch(data.resultUrl, { cache: "no-store" });
          if (resultResponse.ok) {
            const result = await resultResponse.json() as {
              status?: "running" | "done" | "failed";
              summary?: DemoRunSummary;
              mode?: DemoMode;
              scanDepth?: DemoScanDepth;
            };

            if (result.mode) {
              setMode(result.mode);
            }

            if (result.scanDepth) {
              setScanDepth(result.scanDepth);
            }

            if (result.status === "done" && result.summary) {
              setSummary(result.summary);
              setStage("pass");
              setStatus("done");
              setError(null);
              source.close();
              return;
            }

            if (result.status === "failed") {
              setStatus("error");
              setError(result.summary?.notes || "Live run failed.");
              source.close();
              track("demo_stream_error", {
                scenario: "live_public_repo",
                stage,
                status: "failed",
              });
              return;
            }
          }
        } catch {
          // Ignore transient read failures and let EventSource retry.
        }

        if (source.readyState === EventSource.CLOSED) {
          setStatus("error");
          setError("Live stream disconnected. Retry to continue.");
          track("demo_stream_error", {
            scenario: "live_public_repo",
            stage,
            status: "closed",
          });
          return;
        }

        setError("Reconnecting live stream...");
      };
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
      track("demo_start_error", {
        scenario: "live_public_repo",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  function reset() {
    if (streamRef.current) {
      streamRef.current.close();
    }
    setStatus("idle");
    setStage("idle");
    setMode(null);
    setVerification(null);
    setEvents([]);
    setSummary(null);
    setShowEvidence(false);
    setError(null);
    setStartedAt(null);
    setElapsedMs(0);
  }

  async function toggleAdFullscreen() {
    const frame = adFrameRef.current;
    if (!frame) return;

    if (document.fullscreenElement === frame) {
      await document.exitFullscreen();
      return;
    }

    await frame.requestFullscreen();
  }

  // Headline for the showcase result board
  const showcaseHeadline = (() => {
    if (!isDone) {
      return latestEvent ? stageLabel(latestEvent.stage) : "Live Scan Ready";
    }
    if (totalFindings === 0) return "All Clear";
    if (hasCriticalFindings) return `${totalFindings} Issue${totalFindings > 1 ? "s" : ""} Intercepted`;
    return `${totalFindings} Finding${totalFindings > 1 ? "s" : ""} Caught`;
  })();

  const showcaseMessage = (() => {
    if (!isDone) {
      return latestEvent
        ? clipText(latestEvent.message, 260)
        : "Run a public repo scan to see live detection, interception, and recovery.";
    }
    if (totalFindings === 0) {
      return "Rigour scanned the entire codebase and found no issues. All quality gates passed.";
    }
    const critCount = allFindings.filter((f) => f.severity === "critical").length;
    const highCount = allFindings.filter((f) => f.severity === "high").length;
    const parts: string[] = [];
    if (critCount > 0) parts.push(`${critCount} critical`);
    if (highCount > 0) parts.push(`${highCount} high`);
    const securityCount = laneFindings.in.length;
    const aiDriftCount = laneFindings.out.length;
    const govCount = laneFindings.persist.length;
    const detail: string[] = [];
    if (securityCount > 0) detail.push(`${securityCount} security`);
    if (aiDriftCount > 0) detail.push(`${aiDriftCount} quality/AI-drift`);
    if (govCount > 0) detail.push(`${govCount} governance`);
    return `Rigour intercepted ${totalFindings} finding${totalFindings > 1 ? "s" : ""}${parts.length ? ` (${parts.join(", ")})` : ""} across ${detail.join(", ")} gates before production.`;
  })();

  return (
    <section className="pt-32 pb-16">
      {/* ── Ad — full-width bleed ── */}
      <div
        ref={adFrameRef}
        className={
          isAdFullscreen
            ? "fixed inset-0 z-[120] m-0 h-screen w-screen isolate bg-black"
            : "relative left-1/2 right-1/2 mb-10 w-screen -translate-x-1/2 isolate"
        }
      >
        <iframe
          src="/rigovo-ad.html?v=20260314a&tv=1"
          title="Rigovo product ad"
          allowFullScreen
          className={isAdFullscreen ? "relative z-0 block h-full w-full border-0" : "relative z-0 block aspect-video w-full border-0"}
        />
      </div>
      <button
        type="button"
        onClick={toggleAdFullscreen}
        className="fixed right-5 top-24 z-[140] inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-950/85 text-zinc-100 shadow-lg backdrop-blur transition hover:border-zinc-500 hover:bg-zinc-900/90"
        aria-label={isAdFullscreen ? "Exit ad fullscreen" : "Enter ad fullscreen"}
        title={isAdFullscreen ? "Exit fullscreen" : "Fullscreen"}
      >
        {isAdFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>

      {/* ── Rigovo Ecosystem — full-width bleed ── */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-16 mb-10">
        <div className="mx-auto max-w-[90rem] px-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-outfit mb-2">Rigovo Ecosystem</h2>
            <p className="text-zinc-400 text-sm">Lead with Rigour, then immediately open the broader Rigovo platform through premium media moments.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Rigovo Virtual Team */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="group rounded-[1.9rem] border border-violet-500/20 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.16),_rgba(9,9,11,0.95)_60%)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-violet-300">Advanced Application</p>
                  <h3 className="mt-1 text-2xl font-bold font-outfit text-zinc-100">Rigovo Virtual Team</h3>
                </div>
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                  powered by Rigour
                </span>
              </div>
              <div className="relative overflow-hidden rounded-[1.5rem] border border-violet-500/20 bg-black aspect-video">
                <iframe
                  key={`yt-team-${videosMuted}`}
                  src={`https://www.youtube-nocookie.com/embed/1ZdIDG2gKao?rel=0&modestbranding=1&iv_load_policy=3&autoplay=1&mute=${videosMuted ? 1 : 0}&loop=1&playlist=1ZdIDG2gKao&controls=0&showinfo=0`}
                  title="Rigovo Virtual Team demo"
                  className="h-full w-full scale-[1.01] transition-transform duration-500 group-hover:scale-[1.04]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                Multi-agent software delivery under one governed loop: planning, coding, review, QA, and DevOps.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="https://youtu.be/1ZdIDG2gKao"
                  target="_blank"
                  onClick={() => track("demo_video_click", { video: "rigovo_virtual_team", location: "ecosystem_featured" })}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
                >
                  Watch full demo <Play className="h-4 w-4" />
                </Link>
                <Link
                  href="https://github.com/rigovo/rigovo-virtual-team"
                  target="_blank"
                  onClick={() => track("demo_cross_product_click", { product: "rigovo_virtual_team", location: "ecosystem_featured" })}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
                >
                  Explore repo <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* Rigovo HR */}
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="group rounded-[1.9rem] border border-sky-500/20 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_rgba(9,9,11,0.95)_60%)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-[0.24em] text-sky-300">Separate Product</p>
                <h3 className="mt-1 text-2xl font-bold font-outfit text-zinc-100">Rigovo HR</h3>
                <p className="mt-2 text-sm text-zinc-300">
                  Maya-led AI hiring with evidence-focused interviews and a distinct product surface from Rigour.
                </p>
              </div>
              {/* Video container with watermark cover */}
              <div className="relative overflow-hidden rounded-[1.5rem] border border-sky-500/20 bg-black aspect-video">
                <video
                  ref={hrVideoRef}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  src="https://onbadqcmbugvszb0.public.blob.vercel-storage.com/maya-speaking.mp4"
                  autoPlay
                  muted={videosMuted}
                  loop
                  playsInline
                />
                {/* Subtle bottom-edge blend (intentionally does NOT hide HeyGen branding) */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-16 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="https://rigovo.com"
                  target="_blank"
                  onClick={() => track("demo_cross_product_click", { product: "rigovo_hr", location: "ecosystem_featured" })}
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200 transition-colors hover:bg-sky-400/20"
                >
                  Visit Rigovo HR <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setVideosMuted((m) => {
                      const next = !m;
                      if (hrVideoRef.current) hrVideoRef.current.muted = next;
                      return next;
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200 transition-colors hover:bg-sky-400/20"
                >
                  {videosMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  {videosMuted ? "Unmute" : "Mute"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Live Scan + Showcase — full-width, last section ── */}
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mt-10">
        <div className="mx-auto max-w-[90rem] px-6">

      <div className="bento-card mb-6">
        <div className="mb-5">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-3">Run a live public repo scan</h2>
            <p className="text-zinc-400 max-w-2xl">
              No scripted incidents. Enter any public GitHub repository and run Rigour live.
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto]">
          <input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            aria-label="GitHub repository URL"
            placeholder="https://github.com/owner/repo"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-accent"
          />
          <select
            value={scanDepth}
            onChange={(e) => setScanDepth(e.target.value as DemoScanDepth)}
            aria-label="Scan depth"
            className="rounded-xl border border-zinc-700 bg-zinc-900/70 px-3 py-3 text-sm text-zinc-100 outline-none focus:border-accent"
          >
            <option value="fast">Fast</option>
            <option value="deep">Deep</option>
            <option value="deep_pro">Deep Pro</option>
          </select>
          <button
            type="button"
            onClick={startRun}
            disabled={status === "running" || repoUrl.trim().length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-bright disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            Run Live Scan
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 px-5 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded bg-zinc-800">
          <motion.div
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.25 }}
            className="h-full rounded bg-gradient-to-r from-emerald-500 via-amber-400 to-accent"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
          <span>Stage: {stage.toUpperCase()} · Depth: {depthLabel(scanDepth).toUpperCase()}</span>
          <span>{Math.round(elapsedMs / 1000)}s elapsed</span>
        </div>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </div>

      {/* ── Rigour Showcase ── */}
      <div className="space-y-6">
        <div className="bento-card overflow-hidden">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <TerminalSquare className="h-4 w-4 text-accent" />
              Rigour Showcase
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="rounded-full border border-zinc-700 px-2.5 py-1 uppercase tracking-[0.2em]">
                {depthLabel(scanDepth)}
              </span>
              <span className="rounded-full border border-zinc-700 px-2.5 py-1 uppercase tracking-[0.2em]">
                {isDone ? (totalFindings > 0 ? `${totalFindings} caught` : "clean") : latestEvent ? stageLabel(latestEvent.stage) : "Ready"}
              </span>
              {isDone && totalFindings > 0 && (
                <span className={`rounded-full border px-2.5 py-1 uppercase tracking-[0.2em] ${hasCriticalFindings ? "border-red-500/30 bg-red-500/10 text-red-300" : "border-amber-500/30 bg-amber-500/10 text-amber-300"}`}>
                  {hasCriticalFindings ? "critical" : "warning"}
                </span>
              )}
              {isDone && totalFindings === 0 && (
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 uppercase tracking-[0.2em] text-emerald-300">
                  pass
                </span>
              )}
              {!isDone && latestEvent?.severity && (
                <span className={`rounded-full border px-2.5 py-1 uppercase tracking-[0.2em] ${stageTone(latestEvent.stage)}`}>
                  {latestEvent.severity}
                </span>
              )}
            </div>
          </div>

          <div className={`rounded-[1.5rem] border p-6 transition-all duration-500 ${
            isDone
              ? totalFindings > 0
                ? hasCriticalFindings
                  ? "border-red-500/30 bg-red-500/10 text-red-200"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-200"
                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : stageTone(latestEvent?.stage ?? "idle")
          } shadow-2xl`}>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Left: Result Board */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">Result Board</p>
                <h3 className="mt-3 text-4xl font-bold font-outfit">
                  {showcaseHeadline}
                </h3>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-current/90">
                  {showcaseMessage}
                </p>

                {/* Score + key stats when done */}
                {isDone && summary && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-5 flex flex-wrap gap-3"
                  >
                    {summary.beforeScore !== null && summary.beforeScore !== undefined && (
                      <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
                        summary.beforeScore >= 80 ? "border-emerald-500/30 bg-emerald-500/10" :
                        summary.beforeScore >= 60 ? "border-amber-500/30 bg-amber-500/10" :
                        "border-red-500/30 bg-red-500/10"
                      }`}>
                        <span className="opacity-70">Score</span>
                        <span className="text-xl font-bold font-outfit">{summary.beforeScore}<span className="text-xs opacity-60">/100</span></span>
                      </div>
                    )}
                    {summary.gatesPassed != null && summary.gatesFailed != null && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-current/20 px-4 py-2 text-sm">
                        <span className="opacity-70">Gates</span>
                        <span className="font-semibold">{summary.gatesPassed} passed, {summary.gatesFailed} failed</span>
                      </div>
                    )}
                    {summary.firstScanMs && (
                      <div className="inline-flex items-center gap-2 rounded-full border border-current/20 px-4 py-2 text-sm">
                        <span className="opacity-70">Time</span>
                        <span className="font-semibold">{formatMs(summary.firstScanMs)}</span>
                      </div>
                    )}
                    <div className="inline-flex items-center gap-2 rounded-full border border-current/20 px-4 py-2 text-sm">
                      <span className="opacity-70">Depth</span>
                      <span className="font-semibold">{depthLabel(scanDepth)}</span>
                    </div>
                  </motion.div>
                )}

                {/* Idle/running pills */}
                {!isDone && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {latestEvent?.metric ? (
                      <div className="inline-flex items-center gap-2 rounded-full border border-current/20 px-4 py-2 text-sm">
                        <span className="opacity-70">{latestEvent.metric.label}</span>
                        <span className="font-semibold">{String(latestEvent.metric.value)}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-full border border-current/20 px-4 py-2 text-sm">
                        <span className="opacity-70">Source</span>
                        <span className="font-semibold">Live Public Repo</span>
                      </div>
                    )}
                    <div className="inline-flex items-center gap-2 rounded-full border border-current/20 px-4 py-2 text-sm">
                      <span className="opacity-70">Outcome</span>
                      <span className="font-semibold">Live governance proof</span>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-current/20 px-4 py-2 text-sm">
                      <span className="opacity-70">Depth</span>
                      <span className="font-semibold">{depthLabel(scanDepth)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Control Points with categorized findings */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-current/15 bg-black/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.24em] text-current/60">Control Points</p>
                    {isDone && totalFindings > 0 && (
                      <p className="text-[10px] uppercase tracking-[0.2em] text-current/50">
                        {laneFindings.in.length + laneFindings.out.length + laneFindings.persist.length} across 3 lanes
                      </p>
                    )}
                  </div>
                  <div className="mt-3 space-y-3">
                    {LANES.map((laneDef) => (
                      <LaneFindingCard
                        key={laneDef.lane}
                        laneDef={laneDef}
                        event={laneEvents[laneDef.lane]}
                        findings={laneFindings[laneDef.lane]}
                        isDone={isDone}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence panel — auto-expands on completion */}
          <AnimatePresence>
            {status === "done" && summary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-5"
              >
                <button
                  type="button"
                  onClick={() => setShowEvidence((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
                >
                  {showEvidence ? "Hide Detailed Evidence" : "Show Detailed Evidence"}
                </button>
                <AnimatePresence>
                  {showEvidence && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 rounded-[1.5rem] border border-zinc-700 bg-zinc-950/60 p-5"
                    >
                      <ResultsPanel summary={summary} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
        </div>
      </div>

    </section>
  );
}
