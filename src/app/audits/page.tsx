import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuditIndex } from "@/components/AuditIndex";

export const metadata: Metadata = {
    title: "Audits — Rigour Labs Quality Gate Reports",
    description:
        "Public quality gate audits of popular AI-generated codebases. We run Rigour against the most popular AI agents, IDEs, and vibe-coded projects. See the results.",
    keywords: [
        "code quality audit",
        "AI code audit",
        "vibe coding audit",
        "Rigour Labs audits",
        "OpenClaw audit",
        "bolt.diy audit",
        "AI agent code quality",
        "code quality gates",
    ],
    alternates: {
        canonical: "https://rigour.run/audits",
    },
    openGraph: {
        title: "Audits — Rigour Labs Quality Gate Reports",
        description:
            "Public quality gate audits of popular AI-generated codebases. See how the most popular AI projects score on deterministic quality gates.",
        url: "https://rigour.run/audits",
        siteName: "Rigour Labs",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        site: "@rigour_labs",
        creator: "@rigour_labs",
        title: "Audits — Rigour Labs Quality Gate Reports",
        description:
            "Public quality gate audits of the most popular AI-generated codebases.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large" as const,
            "max-snippet": -1,
        },
    },
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
    ],
};

const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Rigour Labs Quality Audits",
    description:
        "A collection of public quality gate audits run against popular AI-generated codebases using Rigour deterministic quality gates.",
    url: "https://rigour.run/audits",
    publisher: {
        "@type": "Organization",
        name: "Rigour Labs",
        url: "https://rigour.run",
    },
};

export default function AuditsPage() {
    return (
        <main className="min-h-screen bg-grid">
            <Navbar />
            <AuditIndex />
            <Footer />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
            />
        </main>
    );
}
