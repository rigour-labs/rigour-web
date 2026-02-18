"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Brain, Cpu, Lock, Globe, MessageSquare, Users, AlertTriangle, TrendingUp, FileText, Building2, Zap } from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "Real-Time Hooks",
        description: "Catch issues the instant AI writes code — hardcoded secrets, hallucinated imports, floating promises. Works with Claude, Cursor, Cline, and Windsurf.",
        badge: "v3.0"
    },
    {
        icon: Shield,
        title: "OWASP LLM Top 10: 10/10",
        description: "Full coverage of all 10 OWASP risks for LLM-generated code — injection, auth, secrets, ReDoS, output handling, and more. All Strong.",
        badge: "v3.0"
    },
    {
        icon: Users,
        title: "Multi-Agent Governance",
        description: "Coordinate multiple AI agents on the same codebase with scope conflict detection and verified handoffs.",
        badge: "v2.14"
    },
    {
        icon: AlertTriangle,
        title: "Security Pattern Detection",
        description: "25+ vulnerability patterns with CWE IDs — SQL injection, XSS, CORS wildcards, chmod 777, eval injection, and template injection.",
        badge: "v3.0"
    },
    {
        icon: Lock,
        title: "Local Honest",
        description: "No login. No telemetry. Your code stays on your machine. We don't even have a 'Signup' button."
    },
    {
        icon: Brain,
        title: "AI Drift Detection",
        description: "Detect hallucinated imports, unhandled promises, context window artifacts, and async safety issues across 6 languages.",
        badge: "v2.17"
    },
    {
        icon: MessageSquare,
        title: "Context Memory",
        description: "Persistent memory that survives across AI sessions. Remember decisions and context."
    },
    {
        icon: TrendingUp,
        title: "Score Trending",
        description: "Track quality scores over time with trend analysis. Exportable audit reports for compliance officers.",
        badge: "v2.17"
    },
    {
        icon: Cpu,
        title: "Deep Static Analysis",
        description: "AST-level checks beyond linting — catching architectural drifts, SOLID violations, and complexity issues."
    },
    {
        icon: Globe,
        title: "MCP Registry Listed",
        description: "Official listing on the MCP Registry. Native integration with Claude, Cursor, Cline, Windsurf, and Gemini."
    },
    {
        icon: Building2,
        title: "Industry Presets",
        description: "One-command setup for healthcare (HIPAA), fintech (SOC2), and government (FedRAMP) compliance gates.",
        badge: "v2.17"
    },
    {
        icon: FileText,
        title: "Peer-Reviewed Research",
        description: "Backed by a Zenodo-published whitepaper: Deterministic Quality Gates for AI-Generated Code in Regulated Systems.",
        badge: "DOI"
    }
];

export const Features = () => {
    return (
        <section id="features" className="py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-4">Engineering First. AI Second.</h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Rigour provides the guardrails necessary to transition from chaotic AI code to production-ready excellence.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="glass p-8 rounded-3xl group hover:border-accent/40 transition-colors relative"
                        >
                            {(feature as any).badge && (
                                <span className="absolute top-4 right-4 px-2 py-1 text-xs font-bold bg-accent/20 text-accent rounded-full">
                                    {(feature as any).badge}
                                </span>
                            )}
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-bold font-outfit mb-3">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
