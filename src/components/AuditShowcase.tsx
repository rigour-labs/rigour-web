"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { track } from "@vercel/analytics";

export const AuditShowcase = () => {
    return (
        <section className="py-24 px-6 border-t border-zinc-800/50">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bento-card p-10 md:p-14 text-center relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 pointer-events-none" />
                    <div className="relative z-10">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4">Proof of concept</p>
                        <h2 className="text-3xl md:text-4xl font-bold font-outfit mb-4">
                            We audited <span className="text-accent">OpenClaw</span> — 180K stars, acqui-hired by OpenAI.
                        </h2>
                        <p className="text-zinc-400 max-w-xl mx-auto mb-8">
                            Score: 0/100. 2,080 violations. 7 security vectors. The scan took 3.9 seconds.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                            {[
                                { name: "File Size", fail: true },
                                { name: "AST Analysis", fail: true },
                                { name: "Content Check", fail: true },
                                { name: "Context Drift", fail: true },
                                { name: "Environment", fail: false },
                                { name: "Dependencies", fail: false },
                                { name: "Safety Rail", fail: false },
                            ].map((g) => (
                                <span
                                    key={g.name}
                                    className={`text-[10px] font-medium uppercase tracking-wider px-3 py-1.5 rounded-full border ${g.fail
                                        ? "border-rose-400/15 bg-rose-400/5 text-rose-300/80"
                                        : "border-accent/15 bg-accent/5 text-accent/80"
                                        }`}
                                >
                                    {g.fail ? "\u2717" : "\u2713"} {g.name}
                                </span>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/audits/openclaw"
                                onClick={() => track("cta_audit", { location: "homepage_showcase", audit: "openclaw" })}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
                            >
                                Read Full Report <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/audits"
                                onClick={() => track("cta_audit", { location: "homepage_showcase", audit: "all" })}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-white/5 transition-colors"
                            >
                                All Audits
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
