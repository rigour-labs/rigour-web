"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Shield,
    AlertTriangle,
    FileCode,
    Bug,
    CheckCircle,
    XCircle,
    Terminal,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Clock,
    Layers,
    Search,
    Lock,
    GitBranch,
} from "lucide-react";
import Link from "next/link";
import { track } from "@vercel/analytics";

/* ───────── Static audit data (from rigour check output) ───────── */

const AUDIT = {
    score: 0,
    totalViolations: 2080,
    filesIndexed: 2094,
    patternsDetected: 14010,
    scanDuration: "3.9s",
    scanDate: "February 17, 2026",
    gatesFailed: 4,
    gatesTotal: 10,
    gates: [
        { name: "Environment Alignment", id: "environment-alignment", status: "PASS" },
        { name: "Retry Loop Breaker", id: "retry_loop_breaker", status: "PASS" },
        { name: "File Size", id: "file-size", status: "FAIL" },
        { name: "Content Check", id: "content-check", status: "FAIL" },
        { name: "Structure Check", id: "structure-check", status: "PASS" },
        { name: "AST Analysis", id: "ast-analysis", status: "FAIL" },
        { name: "Dependency Guardian", id: "dependency-guardian", status: "PASS" },
        { name: "Safety Rail", id: "safety-rail", status: "PASS" },
        { name: "Coverage Guard", id: "coverage-guard", status: "PASS" },
        { name: "Context Drift", id: "context-drift", status: "FAIL" },
    ],
    breakdown: {
        "File Size": { count: 520, desc: "Files exceeding 400 lines", severity: "high" },
        "AST Complexity": { count: 1819, desc: "Functions with cyclomatic complexity violations", severity: "critical" },
        "Context Drift": { count: 147, desc: "Import pattern & naming inconsistencies", severity: "medium" },
        "Abandoned TODOs": { count: 60, desc: "TODO/FIXME comments never resolved", severity: "medium" },
        "Max Params": { count: 27, desc: "Functions with too many parameters", severity: "medium" },
        "Max Methods": { count: 19, desc: "Classes with too many methods", severity: "medium" },
        "Security: Prototype Pollution": { count: 7, desc: "Object.assign patterns in sensitive areas", severity: "critical" },
    },
    worstFiles: [
        { file: "docs/gateway/configuration-reference.md", lines: 3333 },
        { file: "docs/help/faq.md", lines: 2860 },
        { file: "CHANGELOG.md", lines: 2198 },
        { file: "tests/security-audit.test.ts", lines: 2169 },
        { file: "tests/telegram-bot.test.ts", lines: 1899 },
        { file: "src/config/io.ts", lines: 1134 },
        { file: "src/heartbeat-runner.ts", lines: 1124 },
        { file: "docs/cli/index.md", lines: 1037 },
    ],
    securityVectors: [
        "extensions/memory-lancedb/index.ts — Object.assign on embeddings data",
        "src/cron/agent-runner.ts — Object.assign on scheduled task payloads",
        "src/agent/execution-pipeline.ts — Prototype pollution in tool results merge",
        "src/gateway/middleware.ts — Unvalidated object spread in request handler",
        "src/memory/manager.ts — Deep merge without prototype check",
        "extensions/voice-call/index.ts — Config merge from external source",
        "src/tools/browser.ts — Object spread on page extraction data",
    ],
};

/* ───────── Helper components ───────── */

function ScoreGauge({ score }: { score: number }) {
    const circumference = 2 * Math.PI * 58;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";

    return (
        <div className="relative w-36 h-36">
            <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                <circle cx="64" cy="64" r="58" fill="none" stroke="#27272a" strokeWidth="8" />
                <motion.circle
                    cx="64" cy="64" r="58" fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset: offset }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black font-outfit" style={{ color }}>{score}</span>
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">/100</span>
            </div>
        </div>
    );
}

