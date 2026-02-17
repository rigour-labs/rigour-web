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
    Code,
} from "lucide-react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import type { AuditData, AuditNarrativeSection } from "@/lib/audit-types";

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

const ICON_MAP: Record<AuditNarrativeSection["icon"], React.ComponentType<{ className?: string }>> = {
    file: FileCode,
    bug: Bug,
    lock: Lock,
    alert: AlertTriangle,
    git: GitBranch,
    code: Code,
};

const ICON_COLOR_MAP: Record<AuditNarrativeSection["icon"], string> = {
    file: "text-orange-400 bg-orange-500/10",
    bug: "text-red-400 bg-red-500/10",
    lock: "text-red-400 bg-red-500/10",
    alert: "text-yellow-400 bg-yellow-500/10",
    git: "text-yellow-400 bg-yellow-500/10",
    code: "text-blue-400 bg-blue-500/10",
};

/* ───────── Main data-driven component ───────── */

export function AuditDashboard({ audit }: { audit: AuditData }) {
    const [showAllFiles, setShowAllFiles] = useState(false);
    const [showSecurity, setShowSecurity] = useState(false);

    return (
        <article className="pt-32 pb-20 px-6 max-w-5xl mx-auto">

            {/* ── Breadcrumb ── */}
            <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                    <li>/</li>
                    <li><Link href="/audits" className="hover:text-accent transition-colors">Audits</Link></li>
                    <li>/</li>
                    <li className="text-zinc-300">{audit.projectName}</li>
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
                    {audit.projectName}: {audit.projectTagline.split(".")[0]}.<br />
                    <span className="text-red-400">{audit.totalViolations.toLocaleString()} Violations. Score: {audit.score === 0 ? "Zero" : audit.score}.</span>
                </h1>

                <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl mb-6">
                    We pointed Rigour at {audit.projectName} — {audit.projectTagline.toLowerCase().includes("star") ? audit.projectTagline.toLowerCase() : audit.projectTagline}.
                    {" "}The scan took {audit.scanDuration}. {audit.totalViolations.toLocaleString()} violations across {audit.filesIndexed.toLocaleString()} files.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {audit.scanDate}</span>
                    <span className="text-zinc-700">|</span>
                    <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {audit.filesIndexed.toLocaleString()} Files Scanned</span>
                    <span className="text-zinc-700">|</span>
                    <span className="flex items-center gap-1.5"><Search className="w-3.5 h-3.5" /> {audit.patternsDetected.toLocaleString()} Patterns</span>
                    <span className="text-zinc-700">|</span>
                    <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> {audit.scanDuration}</span>
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
                    <div className="flex flex-col items-center gap-4">
                        <ScoreGauge score={audit.score} />
                        <div className="text-center">
                            <div className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Rigour Score</div>
                            <div className={`text-sm font-bold mt-1 ${audit.score >= 80 ? "text-green-400" : audit.score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                                {audit.score >= 80 ? "PASS" : "FAIL"}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 col-span-2">
                        {audit.keyStats.map((stat) => (
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
                    {audit.gates.map((g) => (
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
                    {Object.entries(audit.breakdown).map(([label, data]) => (
                        <BreakdownBar
                            key={label}
                            label={label}
                            count={data.count}
                            total={audit.totalViolations}
                            severity={data.severity}
                            desc={data.desc}
                        />
                    ))}
                </div>
            </motion.section>

            {/* ── Narrative Sections ── */}
            {audit.narratives.map((section, idx) => {
                const IconComponent = ICON_MAP[section.icon];
                const iconColor = ICON_COLOR_MAP[section.icon];
                const [bgColor] = iconColor.split(" ").slice(1);

                return (
                    <motion.section
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor}`}>
                                <IconComponent className={`w-5 h-5 ${iconColor.split(" ")[0]}`} />
                            </div>
                            <h2 className="text-2xl font-black font-outfit tracking-tight">{section.title}</h2>
                        </div>
                        <p className="text-zinc-400 leading-relaxed max-w-3xl" dangerouslySetInnerHTML={{ __html: section.body }} />

                        {/* Show worst files after the first narrative (file-related) */}
                        {idx === 0 && audit.worstFiles.length > 0 && (
                            <div className="bento-card bg-black border-zinc-800 p-6 mt-6">
                                <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-4">Worst Offenders</h3>
                                <div className="space-y-2">
                                    {(showAllFiles ? audit.worstFiles : audit.worstFiles.slice(0, 5)).map((f) => (
                                        <div key={f.file} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                                            <code className="text-sm text-zinc-300 font-mono truncate mr-4">{f.file}</code>
                                            <span className="text-sm font-bold font-mono text-orange-400 shrink-0">{f.lines.toLocaleString()} lines</span>
                                        </div>
                                    ))}
                                </div>
                                {audit.worstFiles.length > 5 && (
                                    <button
                                        onClick={() => setShowAllFiles(!showAllFiles)}
                                        className="flex items-center gap-1 mt-4 text-xs text-zinc-500 hover:text-accent transition-colors font-bold uppercase tracking-widest"
                                    >
                                        {showAllFiles ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                        {showAllFiles ? "Show less" : `Show all ${audit.worstFiles.length}`}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Show security vectors after the security narrative */}
                        {section.icon === "lock" && audit.securityVectors.length > 0 && (
                            <div className="bento-card bg-black border-zinc-800 p-6 mt-6">
                                <button
                                    onClick={() => setShowSecurity(!showSecurity)}
                                    className="flex items-center justify-between w-full"
                                >
                                    <h3 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Security Vectors</h3>
                                    {showSecurity ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                                </button>
                                {showSecurity && (
                                    <div className="space-y-2 mt-4">
                                        {audit.securityVectors.map((v, i) => (
                                            <div key={i} className="flex items-start gap-2 py-2 border-b border-zinc-800/50 last:border-0">
                                                <Shield className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                                                <code className="text-xs text-zinc-400 font-mono">{v}</code>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.section>
                );
            })}

            {/* ── Editorial: "The Point" ── */}
            {audit.editorial && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bento-card bg-gradient-to-br from-zinc-900 to-black border-zinc-800 p-8 md:p-12 mb-12"
                >
                    <h2 className="text-2xl md:text-3xl font-black font-outfit tracking-tight mb-6">
                        {audit.editorial.title}
                    </h2>
                    {audit.editorial.paragraphs.map((p, i) => (
                        <p key={i} className="text-zinc-400 leading-relaxed mb-4 max-w-3xl" dangerouslySetInnerHTML={{ __html: p }} />
                    ))}
                    {audit.editorial.closingLine && (
                        <p className="text-xl font-bold text-zinc-200 mt-8 leading-relaxed" dangerouslySetInnerHTML={{ __html: audit.editorial.closingLine }} />
                    )}
                </motion.section>
            )}

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
                        onClick={() => track("cta_github", { location: `audit_${audit.slug}` })}
                        className="bg-accent text-zinc-950 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <Terminal className="w-4 h-4" /> View on GitHub
                    </Link>
                    <Link
                        href="https://docs.rigour.run"
                        target="_blank"
                        onClick={() => track("cta_docs", { location: `audit_${audit.slug}` })}
                        className="px-8 py-3 border border-zinc-800 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white/5 transition-colors"
                    >
                        Read the Docs <ExternalLink className="w-3 h-3" />
                    </Link>
                    <Link
                        href="/audits"
                        onClick={() => track("cta_all_audits", { location: `audit_${audit.slug}` })}
                        className="px-8 py-3 border border-zinc-800 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white/5 transition-colors"
                    >
                        All Audits <ExternalLink className="w-3 h-3" />
                    </Link>
                </div>

                <p className="text-[11px] text-zinc-600 mt-8 max-w-md mx-auto">
                    All data generated by running <code className="text-zinc-500">rigour check</code> against
                    the public {audit.projectName} repository on {audit.scanDate}. Full JSON report available on request.
                </p>
            </motion.section>
        </article>
    );
}
