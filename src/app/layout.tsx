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
    default: "Rigour Labs | Deterministic Quality Gates for AI Agents",
    template: "%s | Rigour Labs"
  },
  description: "Rigour Labs provides local-first, zero-telemetry quality gates that force AI coding agents (Claude, Cursor, Cline) to meet strict engineering standards. Stop AI chaos with deterministic PASS/FAIL code quality enforcement.",
  keywords: [
    "AI code quality",
    "AI governance",
    "MCP server",
    "Model Context Protocol",
    "quality gates",
    "deterministic engineering",
    "code review automation",
    "AI agent guardrails",
    "Claude integration",
    "Cursor integration",
    "Cline integration",
    "GitHub App",
    "PR review bot",
    "static analysis",
    "semantic code analysis",
    "local-first development",
    "zero telemetry",
    "Rigour Labs",
    "Rigour CLI",
    "AI coding assistant",
    "code quality enforcement"
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
    title: "Rigour Labs | Deterministic Quality Gates for AI Agents",
    description: "Stop AI chaos and ensure production-ready code. Local-first, zero-telemetry quality gates for Claude, Cursor, Cline, and GitHub.",
    url: "https://rigour.run",
    siteName: "Rigour Labs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@rigour_labs",
    creator: "@rigour_labs",
    title: "Rigour Labs | Deterministic Quality Gates for AI Agents",
    description: "Stop AI chaos. Deterministic quality gates for Claude, Cursor, and Cline. Zero telemetry.",
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
        <div className="fixed inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-accent-secondary/10 pointer-events-none -z-10" />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Rigour Labs",
              "url": "https://rigour.run",
              "logo": "https://rigour.run/logo.jpg",
              "sameAs": [
                "https://github.com/rigour-labs",
                "https://twitter.com/rigour_labs",
                "https://www.npmjs.com/package/@rigour-labs/cli"
              ],
              "description": "Deterministic Quality Gates for AI Agents. Local-first, zero-telemetry governance.",
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
              "description": "Deterministic quality gates for AI-generated code"
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
              "description": "Local-first, zero-telemetry quality gates for AI coding agents. Enforce engineering standards with deterministic PASS/FAIL analysis.",
              "softwareVersion": "2.9",
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
                "Static Policy Gates",
                "Semantic Pattern Index",
                "Security Analysis",
                "MCP Native Integration",
                "Zero Telemetry",
                "Local-Only Processing"
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
                    "text": "Rigour Labs provides deterministic quality gates for AI-generated code. Our tools force AI coding agents like Claude, Cursor, and Cline to meet strict engineering standards before marking tasks as done."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does Rigour work with AI coding assistants?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Rigour integrates via the Model Context Protocol (MCP) directly into AI coding assistants like Claude Desktop, Cursor, and Cline. It provides real-time quality feedback in the AI agent loop."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is Rigour free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, the Rigour CLI is open-source and free to use. Install it with: npx @rigour-labs/cli check"
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does Rigour send my code to external servers?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Rigour is 100% local-first with zero telemetry. Your code never leaves your machine. All analysis happens locally."
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
