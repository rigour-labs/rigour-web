"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Shield, Lock, Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { track } from "@vercel/analytics";

export const BentoHero = () => {
    const [version, setVersion] = useState("v4.2");

    useEffect(() => {
        fetch("https://registry.npmjs.org/@rigour-labs/cli/latest")
            .then((res) => res.json())
            .then((data) => {
                if (data.version) {
                    setVersion(`v${data.version}`);
                }
            })
            .catch(() => { });
    }, []);

    return (
        <section className="pt-36 pb-24 px-6 max-w-6xl mx-auto">
            {/* Centered Hero */}
            <div className="text-center mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium tracking-wide mb-8"
                >
                    <Shield className="w-3.5 h-3.5" />
                    Rigour {version} — DLP + Governance + Quality Gates
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold font-outfit leading-[1.1] mb-6"
                >
                    AI Agent Governance.<br />
                    <span className="gradient-text text-glow">One command.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-2xl mx-auto text-lg text-zinc-400 leading-relaxed mb-10"
                >
                    Block credential leaks before they happen. Enforce quality gates on every file write.
                    Control what agents remember. Works with <strong className="text-zinc-200">Claude, Cursor, Cline, Windsurf, and Copilot</strong>.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
                >
                    <Link
                        href="/demo"
                        onClick={() => track('cta_live_demo', { location: 'hero' })}
                        className="px-8 py-3.5 bg-emerald-600 text-white rounded-2xl font-semibold text-lg flex items-center gap-2 hover:bg-emerald-500 transition-colors"
                    >
                        <Play className="w-5 h-5" />
                        Watch 30s Demo
                    </Link>
                    <Link
                        href="https://docs.rigour.run"
                        target="_blank"
                        onClick={() => track('cta_get_started', { location: 'hero' })}
                        className="px-8 py-3.5 bg-accent text-white rounded-2xl font-semibold text-lg flex items-center gap-2 hover:bg-accent-bright transition-colors"
                    >
                        Get Started <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                        href="https://github.com/rigour-labs/rigour"
                        target="_blank"
                        onClick={() => track('cta_github', { location: 'hero' })}
                        className="px-8 py-3.5 border border-zinc-700 rounded-2xl font-semibold text-lg flex items-center gap-2 hover:bg-white/5 transition-colors text-zinc-300"
                    >
                        <Terminal className="w-5 h-5" /> GitHub
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-3"
                >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10 text-accent/80 text-xs font-medium">
                        <Lock className="w-3 h-3" /> Zero Telemetry
                    </span>
                    <a
                        href="https://registry.modelcontextprotocol.io/v0.1/servers?search=rigour"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10 text-accent/80 text-xs font-medium hover:bg-accent/10 transition-colors"
                    >
                        MCP Registry Listed
                    </a>
                    <a
                        href="https://doi.org/10.5281/zenodo.18673564"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/10 text-accent/80 text-xs font-medium hover:bg-accent/10 transition-colors"
                    >
                        Peer-Reviewed Whitepaper
                    </a>
                </motion.div>
            </div>

            {/* Install commands */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="max-w-2xl mx-auto mb-16 space-y-3"
            >
                <div className="bento-card p-4 flex items-center justify-between font-mono text-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-accent">$</span>
                        <span className="text-zinc-300">npx @rigour-labs/cli init</span>
                    </div>
                    <span className="text-zinc-600 text-xs hidden sm:inline">npm / pnpm / yarn</span>
                </div>
                <div className="bento-card p-4 flex items-center justify-between font-mono text-sm">
                    <div className="flex items-center gap-3">
                        <span className="text-accent">$</span>
                        <span className="text-zinc-300">brew tap rigour-labs/tap && brew install rigour</span>
                    </div>
                    <span className="text-zinc-600 text-xs hidden sm:inline">homebrew</span>
                </div>
            </motion.div>

            {/* Demo GIF */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bento-card p-0 overflow-hidden relative group"
            >
                <div className="bg-zinc-900/60 backdrop-blur-md px-4 py-2 border-b border-zinc-800/50 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-2">
                        <Play className="w-3 h-3 text-accent" />
                        rigour demo --cinematic
                    </div>
                </div>
                <Image
                    src="/demo.gif"
                    alt="Rigour demo — AI agent writes code, hooks catch issues in real time, agent self-corrects"
                    width={1200}
                    height={600}
                    className="w-full h-auto"
                    unoptimized
                    priority
                />
            </motion.div>
        </section>
    );
};