function GatePill({ name, status }: { name: string; status: string }) {
    const pass = status === "PASS";
    return (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider ${pass
            ? "border-green-500/20 bg-green-500/5 text-green-400"
            : "border-red-500/20 bg-red-500/5 text-red-400"
            }`}>
            {pass ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {name}
        </div>
    );
}

function BreakdownBar({ label, count, total, severity, desc }: {
    label: string; count: number; total: number; severity: string; desc: string;
}) {
    const pct = Math.min((count / total) * 100, 100);
    const color = severity === "critical" ? "bg-red-500" : severity === "high" ? "bg-orange-500" : "bg-yellow-500";

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div>
                    <span className="text-sm font-bold text-zinc-200">{label}</span>
                    <span className="text-xs text-zinc-500 ml-2">{desc}</span>
                </div>
                <span className="text-sm font-mono font-bold text-zinc-300">{count.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}

/* ───────── Main component ───────── */

export function OpenClawAudit() {
    const [showAllFiles, setShowAllFiles] = useState(false);
    const [showSecurity, setShowSecurity] = useState(false);

    return (
        <article className="pt-32 pb-20 px-6 max-w-5xl mx-auto">

            {/* ── Breadcrumb ── */}
            <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                    <li>/</li>
                    <li><Link href="/audits/openclaw" className="hover:text-accent transition-colors">Audits</Link></li>
                    <li>/</li>
                    <li className="text-zinc-300">OpenClaw</li>
                </ol>
            </nav>

            {/* ── Header ── */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-wider uppercase mb-6">
                    <AlertTriangle className="w-3 h-3" />
                    Quality Audit Report
                </div>

                <h1 className="text-4xl md:text-6xl font-black font-outfit leading-[1.1] mb-6 tracking-tight">
                    OpenClaw: 180K Stars.<br />
                    <span className="text-red-400">2,080 Violations. Score: Zero.</span>
                </h1>

                <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl mb-6">
                    We pointed Rigour at the most popular AI agent on GitHub — built by running
                    4-10 AI agents simultaneously, racking up 6,600 commits in a single month.
                    The scan took 3.9 seconds.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {AUDIT.scanDate}</span>
                    <span className="text-zinc-700">|</span>
                    <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {AUDIT.filesIndexed.toLocaleString()} Files Scanned</span>
                    <span className="text-zinc-700">|</span>
                    <span className="flex items-center gap-1.5"><Search className="w-3.5 h-3.5" /> {AUDIT.patternsDetected.toLocaleString()} Patterns</span>
                    <span className="text-zinc-700">|</span>
                    <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> {AUDIT.scanDuration}</span>
                </div>
            </motion.header>

            {/* ── Score Dashboard ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bento-card bg-black border-zinc-800 p-8 md:p-12 mb-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                    {/* Score gauge */}
                    <div className="flex flex-col items-center gap-4">
                        <ScoreGauge score={AUDIT.score} />
                        <div className="text-center">
                            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Rigour Score</div>
                            <div className="text-red-400 text-sm font-bold mt-1">FAIL</div>
                        </div>
                    </div>

                    {/* Key stats */}
                    <div className="grid grid-cols-2 gap-6 col-span-2">
                        {[
                            { label: "Total Violations", value: "2,080", color: "text-red-400" },
                            { label: "Gates Failed", value: "4 / 10", color: "text-orange-400" },
                            { label: "God Files", value: "520", color: "text-yellow-400" },
                            { label: "Complexity Violations", value: "1,819", color: "text-red-400" },
                            { label: "Security Flags", value: "7", color: "text-red-400" },
                            { label: "Context Drift", value: "147", color: "text-yellow-400" },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center md:text-left">
                                <div className={`text-2xl md:text-3xl font-black font-outfit ${stat.color}`}>
                                    {stat.value}
                                </div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ── Gate Pass/Fail Grid ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bento-card bg-black border-zinc-800 p-8 mb-8"
            >
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-6">
                    Quality Gate Results
                </h2>
                <div className="flex flex-wrap gap-2">
                    {AUDIT.gates.map((g) => (
                        <GatePill key={g.id} name={g.name} status={g.status} />
                    ))}
                </div>
            </motion.section>

            {/* ── Violation Breakdown ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bento-card bg-black border-zinc-800 p-8 md:p-10 mb-8"
            >
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 mb-8">
                    Violation Breakdown
                </h2>
                <div className="space-y-6">
                    {Object.entries(AUDIT.breakdown).map(([label, data]) => (
                        <BreakdownBar
                            key={label}
                            label={label}
                            count={data.count}
                            total={AUDIT.totalViolations}
                            severity={data.severity}
                            desc={data.desc}
                        />
                    ))}
                </div>
            </motion.section>

            {/* ── Narrative: God Files ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                        <FileCode className="w-5 h-5 text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-black font-outfit tracking-tight">520 God Files</h2>
                </div>
                <p className="text-zinc-400 leading-relaxed mb-6 max-w-3xl">
                    Over half a thousand files in the OpenClaw codebase exceed 400 lines.
                    When a single file reaches 3,000+ lines, no human and no AI agent can reason about
                    it effectively. This is how bugs hide. This is how security vulnerabilities
                    survive code review.
                </p>

                <div className="bento-card bg-black border-zinc-800 p-6">
                    <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Worst Offenders</h3>
                    <div className="space-y-2">
                        {(showAllFiles ? AUDIT.worstFiles : AUDIT.worstFiles.slice(0, 5)).map((f) => (
                            <div key={f.file} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                                <code className="text-sm text-zinc-300 font-mono truncate mr-4">{f.file}</code>
                                <span className="text-sm font-bold font-mono text-orange-400 shrink-0">{f.lines.toLocaleString()} lines</span>
                            </div>
                        ))}
                    </div>
                    {AUDIT.worstFiles.length > 5 && (
                        <button
                            onClick={() => setShowAllFiles(!showAllFiles)}
                            className="flex items-center gap-1 mt-4 text-xs text-zinc-500 hover:text-accent transition-colors font-bold uppercase tracking-widest"
                        >
                            {showAllFiles ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {showAllFiles ? "Show less" : `Show all ${AUDIT.worstFiles.length}`}
                        </button>
                    )}
                </div>
            </motion.section>

            {/* ── Narrative: Complexity ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <Bug className="w-5 h-5 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-black font-outfit tracking-tight">1,819 Complexity Violations</h2>
                </div>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                    Nearly two thousand functions in the codebase have cyclomatic complexity that exceeds
                    safe thresholds. High complexity means more execution paths, more edge cases, more
                    places for bugs to live. These are not in obscure utility files &mdash; they are in core
                    modules: the agent runner, the gateway server, the browser automation layer, and the
                    memory manager. The parts of OpenClaw that actually do things.
                </p>
            </motion.section>

            {/* ── Narrative: Security ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-black font-outfit tracking-tight">7 Prototype Pollution Vectors</h2>
                </div>
                <p className="text-zinc-400 leading-relaxed mb-6 max-w-3xl">
                    Rigour flagged 7 instances of <code className="text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded text-xs">Object.assign({"{}"}, ...)</code> patterns
                    that can propagate prototype pollution — a well-known JavaScript security vulnerability.
                    These are in sensitive areas: the memory/embeddings system, the cron agent runner, and
                    the agent execution pipeline.
                </p>

                <div className="bento-card bg-black border-zinc-800 p-6">
                    <button
                        onClick={() => setShowSecurity(!showSecurity)}
                        className="flex items-center justify-between w-full"
                    >
                        <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Security Vectors</h3>
                        {showSecurity ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                    </button>
                    {showSecurity && (
                        <div className="space-y-2 mt-4">
                            {AUDIT.securityVectors.map((v, i) => (
                                <div key={i} className="flex items-start gap-2 py-2 border-b border-zinc-800/50 last:border-0">
                                    <Shield className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                                    <code className="text-xs text-zinc-400 font-mono">{v}</code>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.section>

            {/* ── Narrative: TODOs ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-black font-outfit tracking-tight">60 Abandoned TODOs</h2>
                </div>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                    Sixty TODO and FIXME comments scattered across the codebase. Each one is a promise
                    an AI agent made to itself and never kept. This is the signature of vibe coding at
                    scale &mdash; optimizing for appearing done, not for being done.
                </p>
            </motion.section>

            {/* ── Narrative: Context Drift ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                        <GitBranch className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h2 className="text-2xl font-black font-outfit tracking-tight">147 Context Drift Issues</h2>
                </div>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                    Import patterns mixing relative and absolute styles across 644 files. Environment variable
                    naming that drifts from project conventions. These are the kind of inconsistencies that
                    accumulate when multiple AI agents work on a codebase simultaneously without architectural
                    guardrails.
                </p>
            </motion.section>

            {/* ── The Point ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bento-card bg-gradient-to-br from-zinc-900 to-black border-zinc-800 p-8 md:p-12 mb-12"
            >
                <h2 className="text-2xl md:text-3xl font-black font-outfit tracking-tight mb-6">
                    This Is Not About OpenClaw.
                </h2>
                <p className="text-zinc-400 leading-relaxed mb-4 max-w-3xl">
                    What Steinberger built solo is extraordinary. And OpenClaw is open source — the code is
                    there for anyone to improve.
                </p>
                <p className="text-zinc-400 leading-relaxed mb-4 max-w-3xl">
                    This is about a pattern happening everywhere right now. AI coding agents ship code fast.
                    They claim &ldquo;done&rdquo; while leaving behind complexity violations, God files, abandoned TODOs,
                    and security patterns that would fail any serious code review. Tests might pass. The app
                    might work. But the codebase is accumulating structural debt at a rate no human team can repay.
                </p>
                <p className="text-xl font-bold text-zinc-200 mt-8 leading-relaxed">
                    If the most popular AI agent in the world — with 180,000 stars and OpenAI&apos;s backing
                    — scores zero on a basic quality audit, what does <em>your</em> vibe-coded project look like?
                </p>
            </motion.section>

            {/* ── CTA ── */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bento-card bg-black border-accent/20 p-8 md:p-12 text-center"
            >
                <h2 className="text-2xl md:text-4xl font-black font-outfit tracking-tight mb-4 text-glow-green">
                    Try It On Your Repo.
                </h2>
                <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                    Rigour is open source, local-first, and runs in under 4 seconds.
                    Zero cloud. Zero telemetry. MIT licensed.
                </p>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 max-w-md mx-auto mb-8 font-mono text-sm text-left">
                    <div className="text-zinc-500 mb-1">$ npx @rigour-labs/cli init</div>
                    <div className="text-accent">$ npx @rigour-labs/cli check</div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="https://github.com/rigour-labs/rigour"
                        target="_blank"
                        onClick={() => track("cta_github", { location: "audit_openclaw" })}
                        className="bg-accent text-zinc-950 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <Terminal className="w-4 h-4" /> View on GitHub
                    </Link>
                    <Link
                        href="https://docs.rigour.run"
                        target="_blank"
                        onClick={() => track("cta_docs", { location: "audit_openclaw" })}
                        className="px-8 py-3 border border-zinc-800 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white/5 transition-colors"
                    >
                        Read the Docs <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>

                <p className="text-[11px] text-zinc-600 mt-8 max-w-md mx-auto">
                    All data generated by running <code className="text-zinc-500">rigour check</code> against
                    the public OpenClaw repository on {AUDIT.scanDate}. Full JSON report available on request.
                </p>
            </motion.section>
        </article>
    );
}
