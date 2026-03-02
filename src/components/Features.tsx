"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Brain, Lock, Zap, Users, Building2 } from "lucide-react";

const pillars = [
    {
        icon: Shield,
        title: "Input DLP",
        subtitle: "Block credential leaks",
        description: "29 patterns scan every agent input for AWS keys, API tokens, database URLs, private keys, and more. Shannon entropy detection catches encoded secrets. Unicode normalization defeats zero-width character bypasses.",
        details: ["29 credential patterns", "Entropy detection", "Anti-evasion hardening", "OWASP LLM 10/10"],
        color: "from-indigo-500/20 to-purple-500/10",
    },
    {
        icon: Brain,
        title: "Quality Gates",
        subtitle: "Enforce standards on every write",
        description: "Real-time hooks fire on every file write across all agents. Deterministic PASS/FAIL gates for file size, complexity, security patterns, hallucinated imports, and AI drift. Deep LLM analysis across 40+ categories.",
        details: ["Real-time hooks", "AST-level analysis", "Drift detection", "6 languages"],
        color: "from-violet-500/20 to-fuchsia-500/10",
    },
    {
        icon: Lock,
        title: "Memory Governance",
        subtitle: "Control what agents remember",
        description: "Block writes to native agent memory files (.cursorrules, CLAUDE.md, .clinerules). Force all persistence through governed channels with DLP scanning. Separate memory and skills enforcement with granular overrides.",
        details: ["Memory path blocking", "Skills governance", "DLP on recall", "Configurable via YAML"],
        color: "from-purple-500/20 to-pink-500/10",
    },
];

const extras = [
    { icon: Zap, label: "Real-time hooks for Claude, Cursor, Cline, Windsurf, Copilot" },
    { icon: Users, label: "Multi-agent governance with scope conflict detection" },
    { icon: Building2, label: "Industry presets for HIPAA, SOC2, FedRAMP compliance" },
];

export const Features = () => {
    return (
        <section id="features" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-4">Three layers of protection.</h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Every agent interaction passes through DLP, quality gates, and governance — before a single line ships.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bento-card p-8 flex flex-col relative overflow-hidden"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-30 pointer-events-none`} />
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                                    <pillar.icon className="w-6 h-6 text-accent" />
                                </div>
                                <h3 className="text-xl font-bold font-outfit mb-1">{pillar.title}</h3>
                                <p className="text-sm text-accent/70 font-medium mb-4">{pillar.subtitle}</p>
                                <p className="text-zinc-400 text-sm leading-relaxed mb-6">{pillar.description}</p>
                                <div className="mt-auto space-y-2">
                                    {pillar.details.map((detail, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                                            <span className="text-accent">&#x2713;</span>
                                            <span>{detail}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Extra features strip */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-4"
                >
                    {extras.map((extra, i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-zinc-800/50 text-sm text-zinc-400">
                            <extra.icon className="w-4 h-4 text-accent/60" />
                            {extra.label}
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
