"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export const Navbar = () => {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-6 py-3 border-white/10">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-white/10 group-hover:border-accent/50 transition-colors">
                        <Image
                            src="/logo.jpg"
                            alt="Rigour Labs Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span className="text-xl font-bold font-outfit tracking-tighter">
                        RIGOUR<span className="text-accent">LABS</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors">Features</Link>
                    <Link href="#how-it-works" className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors">How it Works</Link>
                    <Link href="https://docs.rigour.run" className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors">Docs</Link>
                </div>

                <Link
                    href="#community"
                    className="bg-accent text-background px-5 py-2 rounded-xl text-sm font-bold hover:scale-105 transition-transform active:scale-95"
                >
                    Community
                </Link>
            </div>
        </motion.nav>
    );
};
