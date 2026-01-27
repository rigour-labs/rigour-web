"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X, Zap } from "lucide-react";

const comparisons = [
    { feature: "Pricing", coderabbit: "$30/user/month", rigour: "Free Forever", rigourWins: true },
    { feature: "Bug Detection", coderabbit: "44% (AI-based)", rigour: "100% (Deterministic)", rigourWins: true },
    { feature: "Data Privacy", coderabbit: "Cloud-based", rigour: "Local-only", rigourWins: true },
    { feature: "Review Speed", coderabbit: "Up to 20 min", rigour: "Instant", rigourWins: true },
    { feature: "Self-Hosting", coderabbit: "Enterprise only", rigour: "Default", rigourWins: true },
    { feature: "False Positives", coderabbit: "High (noisy)", rigour: "Zero", rigourWins: true },
];

export const Comparison = () => {
    return (
        <section id="comparison" className="py-24 px-6 overflow-hidden">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-wider uppercase mb-4"
                    >
                        <Zap className="w-3 h-3" />
                        Why Switch?
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-4">
                        Rigour vs CodeRabbit
                    </h2>
                    <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
                        See why developers are choosing the open-source alternative.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass rounded-3xl overflow-hidden"
                >
                    <div className="grid grid-cols-3 gap-4 p-6 border-b border-white/10 bg-white/5">
                        <div className="text-foreground/40 font-medium">Feature</div>
                        <div className="text-center text-foreground/40 font-medium">CodeRabbit</div>
                        <div className="text-center text-accent font-bold">Rigour</div>
                    </div>

                    {comparisons.map((row, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="grid grid-cols-3 gap-4 p-6 border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                            <div className="font-medium">{row.feature}</div>
                            <div className="text-center text-foreground/60 flex items-center justify-center gap-2">
                                <X className="w-4 h-4 text-red-400/60" />
                                {row.coderabbit}
                            </div>
                            <div className="text-center text-accent font-medium flex items-center justify-center gap-2">
                                <Check className="w-4 h-4" />
                                {row.rigour}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-foreground/40 text-sm mt-6"
                >
                    Data based on third-party benchmarks and public reviews. CodeRabbit is a trademark of CodeRabbit Inc.
                </motion.p>
            </div>
        </section>
    );
};
