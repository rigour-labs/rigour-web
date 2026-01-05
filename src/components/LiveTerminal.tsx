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

export const LiveTerminal = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        if (step === 1) timers.push(setTimeout(() => setStep(2), 1500)); // MCP Success pause
        if (step === 3) timers.push(setTimeout(() => setStep(4), 1500)); // First check failure pause
        if (step === 5) timers.push(setTimeout(() => setStep(6), 4000)); // Agent active pause
        if (step === 7) timers.push(setTimeout(() => setStep(8), 2000)); // CI check pause
        if (step === 9) timers.push(setTimeout(() => setStep(0), 8000)); // Final pause before reset

        return () => timers.forEach(clearTimeout);
    }, [step]);

    return (
        <div className="p-8 pt-14 text-left font-mono text-xs sm:text-sm md:text-base leading-relaxed h-[450px] overflow-y-auto scrollbar-hide">
            {/* 1. MCP Setup */}
            <div className="text-white/40 mb-2">
                <span className="text-accent">$</span>{" "}
                <Typewriter
                    text="rigour mcp setup"
                    active={step === 0}
                    onComplete={() => setStep(1)}
                />
            </div>
            {step >= 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-400 mb-4">
                    ✓ MCP server registered with Cursor (v0.4.1)
                </motion.div>
            )}

            {/* 2. Initial Check */}
            {step >= 2 && (
                <div className="text-white/40 mb-2">
                    <span className="text-accent">$</span>{" "}
                    <Typewriter
                        text="rigour check"
                        active={step === 2}
                        onComplete={() => setStep(3)}
                    />
                </div>
            )}
            {step >= 4 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1 mb-4">
                    <div className="text-yellow-400">⚠ FAIL: `src/main.py` exceeds 300 lines (542 lines)</div>
                    <div className="text-yellow-400">⚠ FAIL: TODO found in `auth.ts` (L42)</div>
                    <div className="text-red-400">✖ ERROR: ARCH.md violation: `core` importing `cli`</div>
                </motion.div>
            )}

            {/* 3. Agent Loop */}
            {step >= 4 && (
                <div className="text-white/40 mb-2">
                    <span className="text-accent">$</span>{" "}
                    <Typewriter
                        text="rigour run -- claude 'Enforce architectural boundaries'"
                        active={step === 4}
                        onComplete={() => setStep(5)}
                    />
                </div>
            )}
            {step >= 6 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-400 animate-pulse flex items-center gap-2 mb-4">
                    <span className="animate-spin text-lg">⟳</span>
                    Agent active: Resolving circular dependencies...
                </motion.div>
            )}

            {/* 4. CI Verification */}
            {step >= 6 && (
                <div className="text-white/40 mb-2">
                    <span className="text-accent">$</span>{" "}
                    <Typewriter
                        text="rigour check --ci"
                        active={step === 6}
                        onComplete={() => setStep(7)}
                    />
                </div>
            )}
            {step >= 8 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 font-bold mb-2">
                    [CI] Analyzing AST... DONE
                </motion.div>
            )}
            {step >= 9 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-green-400 border border-green-400/20 bg-green-400/5 p-4 rounded-xl w-fit flex items-center gap-2"
                >
                    <span className="text-xl">✓</span>
                    <span>PASS: All gates met. Codebase verified.</span>
                </motion.div>
            )}
        </div>
    );
};
