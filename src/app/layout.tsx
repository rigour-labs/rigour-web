import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
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
  title: "Rigour Labs | Deterministic Quality Gates for AI Agents",
  description: "Rigour Labs provides local-first, zero-telemetry quality gates that force AI agents to meet strict engineering standards. Stop AI chaos and ensure production-ready code.",
  keywords: ["AI Engineering", "Quality Gates", "Code Quality", "AI Agents", "Deterministic Engineering", "Rigour Labs"],
  authors: [{ name: "Rigour Labs" }],
  openGraph: {
    title: "Rigour Labs | Deterministic Quality Gates for AI Agents",
    description: "Stop AI chaos and ensure production-ready code with Rigour Labs.",
    url: "https://rigour.run",
    siteName: "Rigour Labs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rigour Labs | Deterministic Quality Gates for AI Agents",
    description: "Quality gates that force AI agents to meet engineering standards.",
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
      </body>
    </html>
  );
}
