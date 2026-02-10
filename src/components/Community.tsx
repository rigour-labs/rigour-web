"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, MessageSquare, Star, Globe } from "lucide-react";
import Link from "next/link";
import { track } from "@vercel/analytics";

export const Community = () => {
    return (
        <section id="community" className="py-24 px-6 border-t border-zinc-900 bg-[#0c0c0e]">
            <div className="max-w-4xl mx-auto bento-card bg-black border-zinc-800 p-12 md:p-20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -z-10" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">
                        The Developer First Protocol
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black font-outfit mb-6 tracking-tighter italic uppercase text-glow-green">Built for Humans.</h2>
                    <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed font-medium">
                        Standardizing the autonomous engineering layer. Rigour is free, open source, and built to capture the future of AI drift.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="https://github.com/rigour-labs/rigour"
                            target="_blank"
                            onClick={() => track('cta_github', { location: 'community' })}
                            className="bg-accent text-zinc-950 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-transform"
                        >
                            <Github className="w-4 h-4" /> GitHub <Star className="w-3 h-3 fill-zinc-950" />
                        </Link>
                        <Link
                            href="https://docs.rigour.run"
                            target="_blank"
                            onClick={() => track('cta_docs', { location: 'community' })}
                            className="px-8 py-3 border border-zinc-800 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-white/5 transition-colors"
                        >
                            Documentation
                        </Link>
                    </div>

                    <div className="mt-16 pt-16 border-t border-zinc-800 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-3xl font-black font-outfit text-accent">OSS</div>
                            <div className="text-[11px] text-zinc-500 uppercase font-black tracking-widest mt-2">MIT Licensed</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black font-outfit text-accent">100%</div>
                            <div className="text-[11px] text-zinc-500 uppercase font-black tracking-widest mt-2">Local Audit</div>
                        </div>
                        <div className="hidden md:block">
                            <div className="text-3xl font-black font-outfit text-accent">90%+</div>
                            <div className="text-[11px] text-zinc-500 uppercase font-black tracking-widest mt-2">DDR Benchmark</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
