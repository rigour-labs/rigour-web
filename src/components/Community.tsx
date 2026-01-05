"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, MessageSquare, Star, Globe } from "lucide-react";
import Link from "next/link";

export const Community = () => {
    return (
        <section id="community" className="py-24 px-6">
            <div className="max-w-4xl mx-auto glass p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -z-10" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-secondary/10 rounded-full blur-[80px] -z-10" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-bold tracking-wider uppercase mb-8">
                        <Globe className="w-3 h-3" />
                        Open Source & Community Driven
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6">Built for Developers.</h2>
                    <p className="text-lg text-foreground/60 mb-10 max-w-xl mx-auto leading-relaxed">
                        Rigour is free, open source, and built to standardize engineering quality for everyone.
                        Join us in shaping the future of AI-native engineering.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="https://github.com/rigour-labs/rigour"
                            target="_blank"
                            className="w-full sm:w-auto bg-white text-black px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                        >
                            <Github className="w-5 h-5" /> Star on GitHub <Star className="w-4 h-4 fill-black" />
                        </Link>
                        <Link
                            href="https://docs.rigour.run"
                            target="_blank"
                            className="w-full sm:w-auto glass px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                        >
                            View Documentation
                        </Link>
                    </div>

                    <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-2xl font-bold font-outfit text-accent">OSS</div>
                            <div className="text-xs text-white/30 uppercase font-bold tracking-widest mt-1">MIT Licensed</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold font-outfit text-accent">100%</div>
                            <div className="text-xs text-white/30 uppercase font-bold tracking-widest mt-1">Local-First</div>
                        </div>
                        <div className="hidden md:block">
                            <div className="text-2xl font-bold font-outfit text-accent">Active</div>
                            <div className="text-xs text-white/30 uppercase font-bold tracking-widest mt-1">Community</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
