"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ExternalLink,
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
} from "lucide-react";
import Link from "next/link";
import { track } from "@vercel/analytics";
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

const SCENARIOS = [
  {
    id: "breach_stop",
    label: "Incident 01",
    title: "Credential breach stopped before merge",
    accent: "emerald",
    description: "An AI hotfix tries to ship a real secret, a fake dependency, and a silent async failure in one change.",
    proof: "Best for the first 15-second wow moment",
  },
  {
    id: "hallucination_stop",
    label: "Incident 02",
    title: "Hallucinated dependency blocked",
    accent: "violet",
    description: "An AI patch introduces a fake package and a phantom API call that would pass review but fail in production.",
    proof: "Best for showing deterministic code supervision",
  },
  {
    id: "memory_guard",
    label: "Incident 03",
    title: "Unsafe memory persistence denied",
    accent: "sky",
    description: "An agent attempts to persist secrets and poisoned context into long-term memory, and governance stops it.",
    proof: "Best for proving Rigour is more than a scanner",
  },
] as const;

function toneClass(tone: string): string {
  switch (tone) {
    case "emerald":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "violet":
      return "border-violet-500/30 bg-violet-500/10 text-violet-300";
    case "sky":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    default:
      return "border-zinc-700 bg-zinc-800 text-zinc-300";
  }
}

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

