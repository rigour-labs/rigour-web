"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Zap } from "lucide-react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { LiveTerminal } from "./LiveTerminal";

export const Hero = () => {
    const [version, setVersion] = useState("V2.1");

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
                    Rigour {version} is Live
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold font-outfit leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
                >
                    Stop AI Chaos.<br />
                    <span className="text-accent text-glow">Enforce Engineering.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-3xl text-lg md:text-xl text-foreground/60 mb-10 leading-relaxed"
                >
                    Ensure every AI-generated code change meets your team’s quality standards — locally, with zero external telemetry.
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
                        <Terminal className="w-5 h-5" /> View CLI
                    </Link>
                </motion.div>


                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative w-full max-w-5xl aspect-video glass rounded-3xl border-white/10 overflow-hidden shadow-2xl shadow-accent/20"
                >
                    <div className="absolute top-0 left-0 right-0 h-10 glass border-b border-white/10 flex items-center px-4 gap-2 z-10">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        <div className="ml-4 text-xs font-mono text-white/30 tracking-widest uppercase">rigour-cli — check</div>
                    </div>
                    <LiveTerminal />
                </motion.div>
            </div>

            {/* Decorative Orbs */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-accent-secondary/20 rounded-full blur-[120px] -z-10" />
        </section>
    );
};
