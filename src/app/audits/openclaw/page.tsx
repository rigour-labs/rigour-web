import type { Metadata } from "next";
import { AuditDashboard } from "@/components/AuditDashboard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { openclawAudit } from "@/lib/audits/openclaw";

export const metadata: Metadata = {
    title: "OpenClaw Audit — 180K Stars, 2080 Violations, Score Zero",
    description:
        "We ran Rigour quality gates against OpenClaw, the most popular AI agent with 180K GitHub stars. 2,080 violations. Score: 0/100. Full interactive audit report with AST analysis, security scanning, and context drift detection.",
    keywords: [
        "OpenClaw audit",
        "OpenClaw code quality",
        "vibe coding",
        "AI agent code review",
        "OpenClaw security",
        "AI code quality audit",
        "Rigour Labs audit",
        "OpenClaw violations",
        "prototype pollution",
        "AST complexity",
        "God files",
        "AI coding agents",
        "code quality gates",
        "OpenAI acqui-hire",
        "Peter Steinberger",
        "agentic engineering",
        "AI technical debt",
    ],
    authors: [{ name: "Ashutosh Kumar", url: "https://rigour.run" }],
    creator: "Rigour Labs",
    publisher: "Rigour Labs",
    alternates: {
        canonical: "https://rigour.run/audits/openclaw",
    },
    openGraph: {
        title: "OpenClaw Audit: 180K Stars. 2,080 Violations. Score: Zero.",
        description:
            "We ran Rigour quality gates against the most popular AI agent on GitHub. The scan took 3.9 seconds. The result: 2,080 violations, 520 God files, 1,819 complexity violations, 7 security flags. Full interactive report.",
        url: "https://rigour.run/audits/openclaw",
        siteName: "Rigour Labs",
        locale: "en_US",
        type: "article",
        publishedTime: "2026-02-17T00:00:00.000Z",
        authors: ["Ashutosh Kumar"],
        tags: [
            "OpenClaw",
            "code quality",
            "AI agents",
            "vibe coding",
            "security audit",
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@rigour_labs",
        creator: "@rigour_labs",
        title: "OpenClaw Audit: 180K Stars. 2,080 Violations. Score: Zero.",
        description:
            "We ran quality gates against the most popular AI agent. 2,080 violations. 7 security flags. Full interactive report.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
        },
    },
};

// JSON-LD structured data for the audit article
const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline:
        "OpenClaw Audit: 180K Stars, 2080 Violations, Score Zero — Full Quality Gate Report",
    description:
        "A comprehensive quality gate audit of the OpenClaw AI agent codebase using Rigour. 2,080 violations found across 2,094 files including 520 oversized files, 1,819 complexity violations, and 7 prototype pollution security vectors.",
    author: {
        "@type": "Person",
        name: "Ashutosh Kumar",
        url: "https://rigour.run",
        jobTitle: "Founder & CEO",
        worksFor: {
            "@type": "Organization",
            name: "Rigour Labs",
        },
    },
    publisher: {
        "@type": "Organization",
        name: "Rigour Labs",
        url: "https://rigour.run",
        logo: {
            "@type": "ImageObject",
            url: "https://rigour.run/logo.jpg",
        },
    },
    datePublished: "2026-02-17T00:00:00.000Z",
    dateModified: "2026-02-17T00:00:00.000Z",
    url: "https://rigour.run/audits/openclaw",
    mainEntityOfPage: "https://rigour.run/audits/openclaw",
    about: {
        "@type": "SoftwareApplication",
        name: "OpenClaw",
        applicationCategory: "DeveloperApplication",
    },
    keywords:
        "OpenClaw, code quality audit, AI agent, vibe coding, security audit, prototype pollution, AST complexity",
    articleSection: "Audit Reports",
    wordCount: 2500,
    proficiencyLevel: "Expert",
};

const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        {
            "@type": "ListItem",
            position: 1,
            name: "Rigour Labs",
            item: "https://rigour.run",
        },
        {
            "@type": "ListItem",
            position: 2,
            name: "Audits",
            item: "https://rigour.run/audits",

        },
        {
            "@type": "ListItem",
            position: 3,
            name: "OpenClaw Audit",
            item: "https://rigour.run/audits/openclaw",
        },
    ],
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What score did OpenClaw get on a Rigour quality audit?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "OpenClaw scored 0 out of 100 on a Rigour quality gate audit, with 2,080 total violations across 2,094 files. The audit took 3.9 seconds to complete.",
            },
        },
        {
            "@type": "Question",
            name: "What quality issues were found in the OpenClaw codebase?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The audit found 520 oversized files (God files exceeding 400 lines), 1,819 functions with cyclomatic complexity violations, 7 prototype pollution security vectors, 60 abandoned TODO/FIXME comments, and 147 context drift inconsistencies.",
            },
        },
        {
            "@type": "Question",
            name: "How can I run a Rigour audit on my own codebase?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Install Rigour CLI with 'npx @rigour-labs/cli init' then run 'npx @rigour-labs/cli check'. It's free, open source, MIT licensed, and runs 100% locally with zero telemetry.",
            },
        },
        {
            "@type": "Question",
            name: "What is vibe coding and why does it cause quality problems?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Vibe coding is the practice of using AI coding agents to rapidly generate code by talking to AI rather than writing code manually. While it enables fast shipping, it often leads to structural debt: oversized files, high complexity, abandoned TODOs, and security patterns that would fail code review.",
            },
        },
    ],
};

export default function OpenClawAuditPage() {
    return (
        <main className="min-h-screen bg-grid">
            <Navbar />
            <AuditDashboard audit={openclawAudit} />
            <Footer />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(articleJsonLd),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbJsonLd),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqJsonLd),
                }}
            />
        </main>
    );
}