function scenarioOutcomeCopy(id: (typeof SCENARIOS)[number]["id"]): string {
  switch (id) {
    case "breach_stop":
      return "Rigour proves that the secret is blocked, the fake dependency never lands, and the unsafe patch is recovered before merge.";
    case "hallucination_stop":
      return "Rigour shows deterministic control over hallucinated packages, phantom APIs, and broken generated logic before runtime.";
    case "memory_guard":
      return "Rigour shows that AI safety continues after generation by controlling what agents are allowed to remember and replay.";
    default:
      return "Rigour detects, intercepts, governs, and recovers as one controlled story.";
  }
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
  const [selectedScenario, setSelectedScenario] = useState<(typeof SCENARIOS)[number]>(SCENARIOS[0]);
  const [repoUrl, setRepoUrl] = useState("");
  const [useCustomRepo, setUseCustomRepo] = useState(false);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [stage, setStage] = useState<DemoStage>("idle");
  const [, setMode] = useState<DemoMode | null>(null);
  const [, setVerification] = useState<"verified_public" | "unverified" | null>(null);
  const [events, setEvents] = useState<DemoEvent[]>([]);
  const [summary, setSummary] = useState<DemoRunSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isAdFullscreen, setIsAdFullscreen] = useState(false);
  const streamRef = useRef<EventSource | null>(null);
  const adFrameRef = useRef<HTMLDivElement | null>(null);

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

  const latestEvent = events.length > 0 ? events[events.length - 1] : null;
  const stageTimeline = STAGES.filter((item) => item !== "idle").map((item) => {
    const event = [...events].reverse().find((entry) => entry.stage === item) ?? null;
    return { stage: item, event };
  });

  async function startRun() {
    if (streamRef.current) {
      streamRef.current.close();
    }

    track("demo_start_clicked", {
      scenario: selectedScenario.id,
      repo_url: useCustomRepo ? repoUrl : "",
      source: useCustomRepo ? "custom_repo" : "guided_scenario",
    });

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
        body: JSON.stringify(
          useCustomRepo
            ? { repoUrl }
            : { scenarioId: selectedScenario.id }
        ),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error ?? "Unable to start run");
      }

      const data = (await response.json()) as DemoStartResponse;
      setMode(data.mode);
      setVerification(data.verification);
      setError(null);

      track("demo_started", {
        scenario: selectedScenario.id,
        mode: data.mode,
        verification: data.verification,
        repo_owner: data.repo?.owner ?? "",
        repo_name: data.repo?.name ?? "",
        source: useCustomRepo ? "custom_repo" : "guided_scenario",
      });

      if (useCustomRepo) {
        setUseCustomRepo(false);
      }

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
          scenario: selectedScenario.id,
          mode: payload.mode,
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
            };

            if (result.mode) {
              setMode(result.mode);
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
                scenario: selectedScenario.id,
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
            scenario: selectedScenario.id,
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
        scenario: selectedScenario.id,
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

  return (
    <section className="pt-32 pb-16">
      <div
        ref={adFrameRef}
        className={
          isAdFullscreen
            ? "fixed inset-0 z-[120] m-0 h-screen w-screen isolate bg-black"
            : "relative left-1/2 right-1/2 mb-10 w-screen -translate-x-1/2 isolate"
        }
      >
        <iframe
          src="/rigovo-ad.html?v=20260313e&tv=1"
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

      <div className="mx-auto max-w-6xl px-6">
      <div className="flex flex-col">
      <div className="order-2">
      <div className="bento-card mb-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-3">Choose the Rigour failure to stop</h2>
            <p className="text-zinc-400 max-w-2xl">
              Start with a guided Rigour scenario. It is instant, dramatic, and keeps the focus on what Rigour itself prevents before code ships. If you need proof afterward, trigger a live public-repo scan separately.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Primary narrative</p>
            <p className="mt-1 text-sm font-semibold text-zinc-100">{selectedScenario.title}</p>
            <p className="mt-1 text-xs text-zinc-500">{selectedScenario.proof}</p>
          </div>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          {SCENARIOS.map((scenario) => {
            const active = scenario.id === selectedScenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => {
                  setSelectedScenario(scenario);
                  track("demo_scenario_selected", { scenario: scenario.id });
                }}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-accent bg-accent/10 shadow-lg shadow-accent/10"
                    : "border-zinc-800 bg-zinc-950/60 hover:border-zinc-600"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${toneClass(scenario.accent)}`}>
                    {scenario.label}
                  </span>
                  {active && <BadgeCheck className="h-4 w-4 text-accent" />}
                </div>
                <p className="text-base font-semibold text-zinc-100">{scenario.title}</p>
                <p className="mt-2 text-sm text-zinc-400">{scenario.description}</p>
                <p className="mt-3 text-[11px] text-zinc-500">{scenario.proof}</p>
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <button
            type="button"
            onClick={startRun}
            disabled={status === "running"}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-bright disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            Play
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

        <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-zinc-200">Run your public repo</p>
              <p className="text-xs text-zinc-500">Use this for real proof. The scan and results will appear below on the same page.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !useCustomRepo;
                setUseCustomRepo(next);
                track("demo_custom_repo_toggle", { enabled: next });
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/5"
            >
              <ExternalLink className="h-4 w-4" />
              {useCustomRepo ? "Hide Public Repo Input" : "Show Public Repo Input"}
            </button>
          </div>
          {useCustomRepo && (
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                aria-label="GitHub repository URL"
                placeholder="https://github.com/owner/repo"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={startRun}
                disabled={status === "running" || repoUrl.trim().length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                Run Public Repo
              </button>
            </div>
          )}
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

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-red-300">Without Rigour</p>
          <p className="mt-2 text-sm text-zinc-200">Secret reaches repo, hallucinated import ships, and agent memory keeps the bad state alive.</p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-amber-300">During Supervision</p>
          <p className="mt-2 text-sm text-zinc-200">IN stops ingress, OUT blocks unsafe code, PERSIST denies unsafe memory writes.</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">With Rigour</p>
          <p className="mt-2 text-sm text-zinc-200">Failure is contained, fix packet is generated, and the team gets measurable recovery instead of hope.</p>
        </div>
      </div>

      {/* ── Results Panel (aha moment) — shown when scan is done ── */}
      <AnimatePresence>
        {status === "done" && summary && (
          <div className="mb-6">
            <ResultsPanel summary={summary} />
          </div>
        )}
      </AnimatePresence>

      </div>

      <div className="order-1 mt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-outfit mb-2">Rigovo Ecosystem</h2>
            <p className="text-zinc-400 text-sm">Lead with Rigour, then immediately open the broader Rigovo platform through premium media moments.</p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
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
              <div className="absolute inset-0 z-10 bg-black/5 transition-opacity group-hover:opacity-0" />
              <iframe
                src="https://www.youtube-nocookie.com/embed/1ZdIDG2gKao?rel=0&modestbranding=1&iv_load_policy=3"
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
                Watch demo <Play className="h-4 w-4" />
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
            <div className="relative overflow-hidden rounded-[1.5rem] border border-sky-500/20 bg-black aspect-video">
              <div className="absolute inset-0 z-10 bg-black/5 transition-opacity group-hover:opacity-0" />
              <video
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                src="https://onbadqcmbugvszb0.public.blob.vercel-storage.com/maya-speaking.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
              />
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
            </div>
          </motion.div>
        </div>
      </div>

      <div className="order-3 space-y-6">
        <div className="bento-card overflow-hidden">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <TerminalSquare className="h-4 w-4 text-accent" />
              Rigour Showcase
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="rounded-full border border-zinc-700 px-2.5 py-1 uppercase tracking-[0.2em]">
                {latestEvent ? stageLabel(latestEvent.stage) : "Ready"}
              </span>
              {latestEvent?.severity && (
                <span className={`rounded-full border px-2.5 py-1 uppercase tracking-[0.2em] ${stageTone(latestEvent.stage)}`}>
                  {latestEvent.severity}
                </span>
              )}
            </div>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-5">
            {stageTimeline.map(({ stage: item }) => {
              const reached = getStageIndex(stage) >= getStageIndex(item);
              const active = stage === item;
              return (
                <div
                  key={item}
                  className={`rounded-2xl border px-4 py-3 transition-all ${
                    active
                      ? stageTone(item)
                      : reached
                        ? "border-emerald-500/20 bg-emerald-500/5 text-zinc-100"
                        : "border-zinc-800 bg-zinc-950/60 text-zinc-500"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-[0.24em]">{stageLabel(item)}</p>
                  <p className="mt-2 text-sm">{active ? "Live now" : reached ? "Complete" : "Queued"}</p>
                </div>
              );
            })}
          </div>

          <div className={`rounded-[1.5rem] border p-6 ${stageTone(latestEvent?.stage ?? "idle")} shadow-2xl`}>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-70">Active Moment</p>
              <h3 className="mt-3 text-4xl font-bold font-outfit">
                {latestEvent ? stageLabel(latestEvent.stage) : selectedScenario.title}
              </h3>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-current/90">
                {latestEvent ? latestEvent.message : scenarioOutcomeCopy(selectedScenario.id)}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {latestEvent?.metric ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-current/20 px-4 py-2 text-sm">
                    <span className="opacity-70">{latestEvent.metric.label}</span>
                    <span className="font-semibold">{String(latestEvent.metric.value)}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full border border-current/20 px-4 py-2 text-sm">
                    <span className="opacity-70">Scenario</span>
                    <span className="font-semibold">{selectedScenario.label}</span>
                  </div>
                )}
                <div className="inline-flex items-center gap-2 rounded-full border border-current/20 px-4 py-2 text-sm">
                  <span className="opacity-70">Outcome</span>
                  <span className="font-semibold">{summary?.beforeScore ?? "Live governance proof"}</span>
                </div>
              </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-current/15 bg-black/10 p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-current/60">Control Points</p>
                  <div className="mt-3 space-y-3">
                  {LANES.map((lane) => {
                    const event = laneEvents[lane.lane];
                    return (
                      <div
                        key={lane.lane}
                        className={`rounded-xl border px-3 py-3 ${
                          event
                            ? event.severity === "error"
                              ? "border-red-500/30 bg-red-500/10"
                              : event.severity === "warning"
                                ? "border-amber-500/30 bg-amber-500/10"
                                : "border-emerald-500/30 bg-emerald-500/10"
                            : "border-zinc-800 bg-zinc-900/70"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-zinc-100">{lane.title}</p>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">{lane.subtitle}</p>
                          </div>
                          <span className={`h-2.5 w-2.5 rounded-full ${event ? "bg-current animate-pulse" : "bg-zinc-700"}`} />
                        </div>
                        <p className={`mt-3 text-sm leading-relaxed ${event ? severityClass(event.severity) : "text-zinc-500"}`}>
                          {event ? event.message : "Waiting for signal..."}
                        </p>
                      </div>
                    );
                  })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>

    </section>
  );
}
