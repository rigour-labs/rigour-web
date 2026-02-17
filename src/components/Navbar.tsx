"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";

export const Navbar = () => {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3 border-zinc-800">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-8 h-8 overflow-hidden rounded border border-zinc-800 group-hover:border-accent/50 transition-colors">
                        <Image
                            src="/logo.jpg"
                            alt="Rigour Labs Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-lg font-bold font-outfit tracking-tighter uppercase">
                        RIGOUR<span className="text-accent">LABS</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/audits" onClick={() => track('nav_click', { item: 'audits' })} className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest">Audits</Link>
                    <Link href="#leaderboard" onClick={() => track('nav_click', { item: 'leaderboard' })} className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Leaderboard</Link>
                    <Link href="https://docs.rigour.run" target="_blank" onClick={() => track('nav_click', { item: 'docs' })} className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">Docs</Link>
                    <Link href="https://github.com/rigour-labs/rigour" target="_blank" onClick={() => track('nav_click', { item: 'github' })} className="text-sm font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest">GitHub</Link>
                </div>

                <Link
                    href="#community"
                    onClick={() => track('nav_click', { item: 'registry' })}
                    className="bg-accent text-zinc-950 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
                >
                    Registry
                </Link>
            </div>
        </motion.nav>
    );
};
