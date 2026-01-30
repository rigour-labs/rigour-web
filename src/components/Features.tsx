"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Brain, Cpu, Lock, Globe, MessageSquare } from "lucide-react";

const features = [
    {
        icon: Shield,
        title: "Quality Gates",
        description: "Enforce strict engineering standards and checks before code ever reaches a merge request."
    },
    {
        icon: Lock,
        title: "Local Honest",
        description: "No login. No telemetry. Your code stays on your machine. We don't even have a 'Signup' button."
    },
    {
        icon: Brain,
        title: "Pattern Index",
        description: "Semantic understanding of your codebase. Search patterns with natural language queries."
    },
    {
        icon: MessageSquare,
        title: "Context Memory",
        description: "Persistent memory that survives across AI sessions. Remember decisions and context."
    },
    {
        icon: Cpu,
        title: "Deep Static Analysis",
        description: "Semantic checks that go deep beyond linting, catching architectural and logic drifts."
    },
    {
        icon: Globe,
        title: "MCP Registry Listed",
        description: "Official listing on the MCP Registry. Works with Claude, Cursor, Cline, and more."
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
