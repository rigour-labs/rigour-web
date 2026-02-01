"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Typewriter = ({ text, active, onComplete, delay = 70 }: { text: string; active: boolean; onComplete?: () => void, delay?: number }) => {
    const [visibleChars, setVisibleChars] = useState(0);

    useEffect(() => {
        if (!active) {
            setVisibleChars(0);
            return;
        }
        const interval = setInterval(() => {
            setVisibleChars((prev) => {
                if (prev < text.length) return prev + 1;
                clearInterval(interval);
                if (onComplete) {
                    setTimeout(onComplete, 0);
                }
                return prev;
            });
        }, delay);
        return () => clearInterval(interval);
    }, [active, text, onComplete, delay]);

    return (
        <span>
            {text.slice(0, visibleChars)}
            {active && visibleChars < text.length && <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse" />}
        </span>
    );
};

const FileScanningStream = ({ active }: { active: boolean }) => {
    const [scannedFiles, setScannedFiles] = useState<string[]>([]);
    const files = [
        "src/core/auth.ts",
        "src/api/routes.js",
        "lib/utils/logger.py",
        "src/main.py",
        "config/settings.yaml",
        "src/middleware/auth.ts",
        "tests/test_api.py"
    ];

    useEffect(() => {
        if (!active) {
            setScannedFiles([]);
            return;
        }
        let i = 0;
        const interval = setInterval(() => {
            if (i < files.length) {
                setScannedFiles(prev => [...prev.slice(-4), files[i]]);
                i++;
            } else {
                i = 0; // Loop or just finish
            }
        }, 150);
        return () => clearInterval(interval);
    }, [active]);

    if (!active) return null;

    return (
        <div className="space-y-1 font-mono text-[10px] sm:text-xs opacity-50">
            {scannedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <span className="text-accent">→</span>
                    <span>Scanning: {file}...</span>
                </div>
            ))}
        </div>
    );
};

export const LiveTerminal = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        if (step === 1) timers.push(setTimeout(() => setStep(2), 1500)); // MCP Success pause
        if (step === 3) timers.push(setTimeout(() => setStep(4), 1500)); // First check failure pause
        if (step === 5) timers.push(setTimeout(() => setStep(6), 4000)); // Agent active scan duration
        if (step === 7) timers.push(setTimeout(() => setStep(8), 2000)); // CI check pause
        if (step === 9) timers.push(setTimeout(() => setStep(0), 8000)); // Final pause before reset

        return () => timers.forEach(clearTimeout);
    }, [step]);

    return (
        <div className="p-8 pt-14 text-left font-mono text-xs sm:text-sm md:text-base leading-relaxed h-[450px] overflow-y-auto scrollbar-hide">
            {/* 1. MCP Setup */}
            <div className="text-white/40 mb-2">
                <span className="text-accent font-black">$</span>{" "}
                <Typewriter
                    text="rigour mcp setup"
                    active={step === 0}
                    onComplete={() => setStep(1)}
                />
            </div>
            {step >= 2 && (
                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-blue-400 mb-4 flex items-center gap-2">
                    <span className="font-black">✓</span>
                    <span>MCP server registered with Cursor (v0.4.1)</span>
                </motion.div>
            )}

            {/* 2. Initial Check */}
            {step >= 2 && (
                <div className="text-white/40 mb-2">
                    <span className="text-accent font-black">$</span>{" "}
                    <Typewriter
                        text="rigour check"
                        active={step === 2}
                        onComplete={() => setStep(3)}
                    />
                </div>
            )}
            {step >= 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 mb-4 border-l-2 border-zinc-800 pl-4 py-1">
                    <div className="text-yellow-400 opacity-80 decoration-dotted underline">⚠ FAIL: `src/main.py` exceeds 300 lines (542 lines)</div>
                    <div className="text-yellow-400 opacity-80 decoration-dotted underline">⚠ FAIL: TODO found in `auth.ts` (L42)</div>
                    <div className="text-red-400 font-bold">✖ ERROR: ARCH.md violation: `core` importing `cli`</div>
                </motion.div>
            )}

            {/* 3. Agent Loop */}
            {step >= 4 && (
                <div className="text-white/40 mb-2">
                    <span className="text-accent font-black">$</span>{" "}
                    <Typewriter
                        text="rigour run -- claude 'Enforce architectural boundaries'"
                        active={step === 4}
                        onComplete={() => setStep(5)}
                    />
                </div>
            )}
            {step >= 5 && (
                <div className="mb-4 space-y-3">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-400 animate-pulse flex items-center gap-2">
                        <span className="animate-spin text-lg">⟳</span>
                        <span className="font-bold">Agent active: Resolving circular dependencies...</span>
                    </motion.div>
                    <FileScanningStream active={step === 5} />
                </div>
            )}

            {/* 4. CI Verification */}
            {step >= 6 && (
                <div className="text-white/40 mb-2">
                    <span className="text-accent font-black">$</span>{" "}
                    <Typewriter
                        text="rigour check --ci"
                        active={step === 6}
                        onComplete={() => setStep(7)}
                    />
                </div>
            )}
            {step >= 8 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-bold mb-2 flex items-center gap-2">
                    <span className="w-1 h-3 bg-green-400 animate-pulse" />
                    [CI] Analyzing AST... DONE
                </motion.div>
            )}
            {step >= 9 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="text-green-950 bg-accent p-4 rounded-xl w-fit flex items-center gap-3 shadow-[0_0_30px_-5px_rgba(50,255,100,0.3)]"
                >
                    <div className="bg-green-950/20 rounded-full p-1">
                        <span className="text-xl font-black">✓</span>
                    </div>
                    <span className="font-black tracking-tight uppercase text-xs">PASS: Baseline Verified. Codebase Stabilized.</span>
                </motion.div>
            )}
        </div>
    );
};
