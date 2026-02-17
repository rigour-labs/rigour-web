"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Landmark, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

const industries = [
    {
        icon: Heart,
        title: "Healthcare",
        subtitle: "HIPAA / FDA / HL7",
        description: "Enforce PHI protection, audit logging, and compliance documentation gates tuned for health tech.",
        gates: ["300 line limit", "Security blocks on critical", "COMPLIANCE.md required"],
        command: "rigour init --preset healthcare",
        color: "text-red-400",
        bgColor: "bg-red-400/10",
        borderColor: "border-red-400/20",
    },
    {
        icon: Landmark,
        title: "Financial Services",
        subtitle: "SOC2 / PCI-DSS / DORA",
        description: "Agent team governance, audit trail exports, and strict security thresholds for fintech codebases.",
        gates: ["Agent team governance", "Security blocks on high", "AUDIT_LOG.md required"],
        command: "rigour init --preset fintech",
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
        borderColor: "border-blue-400/20",
    },
    {
        icon: Shield,
        title: "Government",
        subtitle: "FedRAMP / NIST / CMMC",
        description: "Maximum strictness with checkpoint supervision, low complexity ceilings, and full governance controls.",
        gates: ["Complexity limit 8", "Security blocks on medium", "Checkpoint supervision"],
        command: "rigour init --preset government",
        color: "text-amber-400",
        bgColor: "bg-amber-400/10",
        borderColor: "border-amber-400/20",
    },
];

export const RegulatedIndustries = () => {
    return (
        <section id="industries" className="py-24 px-6 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">
                        Compliance Ready
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-4">
                        Built for Regulated Industries.
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        One command to enforce industry-specific quality gates. Deterministic. Auditable. Zero telemetry.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {industries.map((industry, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className={`glass p-8 rounded-3xl group hover:${industry.borderColor} transition-colors relative flex flex-col`}
                        >
                            <div className={`w-12 h-12 ${industry.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                                <industry.icon className={`w-6 h-6 ${industry.color}`} />
                            </div>

                            <h3 className="text-xl font-bold font-outfit mb-1">{industry.title}</h3>
                            <div className={`text-xs font-bold ${industry.color} uppercase tracking-widest mb-4`}>
                                {industry.subtitle}
                            </div>

                            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                                {industry.description}
                            </p>

                            <div className="space-y-2 mb-6">
                                {industry.gates.map((gate, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                                        <span className={industry.color}>&#x2713;</span>
                                        <span>{gate}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto pt-4 border-t border-zinc-800">
                                <code className="text-[11px] text-zinc-500 font-mono block mb-3">
                                    $ {industry.command}
                                </code>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        href="https://docs.rigour.run/concepts/industry-presets"
                        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-accent transition-colors uppercase tracking-widest"
                    >
                        View Compliance Documentation <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};
