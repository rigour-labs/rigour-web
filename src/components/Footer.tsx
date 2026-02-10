"use client";

import React from "react";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { track } from "@vercel/analytics";

export const Footer = () => {
    return (
        <footer className="py-20 px-6 border-t border-zinc-800 bg-[#09090b]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <Link href="/" className="flex items-center gap-3 mb-6 group">
                        <div className="relative w-8 h-8 overflow-hidden rounded border border-zinc-700 group-hover:border-accent/50 transition-colors">
                            <Image
                                src="/logo.jpg"
                                alt="Rigour Labs Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-xl font-bold font-outfit tracking-tighter uppercase">
                            RIGOUR<span className="text-accent">LABS</span>
                        </span>
                    </Link>
                    <p className="text-zinc-400 max-w-sm leading-relaxed mb-8 font-medium italic">
                        The strategic engineering layer for AI agents.
                        Deterministic quality gates that stop chaos and enforce standards at scale.
                    </p>
                    <div className="flex gap-4">
                        <Link href="https://github.com/rigour-labs" onClick={() => track('social_click', { platform: 'github', location: 'footer' })} className="p-2 border border-zinc-700 rounded-lg text-zinc-400 hover:text-accent hover:border-accent/40 transition-all">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="https://twitter.com/rigour_labs" onClick={() => track('social_click', { platform: 'twitter', location: 'footer' })} className="p-2 border border-zinc-700 rounded-lg text-zinc-400 hover:text-accent hover:border-accent/40 transition-all">
                            <Twitter className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-zinc-500 mb-6">Protocol</h4>
                    <ul className="space-y-4 text-sm font-bold">
                        <li><Link href="/" onClick={() => track('footer_click', { item: 'registry' })} className="text-zinc-400 hover:text-accent transition-colors uppercase tracking-widest text-[11px]">Registry</Link></li>
                        <li><Link href="https://github.com/rigour-labs/rigour" onClick={() => track('footer_click', { item: 'open_source' })} className="text-zinc-400 hover:text-accent transition-colors uppercase tracking-widest text-[11px]" target="_blank">Open Source</Link></li>
                        <li><Link href="https://docs.rigour.run" onClick={() => track('footer_click', { item: 'documentation' })} className="text-zinc-400 hover:text-accent transition-colors uppercase tracking-widest text-[11px]" target="_blank">Documentation</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-zinc-500 mb-6">Company</h4>
                    <ul className="space-y-4 text-sm font-bold">
                        <li><Link href="#leaderboard" onClick={() => track('footer_click', { item: 'leaderboard' })} className="text-zinc-400 hover:text-accent transition-colors uppercase tracking-widest text-[11px]">Leaderboard</Link></li>
                        <li><Link href="mailto:hello@rigour.run" onClick={() => track('footer_click', { item: 'contact' })} className="text-zinc-400 hover:text-accent transition-colors uppercase tracking-widest text-[11px]">Contact</Link></li>
                        <li><Link href="/privacy" className="text-zinc-400 hover:text-accent transition-colors uppercase tracking-widest text-[11px]">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="text-zinc-400 hover:text-accent transition-colors uppercase tracking-widest text-[11px]">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                <span>© 2026 Rigour Labs. Distributed by DriftBench.</span>
                <span className="text-accent/60 tracking-[0.3em]">Engineering First. AI Second.</span>
            </div>
        </footer>
    );
};
