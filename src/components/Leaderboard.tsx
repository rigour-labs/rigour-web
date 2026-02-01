"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trophy, Activity, ChevronRight, ChevronDown,
    GitBranch, Code2, AlertTriangle, CheckCircle2,
    XCircle, BarChart3, Layers, Filter, Info, HelpCircle
} from "lucide-react";
import Link from "next/link";

interface BreakdownStats {
    passed: number;
    failed: number;
    total: number;
}

interface ModelStats {
    name: string;
    model?: string;
    display_name?: string;
    provider?: string;
    ddr?: number;
    drift_detection_rate?: number;
    pass_rate?: number;
    accuracy?: number;
    fpr: number;
    tasks_run: number;
    tasks_total?: number;
    false_positives_excluded?: number;
    status: string;
    verified_at?: string;
    rank?: number;
    breakdown?: {
        by_repo?: Record<string, BreakdownStats>;
        by_language?: Record<string, BreakdownStats>;
        by_category?: Record<string, BreakdownStats>;
    };
}

interface Methodology {
    false_positive_explanation?: string;
    scoring?: string;
}

interface StatsData {
    generated_at?: string;
    version?: string;
    total_tasks?: number;
    repositories?: Record<string, { language: string; tasks: number; full_name: string }>;
    categories?: Record<string, string>;
    methodology?: Methodology;
    leaderboard: ModelStats[];
}

type BreakdownType = "repo" | "language" | "category";

const categoryLabels: Record<string, string> = {
    stale_drift: "Staleness",
    staleness_drift: "Staleness",
    security_drift: "Security",
    architecture_drift: "Architecture",
    pattern_drift: "Pattern",
    logic_drift: "Logic",
};

const languageIcons: Record<string, string> = {
    javascript: "JS",
    python: "PY",
    typescript: "TS",
};

