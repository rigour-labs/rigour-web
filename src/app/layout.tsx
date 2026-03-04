import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rigour.run"),
  title: {
    default: "Rigour Labs | AI Agent Governance — DLP, Quality Gates & Memory Control",
    template: "%s | Rigour Labs"
  },
  description: "Govern every AI coding agent from a single command. Input DLP blocks credential leaks, quality gates enforce standards, memory governance controls what agents remember. Works with Claude, Cursor, Cline, Windsurf, and Copilot. Zero telemetry.",
  keywords: [
    "AI agent governance",
    "AI agent DLP",
    "data loss prevention AI",
    "credential leak prevention",
    "AI code quality",
    "MCP server",
    "Model Context Protocol",
    "quality gates",
    "AI agent guardrails",
    "memory governance",
    "Claude integration",
    "Cursor integration",
    "Cline integration",
    "Windsurf integration",
    "Copilot governance",
    "local-first development",
    "zero telemetry",
    "Rigour Labs",
    "Rigour CLI",
    "AI drift detection",
    "OWASP LLM Top 10",
    "HIPAA AI compliance",
    "SOC2 AI governance"
  ],
  authors: [{ name: "Rigour Labs", url: "https://rigour.run" }],
  creator: "Rigour Labs",
  publisher: "Rigour Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://rigour.run",
  },
  openGraph: {
    title: "Rigour Labs | AI Agent Governance — DLP, Quality Gates & Memory Control",
    description: "Govern every AI coding agent from a single command. Input DLP, quality gates, and memory governance for Claude, Cursor, Cline, Windsurf, and Copilot.",
    url: "https://rigour.run",
    siteName: "Rigour Labs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rigour_labs",
    creator: "@rigour_labs",
    title: "Rigour Labs | AI Agent Governance — DLP + Quality Gates + Memory Control",
    description: "Govern every AI coding agent. DLP blocks credential leaks, quality gates enforce standards, memory governance controls persistence. Zero telemetry.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: "Technology",
  verification: {
    // Add your verification codes when available
    // google: 'your-google-verification-code',
  },
  other: {
    'llms.txt': '/llms.txt',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <div className="fixed inset-0 bg-grid pointer-events-none -z-10" />
        <div className="fixed inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-purple-500/5 pointer-events-none -z-10" />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Rigour Labs",
              "url": "https://rigour.run",
              "logo": "https://rigour.run/logo.png",
              "sameAs": [
                "https://github.com/rigour-labs",
                "https://twitter.com/rigour_labs",
                "https://www.npmjs.com/package/@rigour-labs/cli"
              ],
              "description": "AI Agent Governance — Input DLP, Quality Gates, and Memory Control for every coding agent. Zero telemetry.",
              "foundingDate": "2025",
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "hello@rigour.run",
                "contactType": "customer support"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Rigour Labs",
              "url": "https://rigour.run",
              "description": "AI Agent Governance — DLP, Quality Gates, and Memory Control for Claude, Cursor, Cline, Windsurf, and Copilot"
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Rigour CLI",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Windows, macOS, Linux",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "AI Agent Governance toolkit with Input DLP (29 credential patterns), real-time quality gates, and memory governance. Works with Claude, Cursor, Cline, Windsurf, and Copilot. Zero telemetry.",
              "softwareVersion": "4.2",
              "url": "https://www.npmjs.com/package/@rigour-labs/cli",
              "downloadUrl": "https://www.npmjs.com/package/@rigour-labs/cli",
              "author": {
                "@type": "Organization",
                "name": "Rigour Labs",
                "url": "https://rigour.run"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5",
                "ratingCount": "50"
              },
              "featureList": [
                "Input DLP — 29 credential patterns with entropy detection",
                "Memory Governance — block native agent memory writes",
                "Skills Governance — control agent rules and skills paths",
                "Real-Time Hooks — fire on every file write",
                "Quality Gates — deterministic PASS/FAIL enforcement",
                "Deep Analysis — LLM-powered across 40+ categories",
                "Multi-Agent Governance — scope conflict detection",
                "MCP Native Integration",
                "Zero Telemetry — 100% local",
                "OWASP LLM Top 10 — 10/10 coverage"
              ],
              "softwareRequirements": "Node.js 18+",
              "programmingLanguage": ["TypeScript", "JavaScript", "Python", "Go", "Rust", "Java"]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is Rigour Labs?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Rigour Labs provides AI Agent Governance — a three-layer protection system with Input DLP (blocks credential leaks with 29 patterns), Quality Gates (deterministic PASS/FAIL on every file write), and Memory Governance (controls what AI agents remember). It works with Claude, Cursor, Cline, Windsurf, and Copilot."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What is AI Agent DLP?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "AI Agent DLP (Data Loss Prevention) scans every input to AI coding agents for credentials — AWS keys, API tokens, database URLs, private keys, and more. Rigour's DLP includes 29 patterns, Shannon entropy detection for encoded secrets, and unicode normalization to defeat zero-width character bypasses."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does Memory Governance work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Memory Governance blocks AI agents from writing to native memory files like .cursorrules, CLAUDE.md, and .clinerules. All persistence is forced through governed channels with DLP scanning. Skills governance controls agent rules paths separately. Both are configurable via rigour.yml."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does Rigour send my code to external servers?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Rigour is 100% local-first with zero telemetry. Your code never leaves your machine. All DLP scanning, quality gates, and governance enforcement happens locally. Install with: npx @rigour-labs/cli init"
                  }
                },
                {
                  "@type": "Question",
                  "name": "Which AI coding agents does Rigour support?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Rigour supports all major AI coding agents: Claude (Claude Code, Claude Desktop), Cursor, Cline, Windsurf, and GitHub Copilot. It integrates via real-time hooks and the Model Context Protocol (MCP). One command sets up DLP, hooks, and governance for all agents."
                  }
                }
              ]
            })
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
