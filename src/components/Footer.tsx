"use client";

import React from "react";
import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
    return (
        <footer className="py-20 px-6 border-t border-white/5 bg-background">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <Link href="/" className="flex items-center gap-3 mb-6 group">
                        <div className="relative w-12 h-12 overflow-hidden rounded-xl border border-white/10 group-hover:border-accent/50 transition-colors">
                            <Image
                                src="/logo.jpg"
                                alt="Rigour Labs Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-2xl font-bold font-outfit tracking-tighter">
                            RIGOUR<span className="text-accent">LABS</span>
                        </span>
                    </Link>
                    <p className="text-foreground/40 max-w-sm leading-relaxed mb-8">
                        The strategic engineering layer for AI agents.
                        Deterministic quality gates that stop chaos and enforce standards at scale.
                    </p>
                    <div className="flex gap-4">
                        <Link href="https://github.com/rigour-labs" className="p-3 glass rounded-xl hover:text-accent transition-colors">
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link href="https://twitter.com/rigour_labs" className="p-3 glass rounded-xl hover:text-accent transition-colors">
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="p-3 glass rounded-xl hover:text-accent transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

                <div>
                    <h4 className="font-outfit font-bold mb-6">Product</h4>
                    <ul className="space-y-4 text-sm text-foreground/40">
                        <li><Link href="#" className="hover:text-accent transition-colors">Rigour CLI</Link></li>
                        <li><Link href="#" className="hover:text-accent transition-colors">MCP Server</Link></li>
                        <li><Link href="https://github.com/rigour-labs/rigour" className="hover:text-accent transition-colors" target="_blank">Open Source</Link></li>
                        <li><Link href="https://docs.rigour.run" className="hover:text-accent transition-colors" target="_blank">Documentation</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-outfit font-bold mb-6">Explore</h4>
                    <ul className="space-y-4 text-sm text-foreground/40">
                        <li><Link href="#features" className="hover:text-accent transition-colors">Features</Link></li>
                        <li><Link href="mailto:hello@rigour.run" className="hover:text-accent transition-colors">Contact</Link></li>
                        <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/20 font-bold uppercase tracking-widest">
                <span>© 2026 Rigour Labs. All rights reserved.</span>
                <span>Built with Rigour.</span>
            </div>
        </footer>
    );
};
