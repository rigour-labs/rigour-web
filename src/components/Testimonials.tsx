"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Alex River",
        role: "Lead Engineer @ FlowState",
        content: "Rigour replaced our flaky manual checks with deterministic gates. It's the only way we trust AI to touch our core services.",
        avatar: "AR"
    },
    {
        name: "Sarah Chen",
        role: "CTO @ NexusAI",
        content: "Zero telemetry was the clincher. Our code never leaves our VPC, yet we get the highest quality bar for AI contributions.",
        avatar: "SC"
    },
    {
        name: "Marcus Thorne",
        role: "Senior Dev @ Orbit",
        content: "The semantic checks caught architectural drift that our linters ignored. Essential tool for AI-augmented teams.",
        avatar: "MT"
    }
];

export const Testimonials = () => {
    return (
        <section className="py-24 px-6 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit mb-4">Trusted by the best Teams.</h2>
                    <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
                        Join hundreds of engineering teams using Rigour to scale their AI-native workflows safely.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="glass p-8 rounded-3xl relative"
                        >
                            <Quote className="absolute top-6 right-8 w-10 h-10 text-accent/10" />
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                                ))}
                            </div>
                            <p className="text-foreground/80 italic mb-8 leading-relaxed">
                                "{t.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="font-bold font-outfit">{t.name}</div>
                                    <div className="text-xs text-white/40 uppercase tracking-wider">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
