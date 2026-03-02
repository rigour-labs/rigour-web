"use client";

import React from "react";
import { motion } from "framer-motion";
import { Github, Star } from "lucide-react";
import Link from "next/link";
import { track } from "@vercel/analytics";

export const Community = () => {
    return (
        <section id="community" className="py-24 px-6 border-t border-zinc-800/50">
            <div className="max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-6">
                        Open source.<br />
                        <span className="text-zinc-500">No signup. No telemetry.</span>
                    </h2>
                    <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
                        Your code never leaves your machine. MIT licensed. Built by engineers who believe
                        governance should be a feature, not a product.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link
                            href="https://github.com/rigour-labs/rigour"
                            target="_blank"
                            onClick={() => track('cta_github', { location: 'community' })}
                            className="bg-accent text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-accent-bright transition-colors"
                        >
                            <Github className="w-4 h-4" /> Star on GitHub <Star className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                            href="https://docs.rigour.run"
                            target="_blank"
                            onClick={() => track('cta_docs', { location: 'community' })}
                            className="px-8 py-3 border border-zinc-700 rounded-xl font-semibold flex items-center gap-2 hover:bg-white/5 transition-colors text-zinc-300"
                        >
                            Documentation
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "MIT", label: "License" },
                            { value: "100%", label: "Local" },
                            { value: "29+", label: "DLP Patterns" },
                            { value: "6", label: "Languages" },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-2xl font-bold font-outfit gradient-text">{stat.value}</div>
                                <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
