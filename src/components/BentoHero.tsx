"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Zap, Shield, Brain, Cpu, Globe } from "lucide-react";
import Link from "next/link";
import { LiveTerminal } from "./LiveTerminal";

export const BentoHero = () => {
    const [version, setVersion] = useState("V2.9");

    useEffect(() => {
        fetch("https://registry.npmjs.org/@rigour-labs/cli/latest")
            .then((res) => res.json())
            .then((data) => {
                if (data.version) {
                    setVersion(`V${data.version}`);
                }
            })
            .catch(() => { });
    }, []);

    return (
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* Main Title Tile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-8 bento-card flex flex-col justify-center p-10 bg-gradient-to-br from-zinc-900 to-black border-zinc-800"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-wider uppercase mb-8 w-fit">
                        <Zap className="w-3 h-3" />
                        Rigour {version} — Developer First
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-outfit leading-tight mb-6">
                        Engineering Rigour for<br />
                        <span className="text-accent text-glow-green">Autonomous AI Teams.</span>
                    </h1>
                    <p className="max-w-xl text-lg text-zinc-400 leading-relaxed mb-8">
                        Enforce your standards, semantic patterns, and architectural rules locally. Zero telemetry. Zero external dependencies.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="https://docs.rigour.run"
                            className="px-6 py-3 bg-accent text-background rounded-xl font-bold hover:scale-105 transition-transform"
                        >
                            Start Building
                        </Link>
                        <Link
                            href="https://github.com/rigour-labs/rigour"
                            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                            <Terminal className="w-4 h-4" /> CLI Source
                        </Link>
                    </div>
                </motion.div>

                {/* Mini Stats/Features Tile */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="md:col-span-4 bento-card flex flex-col gap-6"
                >
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Core Capabilities</h3>
                        <div className="space-y-4">
                            {[
                                { icon: Shield, title: "Static Policy Gates" },
                                { icon: Brain, title: "Semantic Pattern Index" },
                                { icon: Globe, title: "MCP Native Integration" },
                                { icon: Cpu, title: "Local-Only Logic" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                        <item.icon className="w-4 h-4 text-accent" />
                                    </div>
                                    <span className="text-sm font-medium text-zinc-300">{item.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-auto pt-6 border-t border-zinc-800">
                        <div className="text-xs text-zinc-500 mb-2 uppercase tracking-widest">Integrations</div>
                        <div className="flex gap-4">
                            <span className="text-xs font-mono text-zinc-400">CLAUDE</span>
                            <span className="text-xs font-mono text-zinc-400">CURSOR</span>
                            <span className="text-xs font-mono text-zinc-400">CLINE</span>
                            <span className="text-xs font-mono text-zinc-400">VSCODE</span>
                        </div>
                    </div>
                </motion.div>

                {/* Live Terminal Tile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="md:col-span-12 bento-card p-0 overflow-hidden border-zinc-800 bg-black min-h-[400px] relative group"
                >
                    <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    <div className="relative z-10">
                        <div className="bg-zinc-900/80 backdrop-blur-md px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                                <div className="w-3 h-3 rounded-full bg-zinc-800" />
                            </div>
                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">rigour --check --json</div>
                        </div>
                        <div className="p-4">
                            <LiveTerminal />
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};
