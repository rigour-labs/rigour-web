"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Activity, AlertCircle, ChevronRight } from "lucide-react";

interface ModelStats {
    name: string;
    ddr: number;
    fpr: number;
    tasks_run: number;
    status: string;
}

export const Leaderboard = () => {
    const [stats, setStats] = useState<ModelStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_DRIFTBENCH_API_URL || "https://driftbench.rigour.run";
        fetch(`${apiUrl}/api/stats`)
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch driftbench stats:", err);
                setLoading(false);
            });
    }, []);

    if (loading && stats.length === 0) {
        return (
            <div className="w-full py-20 flex justify-center">
                <div className="animate-pulse text-foreground/40 font-mono text-sm">LOADING DRIFTBENCH DATA...</div>
            </div>
        );
    }

    return (
        <section className="py-24 px-6 bg-background relative overflow-hidden" id="leaderboard">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-wider uppercase mb-4"
                        >
                            <Trophy className="w-3 h-3" />
                            Live DriftBench Results
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4">
                            Model <span className="text-accent">DDR</span> Leaderboard
                        </h2>
                        <p className="text-foreground/60 max-w-2xl">
                            Real-time Drift Detection Rate (DDR) metrics. Measuring how often SOTA models introduce
                            unintended structural or security drift that current unit tests miss.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Table */}
                    <div className="lg:col-span-8">
                        <div className="glass rounded-3xl border-white/10 overflow-hidden">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-white/5 text-left">
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">Model</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40">DDR Score</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-white/40 text-right">FPR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.map((model, i) => (
                                        <motion.tr
                                            key={model.name}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-6 font-bold text-lg">{model.name}</td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-3xl font-extrabold text-accent">{model.ddr}%</div>
                                                    <div className="flex-1 h-1.5 w-24 bg-white/5 rounded-full overflow-hidden hidden sm:block">
                                                        <div
                                                            className="h-full bg-accent text-glow"
                                                            style={{ width: `${model.ddr}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right font-mono text-green-400 font-bold">{model.fpr}%</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="glass p-8 rounded-3xl border-white/10 flex-1">
                            <Activity className="w-8 h-8 text-accent mb-6" />
                            <h3 className="text-xl font-bold mb-4">Baseline Active</h3>
                            <p className="text-sm text-foreground/50 leading-relaxed mb-6">
                                The engine is running 50 specific tasks across 10 repositories.
                                Drift detection is calibrated against project-specific standard gates.
                            </p>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Total Repository Scope</span>
                                    <span className="font-bold">10 OSS Repos</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/40">Active Test Cases</span>
                                    <span className="font-bold">50 Tasks</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-accent p-8 rounded-3xl text-background">
                            <AlertCircle className="w-8 h-8 mb-6" />
                            <h3 className="text-xl font-extrabold mb-2">Notice a Drift?</h3>
                            <p className="text-sm font-medium mb-6 opacity-80">
                                View the audit logs in Rigour Studio for full trace analysis of model failures.
                            </p>
                            <button className="flex items-center gap-2 font-black text-sm uppercase tracking-widest">
                                Open Studio <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
