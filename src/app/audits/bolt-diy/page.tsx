import type { Metadata } from "next";
import { AuditDashboard } from "@/components/AuditDashboard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { boltDiyAudit } from "@/lib/audits/bolt-diy";

export const metadata: Metadata = {
    title: "bolt.diy Audit — 268 Violations, Score Zero | Rigour Labs",
    description:
        "We ran Rigour quality gates against bolt.diy, Stackblitz's open-source AI IDE with 15K+ GitHub stars. 268 violations. Score: 0/100. Full interactive audit report.",
    keywords: [
        "bolt.diy audit",
        "bolt.diy code quality",
        "Stackblitz bolt",
        "AI IDE code review",
        "vibe coding",
        "AI code quality audit",
        "Rigour Labs audit",
        "bolt.diy violations",
        "code quality gates",
        "AI coding agents",
        "agentic engineering",
        "AI technical debt",
    ],
    authors: [{ name: "Ashutosh Kumar", url: "https://rigour.run" }],
    creator: "Rigour Labs",
    publisher: "Rigour Labs",
    alternates: {
        canonical: "https://rigour.run/audits/bolt-diy",
    },
    openGraph: {
        title: "bolt.diy Audit: 268 Violations. Score: Zero.",
        description:
            "We ran Rigour quality gates against bolt.diy, Stackblitz's open-source AI IDE. 268 violations across 365 files. Full interactive report.",
        url: "https://rigour.run/audits/bolt-diy",
        siteName: "Rigour Labs",
        locale: "en_US",
        type: "article",
        publishedTime: "2026-02-17T00:00:00.000Z",
        authors: ["Ashutosh Kumar"],
        tags: ["bolt.diy", "code quality", "AI IDE", "vibe coding", "security audit"],
    },
    twitter: {
        card: "summary_large_image",
        site: "@rigour_labs",
        creator: "@rigour_labs",
        title: "bolt.diy Audit: 268 Violations. Score: Zero.",
        description:
            "We ran quality gates against bolt.diy, Stackblitz's AI IDE. 268 violations. Full interactive report.",
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

const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "bolt.diy Audit: 268 Violations, Score Zero — Full Quality Gate Report",
    description:
        "A comprehensive quality gate audit of bolt.diy (Stackblitz's open-source AI IDE) using Rigour. 268 violations found across 365 files including 24 oversized files, 189 complexity violations, and 3 security concerns.",
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
    url: "https://rigour.run/audits/bolt-diy",
    mainEntityOfPage: "https://rigour.run/audits/bolt-diy",
    about: {
        "@type": "SoftwareApplication",
        name: "bolt.diy",
        applicationCategory: "DeveloperApplication",
    },
    keywords: "bolt.diy, code quality audit, AI IDE, vibe coding, Stackblitz",
    articleSection: "Audit Reports",
    wordCount: 1800,
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
            name: "bolt.diy Audit",
            item: "https://rigour.run/audits/bolt-diy",
        },
    ],
};

const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        {
            "@type": "Question",
            name: "What score did bolt.diy get on a Rigour quality audit?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "bolt.diy scored 0 out of 100 on a Rigour quality gate audit, with 268 total violations across 365 files. The audit took 325 milliseconds to complete.",
            },
        },
        {
            "@type": "Question",
            name: "How does bolt.diy compare to OpenClaw in code quality?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "Both projects scored 0/100. bolt.diy has 268 violations across 365 files (0.73 per file), while OpenClaw has 2,080 violations across 2,094 files (0.99 per file). The violation density is similar, suggesting this is a systemic property of AI-generated codebases.",
            },
        },
        {
            "@type": "Question",
            name: "What quality issues were found in bolt.diy?",
            acceptedAnswer: {
                "@type": "Answer",
                text: "The audit found 24 oversized files, 189 functions with cyclomatic complexity violations, 32 abandoned TODO/FIXME comments, and 3 security concerns including API key exposure and shell command injection patterns.",
            },
        },
    ],
};

export default function BoltDiyAuditPage() {
    return (
        <main className="min-h-screen bg-grid">
            <Navbar />
            <AuditDashboard audit={boltDiyAudit} />
            <Footer />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
        </main>
    );
}
