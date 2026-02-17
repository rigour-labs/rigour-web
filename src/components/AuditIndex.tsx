"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Shield, FileCode, Zap } from "lucide-react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { AUDIT_REGISTRY } from "@/lib/audits";

function ScoreRing({ score }: { score: number }) {
    const circumference = 2 * Math.PI * 22;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";

    return (
        <div className="relative w-14 h-14">
            <svg viewBox="0 0 52 52" className="w-full h-full -rotate-90">
                <circle cx="26" cy="26" r="22" fill="none" stroke="#27272a" strokeWidth="4" />
                <circle
                    cx="26" cy="26" r="22" fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black font-outfit" style={{ color }}>{score}</span>
            </div>
        </div>
    );
}

export function AuditIndex() {
    return (
        <section className="pt-32 pb-20 px-6 max-w-5xl mx-auto">

            {/* ── Breadcrumb ── */}
            <nav aria-label="Breadcrumb" className="mb-8">
                <ol className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                    <li>/</li>
                    <li className="text-zinc-300">Audits</li>
                </ol>
            </nav>

            {/* ── Header ── */}
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-wider uppercase mb-6">
                    <Shield className="w-3 h-3" />
                    Public Audits
                </div>

                <h1 className="text-4xl md:text-6xl font-black font-outfit leading-[1.1] mb-6 tracking-tight">
                    Quality Gate Audits.
                </h1>

                <p className="text-lg text-zinc-400 leading-relaxed max-w-3xl">
                    We run Rigour against the most popular AI-generated codebases and publish the full results.
                    Every audit is reproducible — run the same command on the same repo and get the same score.
                </p>
            </motion.header>

            {/* ── Comparison Strip ── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bento-card bg-black border-zinc-800 p-6 mb-8"
            >
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
                    <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold flex items-end justify-center pb-2">Project</div>
                    <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold flex items-end justify-center pb-2">Score</div>
                    <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold flex items-end justify-center pb-2 hidden md:flex">Violations</div>
                    <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold flex items-end justify-center pb-2 hidden md:flex">Files</div>
                    <div className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold flex items-end justify-center pb-2">Scan</div>
                    {AUDIT_REGISTRY.map((a) => (
                        <React.Fragment key={a.slug}>
                            <div className="font-bold text-sm text-zinc-200 flex items-center justify-center">{a.projectName}</div>
                            <div className="flex justify-center">
                                <span className={`text-lg font-black font-outfit ${a.score >= 80 ? "text-green-400" : a.score >= 50 ? "text-yellow-400" : "text-red-400"}`}>
                                    {a.score}
                                </span>
                            </div>
                            <div className="text-sm font-mono text-zinc-400 hidden md:flex items-center justify-center">{a.totalViolations.toLocaleString()}</div>
                            <div className="text-sm font-mono text-zinc-400 hidden md:flex items-center justify-center">{a.filesIndexed.toLocaleString()}</div>
                            <div className="text-sm font-mono text-zinc-500 flex items-center justify-center">{a.scanDuration}</div>
                        </React.Fragment>
                    ))}
                </div>
            </motion.div>

            {/* ── Audit Cards ── */}
            <div className="space-y-6">
                {AUDIT_REGISTRY.map((audit, idx) => (
                    <motion.div
                        key={audit.slug}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link
                            href={`/audits/${audit.slug}`}
                            onClick={() => track("audit_card_click", { audit: audit.slug })}
                            className="block bento-card bg-black border-zinc-800 hover:border-zinc-700 transition-all p-6 md:p-8 group"
                        >
                            <div className="flex items-start gap-6">
                                <ScoreRing score={audit.score} />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-xl md:text-2xl font-black font-outfit tracking-tight group-hover:text-accent transition-colors">
                                            {audit.projectName}
                                        </h2>
                                        {audit.featured && (
                                            <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest">
                                                Featured
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-zinc-500 mb-4">{audit.tagline}</p>

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-bold">
                                        <span className="flex items-center gap-1.5">
                                            <AlertTriangle className="w-3 h-3 text-red-400" />
                                            {audit.totalViolations.toLocaleString()} violations
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <FileCode className="w-3 h-3 text-zinc-500" />
                                            {audit.filesIndexed.toLocaleString()} files
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Shield className="w-3 h-3 text-orange-400" />
                                            {audit.gatesFailed}/{audit.gatesTotal} gates failed
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Zap className="w-3 h-3 text-zinc-500" />
                                            {audit.scanDuration}
                                        </span>
                                    </div>
                                </div>

                                <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0 mt-2" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* ── CTA ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 text-center"
            >
                <p className="text-zinc-500 text-sm mb-6">
                    Want us to audit a project? Run it yourself — or reach out.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-3 font-mono text-sm">
                        <span className="text-zinc-500">$ </span>
                        <span className="text-accent">npx @rigour-labs/cli check</span>
                    </div>
                    <Link
                        href="mailto:hello@rigour.run"
                        onClick={() => track("audit_request", { location: "audits_index" })}
                        className="px-6 py-3 border border-zinc-800 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-colors"
                    >
                        Request an Audit
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
