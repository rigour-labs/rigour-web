"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Play,
  RotateCcw,
  Shield,
  TerminalSquare,
  Zap,
  XCircle,
  Activity,
  Timer,
  BarChart3,
} from "lucide-react";
import type {
  DemoEvent,
  DemoMode,
  DemoRunSummary,
  DemoSeverity,
  DemoStage,
  DemoStartResponse,
} from "@/lib/demo/types";

const STAGES: DemoStage[] = ["idle", "preflight", "clone", "scan", "supervise", "fix", "rescan", "pass"];

type RunStatus = "idle" | "running" | "done" | "error";

interface LaneState {
  lane: "in" | "out" | "persist";
  title: string;
  subtitle: string;
}

const LANES: LaneState[] = [
  { lane: "in", title: "IN", subtitle: "DLP Pre-Hook" },
  { lane: "out", title: "OUT", subtitle: "Quality Gates" },
  { lane: "persist", title: "PERSIST", subtitle: "Memory Governance" },
];

function severityClass(severity?: DemoSeverity): string {
  switch (severity) {
    case "error":
      return "text-red-300";
    case "warning":
      return "text-amber-300";
    case "success":
      return "text-emerald-300";
    default:
      return "text-zinc-300";
  }
}

function modeClass(mode: DemoMode | null): string {
  switch (mode) {
    case "live":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/40";
    case "quick_scope":
      return "bg-amber-500/15 text-amber-300 border-amber-500/40";
    case "fallback":
      return "bg-zinc-500/15 text-zinc-300 border-zinc-500/40";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-700";
  }
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

function getStageIndex(stage: DemoStage): number {
  return STAGES.indexOf(stage);
}

function formatMs(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
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
                {Object.entries(summary.provenanceBreakdown).map(([key, count]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">{key.replace(/_/g, " ")}</span>
                    <span className="text-xs font-mono text-zinc-300">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top failures */}
      {summary.failures && summary.failures.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
          <p className="text-xs font-semibold text-zinc-300 mb-2">Top Findings ({Math.min(summary.failures.length, 8)} of {findings})</p>
          <div className="space-y-1.5 max-h-[200px] overflow-auto">
            {summary.failures.slice(0, 8).map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className={`mt-0.5 flex-shrink-0 rounded px-1 py-0.5 text-[10px] font-semibold uppercase ${
                  f.severity === "critical" || f.severity === "high" ? "bg-red-500/20 text-red-300" :
                  f.severity === "medium" ? "bg-amber-500/20 text-amber-300" :
                  "bg-zinc-700 text-zinc-400"
                }`}>
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

/* ── Main Component ── */
export function DemoExperience() {
  const [repoUrl, setRepoUrl] = useState("");
  const [status, setStatus] = useState<RunStatus>("idle");
  const [stage, setStage] = useState<DemoStage>("idle");
  const [mode, setMode] = useState<DemoMode | null>(null);
  const [verification, setVerification] = useState<"verified_public" | "unverified" | null>(null);
  const [events, setEvents] = useState<DemoEvent[]>([]);
  const [summary, setSummary] = useState<DemoRunSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const streamRef = useRef<EventSource | null>(null);

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

  async function startRun() {
    if (streamRef.current) {
      streamRef.current.close();
    }

    setStatus("running");
    setError(null);
    setEvents([]);
    setSummary(null);
    setStage("idle");
    setStartedAt(Date.now());
    setElapsedMs(0);

    try {
      const response = await fetch("/api/demo/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Unable to start run");
      }

      const data = (await response.json()) as DemoStartResponse;
      setMode(data.mode);
      setVerification(data.verification);

      const source = new EventSource(data.streamUrl);
      streamRef.current = source;

      source.addEventListener("progress", (rawEvent) => {
        const payload = JSON.parse((rawEvent as MessageEvent).data) as DemoEvent;
        setEvents((prev) => [...prev, payload]);
        setStage(payload.stage);
        setMode(payload.mode);
      });

      source.addEventListener("done", (rawEvent) => {
        const payload = JSON.parse((rawEvent as MessageEvent).data) as DemoRunSummary;
        setSummary(payload);
        setStage("pass");
        setStatus("done");
        source.close();
      });

      source.onerror = () => {
        source.close();
        setStatus("error");
        setError("Live stream disconnected. Retry to continue.");
      };
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
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
    setError(null);
    setStartedAt(null);
    setElapsedMs(0);
  }

  return (
    <section className="max-w-6xl mx-auto px-6 pt-32 pb-16">
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${modeClass(mode)}`}>
          MODE: {mode ? mode.toUpperCase().replace("_", " ") : "READY"}
        </span>
        {verification && (
          <span className="inline-flex items-center rounded-full border border-zinc-700 px-3 py-1 text-xs font-semibold tracking-wide text-zinc-300">
            {verification === "verified_public" ? "PUBLIC VERIFIED" : "UNVERIFIED (SAFE FALLBACK)"}
          </span>
        )}
      </div>

      <div className="bento-card mb-6">
        <h1 className="text-3xl md:text-4xl font-bold font-outfit mb-3">Rigour Live Scan</h1>
        <p className="text-zinc-400 mb-5">
          Paste any public GitHub repo — 27+ quality gates run in real time.
        </p>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            aria-label="GitHub repository URL"
            placeholder="https://github.com/owner/repo"
            className="rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-sm outline-none focus:border-accent"
          />
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
        {/* Progress bar — no hardcoded time limit */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded bg-zinc-800">
          <motion.div
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.25 }}
            className="h-full rounded bg-gradient-to-r from-emerald-500 via-amber-400 to-accent"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
          <span>Stage: {stage.toUpperCase()}</span>
          <span>{Math.round(elapsedMs / 1000)}s elapsed</span>
        </div>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </div>

      {/* ── Results Panel (aha moment) — shown when scan is done ── */}
      <AnimatePresence>
        {status === "done" && summary && (
          <div className="mb-6">
            <ResultsPanel summary={summary} />
          </div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="bento-card">
            <div className="mb-4 flex items-center gap-2 text-sm text-zinc-300">
              <TerminalSquare className="h-4 w-4 text-accent" />
              Live Event Stream
            </div>
            <div className="max-h-[340px] space-y-2 overflow-auto rounded-xl border border-zinc-800 bg-black/40 p-3 font-mono text-xs">
              {events.length === 0 && (
                <p className="text-zinc-500">No events yet. Start a run to stream supervision signals.</p>
              )}
              {events.map((event, idx) => (
                <div key={`${event.ts}-${idx}`} className="rounded border border-zinc-800 bg-zinc-950/80 px-3 py-2">
                  <div className="mb-1 flex items-center justify-between text-[10px] text-zinc-500">
                    <span>{new Date(event.ts).toLocaleTimeString()}</span>
                    <span>{event.stage.toUpperCase()}</span>
                  </div>
                  <p className={severityClass(event.severity)}>{event.message}</p>
                  {event.metric && (
                    <p className="mt-1 text-[10px] text-zinc-500">
                      {event.metric.label}: {String(event.metric.value)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bento-card">
            <h2 className="mb-4 text-lg font-semibold">Supervisor Lanes</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {LANES.map((lane) => {
                const event = laneEvents[lane.lane];
                return (
                  <div key={lane.lane} className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-3">
                    <p className="text-xs font-semibold tracking-wide text-zinc-300">{lane.title}</p>
                    <p className="mb-2 text-[10px] uppercase tracking-wide text-zinc-500">{lane.subtitle}</p>
                    {event ? (
                      <p className={`text-xs ${severityClass(event.severity)}`}>{event.message}</p>
                    ) : (
                      <p className="text-xs text-zinc-500">Waiting for signal...</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bento-card">
            <h2 className="mb-4 text-lg font-semibold">Presenter Script</h2>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex gap-2">
                <Shield className="mt-0.5 h-4 w-4 text-accent" />
                1. Paste any GitHub repo — Rigour clones and scans it live.
              </li>
              <li className="flex gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-300" />
                2. 27+ gates catch AI drift: hallucinated imports, leaked secrets, floating promises.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                3. Second scan shows incremental cache — unchanged files skip all gates instantly.
              </li>
            </ul>
          </div>

          <div className="bento-card">
            <p className="text-xs text-zinc-500">Real CLI proof (optional):</p>
            <pre className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950/80 p-3 text-xs text-zinc-300 overflow-x-auto">
{`npx @rigour-labs/cli scan\nnpx @rigour-labs/cli demo --cinematic --repo <github-url>`}
            </pre>
          </div>
        </div>
      </div>

      {/* ── Rigovo Ecosystem ── */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold font-outfit mb-2">Rigovo Ecosystem</h2>
        <p className="text-zinc-400 text-sm mb-6">AI-Native Engineering Platform — from hiring to shipping.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Rigour */}
          <a
            href="https://github.com/rigour-labs/rigour"
            target="_blank"
            rel="noopener noreferrer"
            className="bento-card group hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                Rigour
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-600 group-hover:text-emerald-300 transition-colors" />
            </div>
            <p className="text-sm font-semibold text-zinc-200 mb-1">Quality Gates for AI Code</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              27+ deterministic gates + local LLM deep analysis. Zero telemetry, runs offline.
            </p>
          </a>

          {/* Rigovo HR */}
          <a
            href="https://rigovo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bento-card group hover:border-blue-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-300">
                Rigovo HR
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-600 group-hover:text-blue-300 transition-colors" />
            </div>
            <p className="text-sm font-semibold text-zinc-200 mb-1">AI-Powered Technical Hiring</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Maya AI interviewer with 15-signal verification, job success prediction, and evidence-based reports.
            </p>
          </a>

          {/* Rigovo Virtual Team */}
          <a
            href="https://github.com/rigovo/rigovo-virtual-team"
            target="_blank"
            rel="noopener noreferrer"
            className="bento-card group hover:border-purple-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
                Rigovo Virtual Team
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-600 group-hover:text-purple-300 transition-colors" />
            </div>
            <p className="text-sm font-semibold text-zinc-200 mb-1">Multi-Agent Software Delivery</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Planning → Coding → Review → QA → Security → DevOps — with deterministic quality gates.
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
