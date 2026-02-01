"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Activity, Activity as AlertCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

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

    const fallbackStats: ModelStats[] = [
        { name: "Anthropic / Claude 4.5 Opus", ddr: 94.2, fpr: 0.1, tasks_run: 50, status: "Completed" },
        { name: "OpenAI / GPT-4.5 Preview", ddr: 91.8, fpr: 0.2, tasks_run: 50, status: "Completed" },
        { name: "Meta / Llama 3.1 405B", ddr: 88.5, fpr: 0.5, tasks_run: 50, status: "Completed" }
    ];

    const displayStats = stats.length > 0 ? stats : fallbackStats;
    const isOffline = stats.length === 0 && !loading;

    return (
        <section className="py-24 px-6 bg-[#09090b] relative overflow-hidden" id="leaderboard">
            <div className="absolute inset-0 bg-grid opacity-[0.03] -z-10" />
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-xs font-black uppercase tracking-[0.2em] text-accent pl-1">
                                Live DriftBench Results
                            </div>
                            {isOffline && (
                                <div className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[8px] font-black text-red-500 uppercase tracking-widest">
                                    Offline / Simulated
                                </div>
                            )}
                            {!isOffline && !loading && (
                                <div className="px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-[8px] font-black text-accent uppercase tracking-widest animate-pulse">
                                    Live Connection
                                </div>
                            )}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4 tracking-tighter">
                            Model <span className="text-glow-green">Performance.</span>
                        </h2>
                        <p className="text-foreground/40 max-w-2xl font-medium">
                            The industry baseline for LLM safety. Measuring structural, logic, and security drift across 50 production scenarios.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Table */}
                    <div className="lg:col-span-8">
                        <div className="bento-card p-0 overflow-hidden border-zinc-800 bg-black/40 backdrop-blur-sm relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            <table className="w-full border-collapse relative z-10">
                                <thead className="border-b border-zinc-800">
                                    <tr className="bg-white/5 text-left">
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">Linguistic Model</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30">DDR Score</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 text-right">FPR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayStats.map((model, i) => (
                                        <motion.tr
                                            key={model.name}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="border-b border-zinc-900 last:border-0 hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-lg tracking-tight">{model.name}</div>
                                                <div className="text-[10px] font-mono text-foreground/20 uppercase tracking-widest mt-1">Evaluated: {model.tasks_run} / 50</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-2xl font-black text-accent">{model.ddr}%</div>
                                                    <div className="flex-1 h-1 w-24 bg-zinc-900 rounded-full overflow-hidden hidden sm:block">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${model.ddr}%` }}
                                                            transition={{ duration: 1, ease: "easeOut" }}
                                                            className="h-full bg-accent text-shadow-glow"
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right font-mono text-zinc-500 font-bold text-sm tracking-tighter">{model.fpr}%</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="bento-card border-zinc-800 bg-[#0c0c0e] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-accent" />
                                    </div>
                                    <h3 className="font-black text-sm uppercase tracking-widest">Active Baseline</h3>
                                </div>
                                <p className="text-sm text-foreground/40 leading-relaxed font-medium mb-8">
                                    Rigour triggers these benchmarks directly within isolated DinD containers on Railway.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-zinc-900">
                                        <span className="text-[10px] font-black uppercase text-foreground/30 tracking-widest">Scope</span>
                                        <span className="font-bold text-sm">10 OSS Repos</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-zinc-900">
                                        <span className="text-[10px] font-black uppercase text-foreground/30 tracking-widest">Confidence</span>
                                        <span className="font-bold text-sm">High (Audit Root)</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-[10px] font-black uppercase text-foreground/30 tracking-widest">Verified Tasks</span>
                                        <span className="font-bold text-sm">50 Scenarios</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href="https://github.com/rigour-labs/driftbench" target="_blank" className="bento-card bg-accent border-accent/20 text-zinc-950 group overflow-hidden relative">
                            <div className="relative z-10">
                                <Trophy className="w-8 h-8 mb-6" />
                                <h3 className="text-xl font-black tracking-tighter mb-2">Build a Scenario.</h3>
                                <p className="text-sm font-bold opacity-70 mb-6">
                                    Add your own drift patterns to the official DriftBench repository.
                                </p>
                                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                                    Contribute <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
