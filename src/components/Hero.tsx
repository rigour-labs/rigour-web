"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Zap, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { track } from "@vercel/analytics";

export const Hero = () => {
    const [version, setVersion] = useState("V3.0");

    useEffect(() => {
        fetch("https://registry.npmjs.org/@rigour-labs/cli/latest")
            .then((res) => res.json())
            .then((data) => {
                if (data.version) {
                    setVersion(`V${data.version}`);
                }
            })
            .catch(() => {
                // Keep default if fetch fails
            });
    }, []);

    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-wider uppercase mb-8"
                >
                    <Zap className="w-3 h-3" />
                    Rigour {version} — Real-Time Hooks
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold font-outfit leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
                >
                    Catch AI Drift<br />
                    <span className="text-accent text-glow">Before It Ships.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-3xl text-lg md:text-xl text-foreground/60 mb-10 leading-relaxed"
                >
                    Real-time hooks catch hallucinated imports, hardcoded secrets, and floating promises <strong className="text-white">the instant they&apos;re written</strong>. OWASP LLM Top 10: 10/10 covered.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-4 mb-16"
                >
                    <Link
                        href="https://docs.rigour.run"
                        target="_blank"
                        onClick={() => track('cta_get_started', { location: 'hero' })}
                        className="w-full sm:w-auto px-8 py-4 bg-accent text-background rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                    >
                        Get Started <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link
                        href="https://github.com/rigour-labs/rigour"
                        target="_blank"
                        onClick={() => track('cta_view_cli', { location: 'hero' })}
                        className="w-full sm:w-auto px-8 py-4 glass rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                    >
                        <Terminal className="w-5 h-5" /> GitHub
                    </Link>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <motion.a
                        href="https://registry.modelcontextprotocol.io/v0.1/servers?search=rigour"
                        target="_blank"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors"
                    >
                        ✓ Listed on MCP Registry
                    </motion.a>

                    <motion.a
                        href="https://doi.org/10.5281/zenodo.18673564"
                        target="_blank"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
                    >
                        ✓ Peer-Reviewed Whitepaper
                    </motion.a>
                </div>


                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative w-full max-w-5xl glass rounded-3xl border-white/10 overflow-hidden shadow-2xl shadow-accent/20"
                >
                    <div className="absolute top-0 left-0 right-0 h-10 glass border-b border-white/10 flex items-center px-4 gap-2 z-10">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        <div className="ml-4 text-xs font-mono text-white/30 tracking-widest uppercase flex items-center gap-2">
                            <Play className="w-3 h-3 text-accent" />
                            npx @rigour-labs/cli demo --cinematic
                        </div>
                    </div>
                    <div className="pt-10">
                        <Image
                            src="/demo.gif"
                            alt="Rigour demo — AI agent writes flawed code, hooks catch issues in real time, agent self-corrects, score jumps from 35 to 91"
                            width={1200}
                            height={600}
                            className="w-full h-auto"
                            unoptimized
                            priority
                        />
                    </div>
                </motion.div>
            </div>

            {/* Decorative Orbs */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent-secondary/20 rounded-full blur-[120px] -z-10" />
        </section>
    );
};
