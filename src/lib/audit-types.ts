/* ───────── Shared Audit Data Types ───────── */

export interface AuditGate {
    name: string;
    id: string;
    status: "PASS" | "FAIL";
}

export interface AuditBreakdownItem {
    count: number;
    desc: string;
    severity: "critical" | "high" | "medium" | "low";
}

export interface AuditWorstFile {
    file: string;
    lines: number;
}

export interface AuditNarrativeSection {
    icon: "file" | "bug" | "lock" | "alert" | "git" | "code";
    title: string;
    body: string; // supports basic HTML entities like &mdash;
}

export interface AuditData {
    // Identity
    slug: string;
    projectName: string;
    projectTagline: string; // e.g. "180K Stars" or "Stackblitz's AI IDE"
    githubUrl?: string;
    githubStars?: string;

    // Scores
    score: number;
    totalViolations: number;
    filesIndexed: number;
    patternsDetected: number;
    scanDuration: string;
    scanDate: string;

    // Gates
    gatesFailed: number;
    gatesTotal: number;
    gates: AuditGate[];

    // Breakdown
    breakdown: Record<string, AuditBreakdownItem>;

    // Details
    worstFiles: AuditWorstFile[];
    securityVectors: string[];

    // Key stats displayed in dashboard header
    keyStats: Array<{
        label: string;
        value: string;
        color: string;
    }>;

    // Narrative sections
    narratives: AuditNarrativeSection[];

    // Editorial / "The Point" section
    editorial?: {
        title: string;
        paragraphs: string[];
        closingLine?: string;
    };
}

/** Audit index card for /audits listing page */
export interface AuditCard {
    slug: string;
    projectName: string;
    tagline: string;
    score: number;
    totalViolations: number;
    filesIndexed: number;
    scanDuration: string;
    scanDate: string;
    gatesFailed: number;
    gatesTotal: number;
    featured?: boolean;
}
