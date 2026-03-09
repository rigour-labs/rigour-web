"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Play, RotateCcw, Shield, TerminalSquare } from "lucide-react";
import type {
  DemoEvent,
  DemoMode,
  DemoRunSummary,
  DemoSeverity,
  DemoStage,
  DemoStartResponse,
} from "@/lib/demo/types";

const STAGES: DemoStage[] = ["idle", "preflight", "clone", "scan", "supervise", "fix", "rescan", "pass"];
const TARGET_DURATION_MS = 30_000;

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

function getStageIndex(stage: DemoStage): number {
  return STAGES.indexOf(stage);
}

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
    const stageWeight = Math.max(getStageIndex(stage), 0) / (STAGES.length - 1);
    const timeWeight = Math.min(elapsedMs / TARGET_DURATION_MS, 1);
    return Math.round(Math.max(stageWeight, timeWeight) * 100);
  }, [elapsedMs, stage]);

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
        <h1 className="text-3xl md:text-4xl font-bold font-outfit mb-3">Rigour Live Supervision Demo</h1>
        <p className="text-zinc-400 mb-5">
          Show in 30 seconds: real repo scan, IN/OUT/PERSIST supervision, and agent correction to PASS.
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
        <div className="mt-4 h-2 w-full overflow-hidden rounded bg-zinc-800">
          <motion.div
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.25 }}
            className="h-full rounded bg-gradient-to-r from-emerald-500 via-amber-400 to-accent"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
          <span>Stage: {stage.toUpperCase()}</span>
          <span>{Math.min(Math.round(elapsedMs / 1000), 30)}s / 30s</span>
        </div>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </div>

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
            <h2 className="mb-4 text-lg font-semibold">Score Delta</h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
              <p className="text-xs text-zinc-500 mb-2">Quality Score</p>
              <p className="text-3xl font-bold font-outfit">
                {summary && summary.beforeScore !== null && summary.afterScore !== null
                  ? `${summary.beforeScore} -> ${summary.afterScore}`
                  : "Awaiting run"}
              </p>
              <p className="mt-3 text-xs text-zinc-400">
                Blocked: {summary?.blockedCount ?? "—"} | Fixed: {summary?.fixedCount ?? "—"}
              </p>
              {summary?.notes && (
                <p className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-200">
                  {summary.notes}
                </p>
              )}
            </div>
          </div>

          <div className="bento-card">
            <h2 className="mb-4 text-lg font-semibold">Presenter Script</h2>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li className="flex gap-2">
                <Shield className="mt-0.5 h-4 w-4 text-accent" />
                1. We scan any public repo and start supervising agent behavior immediately.
              </li>
              <li className="flex gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-300" />
                2. IN blocks secrets, OUT fails hallucinations, PERSIST controls memory writes.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                3. Rigour issues a fix packet, agent retries, and we end in PASS.
              </li>
            </ul>
          </div>

          <div className="bento-card">
            <p className="text-xs text-zinc-500">Real CLI proof (optional):</p>
            <pre className="mt-2 rounded-lg border border-zinc-800 bg-zinc-950/80 p-3 text-xs text-zinc-300 overflow-x-auto">
{`npx @rigour-labs/cli demo --cinematic\nnpx @rigour-labs/cli demo --cinematic --repo <github-url>`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
