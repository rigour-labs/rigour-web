"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Brain, Cpu, Lock, Globe, MessageSquare } from "lucide-react";

const features = [
    {
        icon: Shield,
        title: "Deterministic Gates",
        description: "Define strict engineering standards that AI agents must pass before merging code."
    },
    {
        icon: Brain,
        title: "Zero Telemetry",
        description: "No code ever leaves your machine. Local-first architecture for ultimate privacy."
    },
    {
        icon: Cpu,
        title: "AST-Based Analysis",
        description: "Complexity and architectural checks powered by deep static analysis."
    },
    {
        icon: Lock,
        title: "Safety Rails",
        description: "Protect critical paths and limit the blast radius of AI-generated changes."
    },
    {
        icon: Globe,
        title: "Open Source Roots",
        description: "Built for the community. Rigour is and will always be free for individual developers."
    },
    {
        icon: MessageSquare,
        title: "Team Collaboration",
        description: "Standardize quality across your team with shared gates and deterministic feedback."
    }
];

export const Features = () => {
    return (
        <section id="features" className="py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-4">Engineering First. AI Second.</h2>
                    <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
                        Rigour provides the guardrails necessary to transition from chaotic AI code to production-ready excellence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass p-8 rounded-3xl group hover:border-accent/40 transition-colors"
                        >
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-bold font-outfit mb-3">{feature.title}</h3>
                            <p className="text-foreground/60 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