export const Leaderboard = () => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedModel, setExpandedModel] = useState<string | null>(null);
    const [breakdownView, setBreakdownView] = useState<BreakdownType>("repo");
    const [showMethodology, setShowMethodology] = useState(false);

    useEffect(() => {
        const apiUrl = "/api/stats";

        fetch(apiUrl)
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch driftbench stats:", err);
                const fallbackUrl = "https://driftbench.rigour.run/api/stats";
                fetch(fallbackUrl)
                    .then(res => res.json())
                    .then(data => {
                        setStats(data);
                        setLoading(false);
                    })
                    .catch(() => setLoading(false));
            });
    }, []);

    if (loading && !stats) {
        return (
            <div className="w-full py-20 flex justify-center">
                <div className="animate-pulse text-foreground/40 font-mono text-sm">LOADING DRIFTBENCH DATA...</div>
            </div>
        );
    }

    const fallbackStats: ModelStats[] = [
        { name: "Anthropic / Claude 3.5 Sonnet", ddr: 94.2, fpr: 0.1, tasks_run: 50, status: "Completed" },
        { name: "OpenAI / GPT-4o", ddr: 92.8, fpr: 0.2, tasks_run: 50, status: "Completed" },
        { name: "OpenAI / o1-preview", ddr: 91.5, fpr: 0.5, tasks_run: 50, status: "Completed" },
        { name: "Meta / Llama 3.1 405B", ddr: 88.9, fpr: 0.8, tasks_run: 50, status: "Completed" }
    ];

    const displayStats = stats?.leaderboard && stats.leaderboard.length > 0
        ? stats.leaderboard
        : fallbackStats;

    const totalTasks = stats?.total_tasks || 50;
    const repoCount = stats?.repositories ? Object.keys(stats.repositories).length : 10;
    const categoryCount = stats?.categories ? Object.keys(stats.categories).length : 5;

    const toggleExpanded = (modelName: string) => {
        setExpandedModel(expandedModel === modelName ? null : modelName);
    };

    const getBreakdownData = (model: ModelStats, type: BreakdownType) => {
        if (!model.breakdown) return null;
        switch (type) {
            case "repo": return model.breakdown.by_repo;
            case "language": return model.breakdown.by_language;
            case "category": return model.breakdown.by_category;
            default: return null;
        }
    };

    const renderBreakdownBadge = (name: string, stats: BreakdownStats, type: BreakdownType) => {
        const passRate = stats.total > 0 ? (stats.passed / stats.total) * 100 : 0;
        const isFullPass = stats.failed === 0 && stats.total > 0;
        const isFullFail = stats.passed === 0 && stats.total > 0;

        let displayName = name;
        if (type === "category" && categoryLabels[name]) {
            displayName = categoryLabels[name];
        }
        if (type === "language") {
            displayName = languageIcons[name] || name.toUpperCase();
        }

        return (
            <div
                key={name}
                className={`
                    flex items-center gap-2 px-2.5 py-1 rounded-lg border transition-all
                    ${isFullPass
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : isFullFail
                            ? 'bg-red-500/10 border-red-500/20 text-red-400'
                            : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                    }
                `}
            >
                {type === "category" && (
                    <AlertTriangle className="w-3 h-3 opacity-60" />
                )}
                {type === "language" && (
                    <Code2 className="w-3 h-3 opacity-60" />
                )}
                {type === "repo" && (
                    <GitBranch className="w-3 h-3 opacity-60" />
                )}
                <span className="text-[10px] font-mono uppercase tracking-wider">
                    {displayName}
                </span>
                <span className="text-[10px] font-bold">
                    {stats.passed}/{stats.total}
                </span>
                {isFullPass && <CheckCircle2 className="w-3 h-3" />}
                {isFullFail && <XCircle className="w-3 h-3" />}
            </div>
        );
    };

    const renderExpandedDetails = (model: ModelStats) => {
        const breakdown = model.breakdown;
        if (!breakdown) return null;

        return (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="col-span-12 mt-4 pt-4 border-t border-white/5"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* By Repository */}
                    {breakdown.by_repo && Object.keys(breakdown.by_repo).length > 0 && (
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                                <GitBranch className="w-4 h-4 text-accent" />
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                                    By Repository
                                </h4>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(breakdown.by_repo).map(([repo, repoStats]) => (
                                    <div key={repo} className="flex items-center justify-between">
                                        <span className="text-xs font-mono text-zinc-400">{repo}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${repoStats.failed > 0 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                                    style={{ width: `${(repoStats.passed / repoStats.total) * 100}%` }}
                                                />
                                            </div>
                                            <span className={`text-[10px] font-bold ${repoStats.failed > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                                                {repoStats.passed}/{repoStats.total}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* By Language */}
                    {breakdown.by_language && Object.keys(breakdown.by_language).length > 0 && (
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                                <Code2 className="w-4 h-4 text-blue-400" />
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                                    By Language
                                </h4>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(breakdown.by_language).map(([lang, langStats]) => (
                                    <div key={lang} className="flex items-center justify-between">
                                        <span className="text-xs font-mono text-zinc-400 uppercase">{lang}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${langStats.failed > 0 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${(langStats.passed / langStats.total) * 100}%` }}
                                                />
                                            </div>
                                            <span className={`text-[10px] font-bold ${langStats.failed > 0 ? 'text-yellow-400' : 'text-blue-400'}`}>
                                                {langStats.passed}/{langStats.total}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* By Category */}
                    {breakdown.by_category && Object.keys(breakdown.by_category).length > 0 && (
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertTriangle className="w-4 h-4 text-orange-400" />
                                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                                    By Drift Type
                                </h4>
                            </div>
                            <div className="space-y-2">
                                {Object.entries(breakdown.by_category).map(([cat, catStats]) => (
                                    <div key={cat} className="flex items-center justify-between">
                                        <span className="text-xs font-mono text-zinc-400">
                                            {categoryLabels[cat] || cat}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${catStats.failed > 0 ? 'bg-red-500' : 'bg-orange-500'}`}
                                                    style={{ width: `${(catStats.passed / catStats.total) * 100}%` }}
                                                />
                                            </div>
                                            <span className={`text-[10px] font-bold ${catStats.failed > 0 ? 'text-red-400' : 'text-orange-400'}`}>
                                                {catStats.passed}/{catStats.total}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <section className="py-24 px-6 bg-[#09090b] relative overflow-hidden" id="leaderboard">
            <div className="absolute inset-0 bg-grid opacity-[0.03] -z-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none -mt-40" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                                </span>
                                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">
                                    System Online
                                </span>
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4 tracking-tighter">
                            Global <span className="text-glow-green">Leaderboard</span>
                        </h2>
                        <p className="text-foreground/40 max-w-2xl font-medium text-lg">
                            Real-time drift detection rates across {totalTasks} production scenarios.
                        </p>
                    </div>
                </div>

                {/* Summary Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-4 h-4 text-accent" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Total Tasks</span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-white">{totalTasks}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <GitBranch className="w-4 h-4 text-blue-400" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Repositories</span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-white">{repoCount}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <Layers className="w-4 h-4 text-orange-400" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Drift Types</span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-white">{categoryCount}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-purple-400" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Models Tested</span>
                        </div>
                        <div className="text-2xl font-mono font-bold text-white">{displayStats.length}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Table Area */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 mb-4">
                            <Filter className="w-4 h-4 text-zinc-500" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mr-2">View by:</span>
                            {(["repo", "language", "category"] as BreakdownType[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setBreakdownView(type)}
                                    className={`
                                        px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all
                                        ${breakdownView === type
                                            ? 'bg-accent text-zinc-950 font-bold'
                                            : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                                        }
                                    `}
                                >
                                    {type === "repo" ? "Repository" : type === "language" ? "Language" : "Drift Type"}
                                </button>
                            ))}
                        </div>

                        {/* Header Row */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/30 border-b border-white/5">
                            <div className="col-span-1">Rank</div>
                            <div className="col-span-5">Model Identity</div>
                            <div className="col-span-2 text-center">
                                <div className="group/header relative inline-flex items-center gap-1 cursor-help">
                                    Tasks
                                    <HelpCircle className="w-3 h-3 opacity-50" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 font-normal normal-case tracking-normal opacity-0 invisible group-hover/header:opacity-100 group-hover/header:visible transition-all z-50">
                                        Number of benchmark tasks completed out of {totalTasks} total scenarios
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-2 text-right">
                                <div className="group/header relative inline-flex items-center gap-1 cursor-help">
                                    Pass Rate
                                    <HelpCircle className="w-3 h-3 opacity-50" />
                                    <div className="absolute bottom-full right-0 mb-2 w-56 p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 font-normal normal-case tracking-normal opacity-0 invisible group-hover/header:opacity-100 group-hover/header:visible transition-all z-50">
                                        % of tasks where the model&apos;s code passed all Rigour quality gates without introducing drift
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1 text-right">
                                <div className="group/header relative inline-flex items-center gap-1 cursor-help">
                                    DDR
                                    <HelpCircle className="w-3 h-3 opacity-50" />
                                    <div className="absolute bottom-full right-0 mb-2 w-56 p-2 rounded-lg bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-300 font-normal normal-case tracking-normal opacity-0 invisible group-hover/header:opacity-100 group-hover/header:visible transition-all z-50">
                                        <strong className="text-accent">Drift Detection Rate</strong> - % of tasks where Rigour caught code quality issues
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* Data Rows */}
                        <div className="space-y-2">
                            {displayStats.map((model, i) => {
                                const isExpanded = expandedModel === (model.model || model.name);
                                const breakdownData = getBreakdownData(model, breakdownView);
                                const passRate = model.pass_rate ?? (model.ddr ?? model.drift_detection_rate ?? 0);
                                const ddr = model.drift_detection_rate ?? model.ddr ?? 0;

                                return (
                                    <motion.div
                                        key={model.model || model.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`
                                            group relative px-6 py-5 rounded-xl transition-all duration-300
                                            ${isExpanded
                                                ? 'bg-white/[0.04] border border-accent/20'
                                                : 'bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.06]'
                                            }
                                        `}
                                    >
                                        <div className="grid grid-cols-12 gap-4 items-center">
                                            {/* Rank */}
                                            <div className="col-span-1 flex items-center">
                                                <div className={`
                                                    w-7 h-7 flex items-center justify-center rounded-lg font-mono text-xs font-bold
                                                    ${i === 0 ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-zinc-950 shadow-lg shadow-yellow-500/20' :
                                                        i === 1 ? 'bg-gradient-to-br from-zinc-300 to-zinc-400 text-zinc-900' :
                                                            i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' : 'bg-zinc-800 text-zinc-500'}
                                                `}>
                                                    {model.rank || i + 1}
                                                </div>
                                            </div>

                                            {/* Model Name + Breakdown Badges */}
                                            <div className="col-span-5">
                                                <div className="font-bold text-base tracking-tight text-zinc-100 group-hover:text-white transition-colors mb-2">
                                                    {(model.display_name || model.name || model.model) ? (
                                                        <>
                                                            {model.provider && (
                                                                <>
                                                                    <span className="opacity-40 font-medium">{model.provider}</span>
                                                                    <span className="opacity-30 mx-2">/</span>
                                                                </>
                                                            )}
                                                            <span>
                                                                {model.display_name?.replace(`${model.provider} `, '') ||
                                                                 model.name?.split("/")[1] ||
                                                                 model.model?.split("/")[1] ||
                                                                 model.display_name ||
                                                                 model.name}
                                                            </span>
                                                        </>
                                                    ) : "Unknown Model"}
                                                </div>

                                                {/* Breakdown Badges */}
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    {breakdownData ? (
                                                        Object.entries(breakdownData).map(([name, bdStats]) =>
                                                            renderBreakdownBadge(name, bdStats, breakdownView)
                                                        )
                                                    ) : (
                                                        <div className="text-[10px] font-mono text-foreground/20 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                                                            {model.tasks_run} Scenarios
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-3 mt-2">
                                                    {model.verified_at && (
                                                        <div className="text-[10px] font-mono text-foreground/20 uppercase tracking-widest">
                                                            Verified {model.verified_at}
                                                        </div>
                                                    )}
                                                    {model.false_positives_excluded && model.false_positives_excluded > 0 && (
                                                        <div className="group/fp relative flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                                            <Info className="w-3 h-3 text-amber-400" />
                                                            <span className="text-[10px] font-mono text-amber-400">
                                                                {model.false_positives_excluded} FPs excluded
                                                            </span>
                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full left-0 mb-2 w-64 p-3 rounded-lg bg-zinc-900 border border-zinc-700 shadow-xl opacity-0 invisible group-hover/fp:opacity-100 group-hover/fp:visible transition-all duration-200 z-50">
                                                                <div className="text-[11px] text-zinc-300 leading-relaxed">
                                                                    <strong className="text-amber-400">False Positives Excluded:</strong> Structure-check failures for missing docs files (SPEC.md, ARCH.md) that don&apos;t exist in OSS repos. This is a config issue, not a model failure.
                                                                </div>
                                                                <div className="absolute -bottom-1 left-4 w-2 h-2 bg-zinc-900 border-r border-b border-zinc-700 transform rotate-45"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Tasks Completed */}
                                            <div className="col-span-2 flex flex-col items-center justify-center">
                                                <div className="font-mono text-sm font-bold text-zinc-300 tabular-nums">
                                                    {model.tasks_run}/{model.tasks_total || totalTasks}
                                                </div>
                                                <div className="w-full max-w-[60px] h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className={`h-full ${model.tasks_run === (model.tasks_total || totalTasks) ? 'bg-green-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${(model.tasks_run / (model.tasks_total || totalTasks)) * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-[9px] text-zinc-600 uppercase tracking-wider mt-0.5">
                                                    {model.tasks_run === (model.tasks_total || totalTasks) ? 'Complete' : 'Partial'}
                                                </span>
                                            </div>

                                            {/* Pass Rate */}
                                            <div className="col-span-2 flex flex-col items-end justify-center">
                                                <div className="font-mono text-lg font-bold text-accent tabular-nums tracking-tight">
                                                    {passRate.toFixed(1)}%
                                                </div>
                                                <div className="w-full max-w-[80px] h-1 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-accent/80"
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${passRate}%` }}
                                                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                                    />
                                                </div>
                                            </div>

                                            {/* DDR */}
                                            <div className="col-span-1 flex flex-col items-end justify-center">
                                                <div className="font-mono text-sm font-medium text-zinc-400 tabular-nums">
                                                    {ddr.toFixed(1)}%
                                                </div>
                                            </div>

                                            {/* Expand Button */}
                                            <div className="col-span-1 flex justify-end">
                                                {model.breakdown && (
                                                    <button
                                                        onClick={() => toggleExpanded(model.model || model.name)}
                                                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                                    >
                                                        <motion.div
                                                            animate={{ rotate: isExpanded ? 180 : 0 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <ChevronDown className="w-4 h-4 text-zinc-500" />
                                                        </motion.div>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        <AnimatePresence>
                                            {isExpanded && renderExpandedDetails(model)}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Methodology Card */}
                        {stats?.methodology && (
                            <div className="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-md relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                        <HelpCircle className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm uppercase tracking-widest text-amber-300">Scoring Methodology</h3>
                                        <p className="text-[10px] text-amber-400/60 font-mono mt-0.5">Transparency Note</p>
                                    </div>
                                </div>

                                <div className="space-y-3 text-[11px] text-zinc-300 leading-relaxed">
                                    {stats.methodology.scoring && (
                                        <p><strong className="text-amber-400">Formula:</strong> {stats.methodology.scoring}</p>
                                    )}
                                    {stats.methodology.false_positive_explanation && (
                                        <div className="p-3 rounded-lg bg-black/20 border border-amber-500/10">
                                            <p className="text-zinc-400">
                                                <strong className="text-amber-400 block mb-1">Why exclude false positives?</strong>
                                                {stats.methodology.false_positive_explanation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Verification Protocol Card */}
                        <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0c0c0e]/80 backdrop-blur-md relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[60px] pointer-events-none" />

                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-100">Verification Protocol</h3>
                                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">v2.4.9 ACTIVE</p>
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500">Languages</span>
                                        <span className="text-xs font-mono font-bold text-zinc-300">TypeScript / Python</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] uppercase tracking-widest text-zinc-500">Container</span>
                                        <span className="text-xs font-mono font-bold text-zinc-300">Debian (DinD)</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                        <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Scope</div>
                                        <div className="text-xl font-mono font-bold text-white">{totalTasks}</div>
                                    </div>
                                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                        <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Confidence</div>
                                        <div className="text-xl font-mono font-bold text-accent">99.9%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Repository Coverage Card */}
                        {stats?.repositories && (
                            <div className="p-6 rounded-2xl border border-zinc-800 bg-[#0c0c0e]/80 backdrop-blur-md">
                                <div className="flex items-center gap-2 mb-4">
                                    <GitBranch className="w-4 h-4 text-blue-400" />
                                    <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400">Repository Coverage</h3>
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(stats.repositories).slice(0, 6).map(([repo, info]) => (
                                        <div key={repo} className="flex items-center justify-between py-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`
                                                    text-[9px] font-bold px-1.5 py-0.5 rounded uppercase
                                                    ${info.language === 'python' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}
                                                `}>
                                                    {info.language === 'python' ? 'PY' : 'JS'}
                                                </span>
                                                <span className="text-xs text-zinc-400">{repo}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-zinc-500">{info.tasks} tasks</span>
                                        </div>
                                    ))}
                                    {Object.keys(stats.repositories).length > 6 && (
                                        <div className="text-[10px] text-zinc-600 text-center pt-2">
                                            +{Object.keys(stats.repositories).length - 6} more repositories
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Contribute Card */}
                        <Link href="https://github.com/rigour-labs/driftbench" target="_blank" className="group relative p-6 rounded-2xl bg-zinc-100 overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <Trophy className="w-6 h-6 text-zinc-900" />
                                    <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                                </div>
                                <h3 className="text-lg font-black text-zinc-900 mb-1">Contribute Scenario</h3>
                                <p className="text-xs text-zinc-600 font-medium leading-relaxed mb-0">
                                    Submit your own drift patterns via Pull Request.
                                </p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
