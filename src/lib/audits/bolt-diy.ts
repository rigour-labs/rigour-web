import { AuditData } from "../audit-types";

export const boltDiyAudit: AuditData = {
    slug: "bolt-diy",
    projectName: "bolt.diy",
    projectTagline: "Stackblitz's Open-Source AI IDE. 15K+ Stars.",
    githubStars: "15K+",

    score: 0,
    totalViolations: 268,
    filesIndexed: 365,
    patternsDetected: 2840,
    scanDuration: "325ms",
    scanDate: "February 17, 2026",
    gatesFailed: 3,
    gatesTotal: 10,

    gates: [
        { name: "Environment Alignment", id: "environment-alignment", status: "PASS" },
        { name: "Retry Loop Breaker", id: "retry_loop_breaker", status: "PASS" },
        { name: "File Size", id: "file-size", status: "FAIL" },
        { name: "Content Check", id: "content-check", status: "FAIL" },
        { name: "Structure Check", id: "structure-check", status: "PASS" },
        { name: "AST Analysis", id: "ast-analysis", status: "FAIL" },
        { name: "Dependency Guardian", id: "dependency-guardian", status: "PASS" },
        { name: "Safety Rail", id: "safety-rail", status: "PASS" },
        { name: "Coverage Guard", id: "coverage-guard", status: "PASS" },
        { name: "Context Drift", id: "context-drift", status: "PASS" },
    ],

    breakdown: {
        "File Size": { count: 24, desc: "Files exceeding 400 lines", severity: "high" },
        "AST Complexity": { count: 189, desc: "Functions with cyclomatic complexity violations", severity: "critical" },
        "Abandoned TODOs": { count: 32, desc: "TODO/FIXME comments never resolved", severity: "medium" },
        "Max Params": { count: 12, desc: "Functions with too many parameters", severity: "medium" },
        "Max Methods": { count: 8, desc: "Classes with too many methods", severity: "medium" },
        "Content Violations": { count: 3, desc: "Hardcoded secrets or debug patterns", severity: "high" },
    },

    worstFiles: [
        { file: "app/components/chat/BaseChat.tsx", lines: 892 },
        { file: "app/lib/modules/llm/manager.ts", lines: 784 },
        { file: "app/components/workbench/Workbench.client.tsx", lines: 671 },
        { file: "app/routes/api.chat.ts", lines: 623 },
        { file: "app/lib/stores/workbench.ts", lines: 589 },
        { file: "app/components/sidebar/Menu.client.tsx", lines: 547 },
        { file: "app/lib/runtime/action-runner.ts", lines: 512 },
        { file: "app/utils/shell.ts", lines: 488 },
    ],

    securityVectors: [
        "app/routes/api.chat.ts — API key passed via query params in dev mode",
        "app/lib/modules/llm/manager.ts — Unvalidated provider config merge",
        "app/utils/shell.ts — Shell command construction from user input",
    ],

    keyStats: [
        { label: "Total Violations", value: "268", color: "text-red-400" },
        { label: "Gates Failed", value: "3 / 10", color: "text-orange-400" },
        { label: "Oversized Files", value: "24", color: "text-yellow-400" },
        { label: "Complexity Violations", value: "189", color: "text-red-400" },
        { label: "Security Flags", value: "3", color: "text-orange-400" },
        { label: "Abandoned TODOs", value: "32", color: "text-yellow-400" },
    ],

    narratives: [
        {
            icon: "file",
            title: "24 Oversized Files",
            body: "Twenty-four files exceed the 400-line threshold. The worst offender — BaseChat.tsx at 892 lines — is a single React component handling chat UI, message parsing, file uploads, streaming, and keyboard shortcuts all in one file. This is a common pattern in AI-generated code: everything works, but the architecture is a monolith pretending to be modular.",
        },
        {
            icon: "bug",
            title: "189 Complexity Violations",
            body: "Nearly two hundred functions exceed safe cyclomatic complexity thresholds. The LLM manager, workbench store, and action runner are the worst offenders. These are the modules that orchestrate bolt.diy's core functionality — and they are deeply nested, heavily branched, and difficult to test or modify safely.",
        },
        {
            icon: "alert",
            title: "32 Abandoned TODOs",
            body: "Thirty-two TODO and FIXME comments left behind. In a project that ships as fast as bolt.diy, these represent deferred decisions that compound into technical debt. Each one is a known gap that was punted rather than addressed.",
        },
        {
            icon: "lock",
            title: "3 Security Concerns",
            body: "Three patterns flagged by Rigour's safety rail. API key exposure via query parameters in development mode, unvalidated config merges in the LLM provider system, and shell command construction from user input. These are common in rapid prototyping but dangerous in a tool that executes code.",
        },
    ],

    editorial: {
        title: "Smaller Codebase, Same Pattern.",
        paragraphs: [
            "bolt.diy is a fraction of OpenClaw's size — 365 files vs 2,094. But the pattern is identical: AI-generated code that ships fast, passes tests, and accumulates structural debt underneath.",
            "The difference is scale, not kind. bolt.diy has 268 violations in 365 files (0.73 per file). OpenClaw has 2,080 violations in 2,094 files (0.99 per file). Both score zero. Both fail the same gates. The complexity-per-file ratio is remarkably consistent — suggesting this is a systemic property of AI-generated code, not a project-specific failing.",
        ],
        closingLine: "If both the most popular AI agent and the most popular AI IDE score zero on a quality audit, maybe the problem isn't the projects. Maybe it's the process.",
    },
};
