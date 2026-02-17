"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Shield, FileCode, Bug } from "lucide-react";
import Link from "next/link";
import { track } from "@vercel/analytics";

export const AuditShowcase = () => {
    return (
        <section className="py-24 px-6 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-wider uppercase mb-6">
                        <AlertTriangle className="w-3 h-3" />
                        Featured Audit
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black font-outfit tracking-tight mb-4">
                        We Audited the Most Popular AI Agent.
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        OpenClaw — 180K GitHub stars, acqui-hired by OpenAI. We ran Rigour
                        quality gates against the full codebase. The scan took 3.9 seconds.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { value: "0", label: "Score", sub: "/100", color: "text-red-400" },
                        { value: "2,080", label: "Violations", sub: "total", color: "text-red-400" },
                        { value: "520", label: "God Files", sub: ">400 lines", color: "text-orange-400" },
                        { value: "7", label: "Security Flags", sub: "prototype pollution", color: "text-red-400" },
                    ].map((stat) => (
                        <div key={stat.label} className="bento-card bg-black border-zinc-800 p-6 text-center">
                            <div className={`text-3xl md:text-4xl font-black font-outfit ${stat.color}`}>
                                {stat.value}
                            </div>
                            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-2">
                                {stat.label}
                            </div>
                            <div className="text-[10px] text-zinc-600 mt-1">{stat.sub}</div>
                        </div>
                    ))}
                </motion.div>

                {/* Mini gate strip */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bento-card bg-black border-zinc-800 p-6 mb-8"
                >
                    <div className="flex flex-wrap items-center gap-3 justify-center">
                        {[
                            { name: "File Size", fail: true },
                            { name: "AST Analysis", fail: true },
                            { name: "Content Check", fail: true },
                            { name: "Context Drift", fail: true },
                            { name: "Environment", fail: false },
                            { name: "Dependencies", fail: false },
                            { name: "Safety Rail", fail: false },
                            { name: "Coverage", fail: false },
                            { name: "Structure", fail: false },
                        ].map((g) => (
                            <span
                                key={g.name}
                                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border ${g.fail
                                    ? "border-red-500/20 bg-red-500/5 text-red-400"
                                    : "border-green-500/20 bg-green-500/5 text-green-500"
                                    }`}
                            >
                                {g.fail ? "✗" : "✓"} {g.name}
                            </span>
                        ))}
                    </div>
                </motion.div>

                {/* Key findings strip */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                >
                    <div className="bento-card bg-black border-zinc-800 p-6">
                        <FileCode className="w-5 h-5 text-orange-400 mb-3" />
                        <div className="text-sm font-bold text-zinc-200 mb-1">520 Oversized Files</div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            The worst: a single file at 3,333 lines. No human or AI can reason about that.
                        </p>
                    </div>
                    <div className="bento-card bg-black border-zinc-800 p-6">
                        <Bug className="w-5 h-5 text-red-400 mb-3" />
                        <div className="text-sm font-bold text-zinc-200 mb-1">1,819 Complexity Violations</div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            In core modules: agent runner, gateway server, browser automation, memory manager.
                        </p>
                    </div>
                    <div className="bento-card bg-black border-zinc-800 p-6">
                        <Shield className="w-5 h-5 text-red-400 mb-3" />
                        <div className="text-sm font-bold text-zinc-200 mb-1">7 Security Vectors</div>
                        <p className="text-xs text-zinc-500 leading-relaxed">
                            Prototype pollution in memory, cron runner, and execution pipeline. 135K instances exposed.
                        </p>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <Link
                        href="/audits/openclaw"
                        onClick={() => track("cta_audit", { location: "homepage_showcase" })}
                        className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-500/20 transition-colors"
                    >
                        View Full Audit Report <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
