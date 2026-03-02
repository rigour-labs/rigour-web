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
            <div className="max-w-6xl mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-8 h-8 overflow-hidden rounded border border-zinc-700 group-hover:border-accent/50 transition-colors">
                        <Image
                            src="/logo.jpg"
                            alt="Rigour Labs Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-lg font-bold font-outfit tracking-tight">
                        Rigour<span className="text-accent">Labs</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/audits" onClick={() => track('nav_click', { item: 'audits' })} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Audits</Link>
                    <Link href="https://docs.rigour.run" target="_blank" onClick={() => track('nav_click', { item: 'docs' })} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Docs</Link>
                    <Link href="https://github.com/rigour-labs/rigour" target="_blank" onClick={() => track('nav_click', { item: 'github' })} className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">GitHub</Link>
                </div>

                <Link
                    href="https://docs.rigour.run"
                    target="_blank"
                    onClick={() => track('nav_click', { item: 'get_started' })}
                    className="bg-accent text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-accent-bright transition-colors"
                >
                    Get Started
                </Link>
            </div>
        </motion.nav>
    );
};
