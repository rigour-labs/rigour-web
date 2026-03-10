"use client";

import React from "react";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { track } from "@vercel/analytics";

export const Footer = () => {
    return (
        <footer className="py-16 px-6 border-t border-zinc-800/50">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <Link href="/" className="flex items-center gap-3 mb-6 group">
                        <div className="relative w-8 h-8 overflow-hidden rounded border border-zinc-700 group-hover:border-accent/50 transition-colors">
                            <Image
                                src="/logo.png"
                                alt="Rigour Labs Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-lg font-bold font-outfit tracking-tight">
                            Rigour<span className="text-accent">Labs</span>
                        </span>
                    </Link>
                    <p className="text-zinc-500 max-w-sm leading-relaxed mb-6 text-sm">
                        AI Agent Governance. DLP, quality gates, and memory control. Zero telemetry.
                    </p>
                    <div className="flex gap-3">
                        <Link href="https://github.com/rigour-labs" onClick={() => track('social_click', { platform: 'github', location: 'footer' })} className="p-2 border border-zinc-800 rounded-lg text-zinc-500 hover:text-accent hover:border-accent/30 transition-all">
                            <Github className="w-4 h-4" />
                        </Link>
                        <Link href="https://twitter.com/rigour_labs" onClick={() => track('social_click', { platform: 'twitter', location: 'footer' })} className="p-2 border border-zinc-800 rounded-lg text-zinc-500 hover:text-accent hover:border-accent/30 transition-all">
                            <Twitter className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-5">Product</h4>
                    <ul className="space-y-3">
                        <li><Link href="https://github.com/rigour-labs/rigour" onClick={() => track('footer_click', { item: 'open_source' })} className="text-zinc-400 hover:text-accent transition-colors text-sm" target="_blank">GitHub</Link></li>
                        <li><Link href="https://docs.rigour.run" onClick={() => track('footer_click', { item: 'documentation' })} className="text-zinc-400 hover:text-accent transition-colors text-sm" target="_blank">Documentation</Link></li>
                        <li><Link href="/audits" onClick={() => track('footer_click', { item: 'audits' })} className="text-zinc-400 hover:text-accent transition-colors text-sm">Audits</Link></li>
                        <li><Link href="/nist-ai-rmf" onClick={() => track('footer_click', { item: 'nist_ai_rmf' })} className="text-zinc-400 hover:text-accent transition-colors text-sm">NIST AI RMF</Link></li>
                    </ul>
                    <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-5 mt-8">Ecosystem</h4>
                    <ul className="space-y-3">
                        <li><Link href="https://rigovo.com" onClick={() => track('footer_click', { item: 'rigovo_hr' })} className="text-zinc-400 hover:text-accent transition-colors text-sm" target="_blank">Rigovo HR</Link></li>
                        <li><Link href="https://github.com/rigovo/rigovo-virtual-team" onClick={() => track('footer_click', { item: 'rigovo_virtual_team' })} className="text-zinc-400 hover:text-accent transition-colors text-sm" target="_blank">Rigovo Virtual Team</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-5">Company</h4>
                    <ul className="space-y-3">
                        <li><Link href="mailto:hello@rigour.run" onClick={() => track('footer_click', { item: 'contact' })} className="text-zinc-400 hover:text-accent transition-colors text-sm">Contact</Link></li>
                        <li><Link href="/privacy" className="text-zinc-400 hover:text-accent transition-colors text-sm">Privacy</Link></li>
                        <li><Link href="/terms" className="text-zinc-400 hover:text-accent transition-colors text-sm">Terms</Link></li>
                        <li><Link href="https://doi.org/10.5281/zenodo.18673564" onClick={() => track('footer_click', { item: 'whitepaper' })} className="text-zinc-400 hover:text-accent transition-colors text-sm" target="_blank">Whitepaper</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                <span>&copy; 2026 Rigour Labs</span>
                <span className="text-accent/40">Govern every agent.</span>
            </div>
        </footer>
    );
};
