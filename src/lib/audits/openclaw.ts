import { AuditData } from "../audit-types";

export const openclawAudit: AuditData = {
    slug: "openclaw",
    projectName: "OpenClaw",
    projectTagline: "180K Stars. Acqui-hired by OpenAI.",
    githubStars: "180K",

    score: 0,
    totalViolations: 2080,
    filesIndexed: 2094,
    patternsDetected: 14010,
    scanDuration: "3.9s",
    scanDate: "February 17, 2026",
    gatesFailed: 4,
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
        { name: "Context Drift", id: "context-drift", status: "FAIL" },
    ],

    breakdown: {
        "File Size": { count: 520, desc: "Files exceeding 400 lines", severity: "high" },
        "AST Complexity": { count: 1819, desc: "Functions with cyclomatic complexity violations", severity: "critical" },
        "Context Drift": { count: 147, desc: "Import pattern & naming inconsistencies", severity: "medium" },
        "Abandoned TODOs": { count: 60, desc: "TODO/FIXME comments never resolved", severity: "medium" },
        "Max Params": { count: 27, desc: "Functions with too many parameters", severity: "medium" },
        "Max Methods": { count: 19, desc: "Classes with too many methods", severity: "medium" },
        "Security: Prototype Pollution": { count: 7, desc: "Object.assign patterns in sensitive areas", severity: "critical" },
    },

    worstFiles: [
        { file: "docs/gateway/configuration-reference.md", lines: 3333 },
        { file: "docs/help/faq.md", lines: 2860 },
        { file: "CHANGELOG.md", lines: 2198 },
        { file: "tests/security-audit.test.ts", lines: 2169 },
        { file: "tests/telegram-bot.test.ts", lines: 1899 },
        { file: "src/config/io.ts", lines: 1134 },
        { file: "src/heartbeat-runner.ts", lines: 1124 },
        { file: "docs/cli/index.md", lines: 1037 },
    ],

    securityVectors: [
        "extensions/memory-lancedb/index.ts — Object.assign on embeddings data",
        "src/cron/agent-runner.ts — Object.assign on scheduled task payloads",
        "src/agent/execution-pipeline.ts — Prototype pollution in tool results merge",
        "src/gateway/middleware.ts — Unvalidated object spread in request handler",
        "src/memory/manager.ts — Deep merge without prototype check",
        "extensions/voice-call/index.ts — Config merge from external source",
        "src/tools/browser.ts — Object spread on page extraction data",
    ],

    keyStats: [
        { label: "Total Violations", value: "2,080", color: "text-red-400" },
        { label: "Gates Failed", value: "4 / 10", color: "text-orange-400" },
        { label: "God Files", value: "520", color: "text-yellow-400" },
        { label: "Complexity Violations", value: "1,819", color: "text-red-400" },
        { label: "Security Flags", value: "7", color: "text-red-400" },
        { label: "Context Drift", value: "147", color: "text-yellow-400" },
    ],

    narratives: [
        {
            icon: "file",
            title: "520 God Files",
            body: "Over half a thousand files in the OpenClaw codebase exceed 400 lines. When a single file reaches 3,000+ lines, no human and no AI agent can reason about it effectively. This is how bugs hide. This is how security vulnerabilities survive code review.",
        },
        {
            icon: "bug",
            title: "1,819 Complexity Violations",
            body: "Nearly two thousand functions in the codebase have cyclomatic complexity that exceeds safe thresholds. High complexity means more execution paths, more edge cases, more places for bugs to live. These are not in obscure utility files — they are in core modules: the agent runner, the gateway server, the browser automation layer, and the memory manager.",
        },
        {
            icon: "lock",
            title: "7 Prototype Pollution Vectors",
            body: "Rigour flagged 7 instances of Object.assign({}, ...) patterns that can propagate prototype pollution — a well-known JavaScript security vulnerability. These are in sensitive areas: the memory/embeddings system, the cron agent runner, and the agent execution pipeline.",
        },
        {
            icon: "alert",
            title: "60 Abandoned TODOs",
            body: "Sixty TODO and FIXME comments scattered across the codebase. Each one is a promise an AI agent made to itself and never kept. This is the signature of vibe coding at scale — optimizing for appearing done, not for being done.",
        },
        {
            icon: "git",
            title: "147 Context Drift Issues",
            body: "Import patterns mixing relative and absolute styles across 644 files. Environment variable naming that drifts from project conventions. These are the kind of inconsistencies that accumulate when multiple AI agents work on a codebase simultaneously without architectural guardrails.",
        },
    ],

    editorial: {
        title: "This Is Not About OpenClaw.",
        paragraphs: [
            "What Steinberger built solo is extraordinary. And OpenClaw is open source — the code is there for anyone to improve.",
            "This is about a pattern happening everywhere right now. AI coding agents ship code fast. They claim \"done\" while leaving behind complexity violations, God files, abandoned TODOs, and security patterns that would fail any serious code review. Tests might pass. The app might work. But the codebase is accumulating structural debt at a rate no human team can repay.",
        ],
        closingLine: "If the most popular AI agent in the world — with 180,000 stars and OpenAI's backing — scores zero on a basic quality audit, what does your vibe-coded project look like?",
    },
};
