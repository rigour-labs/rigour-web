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
  description: "Rigour Labs provides local-first, zero-telemetry quality gates that force AI agents to meet strict engineering standards. Achieve 100% deterministic code quality for Cursor, Claude, and VS Code.",
  keywords: [
    "AI Governance",
    "MCP Server",
    "Quality Gates",
    "Deterministic Engineering",
    "Code Review for AI",
    "Rigour Labs",
    "AI Agent Guardrails",
    "Software Supply Chain Security"
  ],
  authors: [{ name: "Rigour Labs" }],
  creator: "Rigour Labs",
  publisher: "Rigour Labs",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rigour Labs | Deterministic Quality Gates for AI Agents",
    description: "Stop AI chaos and ensure production-ready code with Rigour Labs. Local-first, zero-telemetry governance.",
    url: "https://rigour.run",
    siteName: "Rigour Labs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png", // Ensure this exists or use a generic one
        width: 1200,
        height: 630,
        alt: "Rigour Labs Governance Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rigour Labs | Deterministic Quality Gates for AI Agents",
    description: "Quality gates that force AI agents to meet engineering standards.",
    images: ["/og-image.png"],
  },
  category: "Technology",
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
              "logo": "https://rigour.run/logo.png",
              "sameAs": [
                "https://github.com/rigour-labs",
                "https://x.com/rigourlabs"
              ],
              "description": "Deterministic Quality Gates for AI Agents. Local-first, zero-telemetry governance."
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
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://rigour.run/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
