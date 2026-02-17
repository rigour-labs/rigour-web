import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "NIST AI RMF Alignment | Rigour Labs",
  description: "How Rigour's deterministic quality gates map to the NIST AI Risk Management Framework (AI RMF 1.0) — GOVERN, MAP, MEASURE, and MANAGE functions.",
  openGraph: {
    title: "NIST AI RMF Alignment | Rigour Labs",
    description: "Deterministic quality gates mapped to the NIST AI Risk Management Framework. Local-first governance for AI-generated code.",
    url: "https://rigour.run/nist-ai-rmf",
  },
};

const functions = [
  {
    id: "govern",
    title: "GOVERN",
    subtitle: "Policies, Accountability & Culture",
    color: "text-blue-400",
    borderColor: "border-blue-400/30",
    bgColor: "bg-blue-400/10",
    description:
      "Rigour enforces organizational AI policies as deterministic code — not documents that drift. Every quality gate is policy-as-code, version-controlled, and auditable.",
    mappings: [
      {
        rmf: "GOVERN 1 — Policies for AI risk management",
        rigour: "rigour.yml configuration defines all quality thresholds, security rules, and architectural boundaries as declarative YAML. Changes are tracked in version control with full git history.",
      },
      {
        rmf: "GOVERN 2 — Accountability structures",
        rigour: "Agent Team Governance enforces strict task ownership — each AI agent registers its scope, and Rigour prevents unauthorized file modifications. Handoff verification ensures context integrity between agents.",
      },
      {
        rmf: "GOVERN 3 — Workforce diversity of perspective",
        rigour: "Multi-agent sessions support cross-agent pattern checking, preventing groupthink. Provenance tags (ai-drift, traditional, security, governance) attribute every violation to its origin, ensuring diverse quality signals.",
      },
      {
        rmf: "GOVERN 4 — Organizational commitment to risk culture",
        rigour: "Industry Presets (healthcare, fintech, government, devsecops) encode risk-aware defaults. One command — rigour init --preset government — applies NIST-aligned strictness across an entire codebase.",
      },
    ],
  },
  {
    id: "map",
    title: "MAP",
    subtitle: "Context, Risk Identification & Categorization",
    color: "text-emerald-400",
    borderColor: "border-emerald-400/30",
    bgColor: "bg-emerald-400/10",
    description:
      "Rigour automatically maps the risk context of AI-generated code — identifying what type of system it is, what regulations apply, and where AI-specific risks exist.",
    mappings: [
      {
        rmf: "MAP 1 — Intended context of AI system use",
        rigour: "Project detection automatically identifies the codebase type (API, UI, infrastructure, data pipeline) and applies appropriate quality thresholds. Regulated industry presets further contextualize risk for healthcare (HIPAA), finance (SOC2/PCI), and government (FedRAMP/NIST) systems.",
      },
      {
        rmf: "MAP 2 — AI system categorization",
        rigour: "Provenance tagging categorizes every quality violation by origin: ai-drift (hallucinated imports, unhandled promises), traditional (complexity, file size), security (SQL injection, XSS, hardcoded secrets), and governance (missing documentation, checkpoint failures).",
      },
      {
        rmf: "MAP 3 — AI-specific risks identification",
        rigour: "AI-Native Gates detect risks unique to AI-generated code: hallucinated imports (packages that don't exist in the dependency manifest), floating promises, unsafe async patterns, and context window degradation artifacts — across 6 languages.",
      },
      {
        rmf: "MAP 5 — Impact characterization",
        rigour: "Severity-weighted scoring (Critical: -20, High: -10, Medium: -5, Low: -2) ensures high-impact violations are surfaced first. The Two-Score System separates ai_health_score from structural_score for precise impact attribution.",
      },
    ],
  },
  {
    id: "measure",
    title: "MEASURE",
    subtitle: "Metrics, Monitoring & Assessment",
    color: "text-amber-400",
    borderColor: "border-amber-400/30",
    bgColor: "bg-amber-400/10",
    description:
      "Rigour provides continuous, deterministic measurement of AI code quality — not subjective reviews, but repeatable PASS/FAIL gates with full audit trails.",
    mappings: [
      {
        rmf: "MEASURE 1 — Appropriate methods and metrics",
        rigour: "12+ built-in quality gates including cyclomatic complexity, function length, parameter count, file size, dependency analysis, architecture boundary enforcement, and security pattern detection. All gates produce deterministic, repeatable results.",
      },
      {
        rmf: "MEASURE 2 — AI systems evaluated for trustworthiness",
        rigour: "Every rigour check produces a scored report (0-100) with severity breakdown, provenance attribution, and per-file violation details. The Two-Score System independently measures AI health and structural quality.",
      },
      {
        rmf: "MEASURE 3 — Mechanisms for tracking metrics over time",
        rigour: "Score Trending records every check result to .rigour/score-history.jsonl. After 3+ runs, trend analysis classifies quality trajectory as improving, stable, or degrading — enabling regression detection and compliance dashboards.",
      },
      {
        rmf: "MEASURE 4 — Feedback from internal and external sources",
        rigour: "Fix Packets provide actionable, structured feedback for every violation — including file path, line number, severity, hint text, and provenance tag. Agents and humans receive identical feedback, ensuring consistency.",
      },
    ],
  },
  {
    id: "manage",
    title: "MANAGE",
    subtitle: "Response, Recovery & Communication",
    color: "text-rose-400",
    borderColor: "border-rose-400/30",
    bgColor: "bg-rose-400/10",
    description:
      "Rigour enforces bounded, recoverable AI workflows — preventing runaway agents, limiting blast radius, and providing exportable audit artifacts for compliance reporting.",
    mappings: [
      {
        rmf: "MANAGE 1 — AI risks managed through response plans",
        rigour: "Supervised Mode (rigour run-supervised) creates bounded retry loops: run command → check gates → generate fix packet → retry. Max retries prevent infinite loops. Checkpoint Supervision monitors long-running agents with quality thresholds and drift detection.",
      },
      {
        rmf: "MANAGE 2 — AI risk response strategies",
        rigour: "Safety Gates enforce blast radius limits: max_files_changed_per_cycle (default: 10) prevents mass modifications, protected_paths blocks changes to critical files (.github/**, docs/**, rigour.yml), and security gates block commits above severity threshold.",
      },
      {
        rmf: "MANAGE 3 — AI risk management processes and outcomes documented",
        rigour: "Export Audit (rigour export-audit) generates compliance-ready audit packages in JSON or Markdown — including score trends, severity breakdowns, provenance attribution, gate results, and full violation details. Directly consumable by compliance officers and auditors.",
      },
      {
        rmf: "MANAGE 4 — AI risks communicated to relevant stakeholders",
        rigour: "Every quality gate check produces structured output readable by both humans (CLI terminal, Markdown reports) and machines (JSON, Fix Packets, MCP protocol). GitHub PR integration posts results directly into code review workflows.",
      },
    ],
  },
];

export default function NistAiRmfPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link href="/" className="text-accent hover:text-accent/80 transition-colors">
            &larr; Back to Rigour Labs
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">
          Compliance Mapping
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-outfit text-foreground mb-6">
          NIST AI RMF 1.0 Alignment
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
          This document maps Rigour&apos;s deterministic quality gates to the four core functions
          of the{" "}
          <a
            href="https://www.nist.gov/artificial-intelligence/executive-order-safe-secure-and-trustworthy-artificial-intelligence"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            NIST AI Risk Management Framework (AI RMF 1.0)
          </a>
          . Rigour is an open-source, local-first tool that enforces engineering quality standards
          on AI-generated code — providing measurable, auditable governance without sending code
          to external servers.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {functions.map((fn) => (
            <a
              key={fn.id}
              href={`#${fn.id}`}
              className={`p-4 rounded-xl border ${fn.borderColor} ${fn.bgColor} hover:scale-[1.02] transition-transform text-center`}
            >
              <div className={`text-lg font-bold font-outfit ${fn.color}`}>{fn.title}</div>
              <div className="text-xs text-zinc-500 mt-1">{fn.subtitle.split(" — ")[0]}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Functions Detail */}
      <article className="max-w-5xl mx-auto px-6 pb-16">
        {functions.map((fn, fnIndex) => (
          <section key={fn.id} id={fn.id} className={`mb-16 ${fnIndex > 0 ? "pt-8 border-t border-zinc-800/50" : ""}`}>
            <div className="mb-8">
              <div className={`inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${fn.bgColor} ${fn.color} mb-4`}>
                {fn.title}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-outfit text-foreground mb-2">
                {fn.subtitle}
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-3xl">
                {fn.description}
              </p>
            </div>

            <div className="space-y-6">
              {fn.mappings.map((mapping, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border ${fn.borderColor} bg-zinc-900/50 p-6`}
                >
                  <div className={`text-sm font-bold ${fn.color} mb-3`}>
                    {mapping.rmf}
                  </div>
                  <div className="text-sm text-zinc-300 leading-relaxed">
                    <span className="text-zinc-500 font-bold uppercase text-xs tracking-widest mr-2">Rigour:</span>
                    {mapping.rigour}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Summary Table */}
        <section className="pt-8 border-t border-zinc-800/50 mb-16">
          <h2 className="text-2xl font-bold font-outfit text-foreground mb-6">
            Coverage Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-3 px-4 text-zinc-400 font-bold uppercase tracking-widest text-xs">RMF Function</th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-bold uppercase tracking-widest text-xs">Rigour Capabilities</th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-bold uppercase tracking-widest text-xs">Key Features</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 px-4 font-bold text-blue-400">GOVERN</td>
                  <td className="py-3 px-4">Policy-as-code, agent governance, provenance attribution</td>
                  <td className="py-3 px-4 text-zinc-500">rigour.yml, agent_team, industry presets</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 px-4 font-bold text-emerald-400">MAP</td>
                  <td className="py-3 px-4">Auto-detection, risk categorization, AI-specific risk identification</td>
                  <td className="py-3 px-4 text-zinc-500">Provenance tags, AI-native gates, severity scoring</td>
                </tr>
                <tr className="border-b border-zinc-800/50">
                  <td className="py-3 px-4 font-bold text-amber-400">MEASURE</td>
                  <td className="py-3 px-4">Deterministic scoring, trend analysis, structured feedback</td>
                  <td className="py-3 px-4 text-zinc-500">Two-score system, score trending, fix packets</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-rose-400">MANAGE</td>
                  <td className="py-3 px-4">Bounded workflows, blast radius limits, audit export</td>
                  <td className="py-3 px-4 text-zinc-500">Supervised mode, safety gates, export-audit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Technical Details */}
        <section className="pt-8 border-t border-zinc-800/50 mb-16">
          <h2 className="text-2xl font-bold font-outfit text-foreground mb-6">
            Technical Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-3">Architecture</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><span className="text-zinc-300 font-bold">Runtime:</span> 100% local — zero telemetry, no external API calls</li>
                <li><span className="text-zinc-300 font-bold">Integration:</span> MCP (Model Context Protocol), CLI, GitHub App</li>
                <li><span className="text-zinc-300 font-bold">Languages:</span> TypeScript, JavaScript, Python, Go, Rust, Java, C#, C/C++, PHP, Swift, Kotlin</li>
                <li><span className="text-zinc-300 font-bold">Analysis:</span> Tree-sitter AST parsing — no regex pattern matching</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="text-lg font-bold text-foreground mb-3">Audit Output</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><span className="text-zinc-300 font-bold">Formats:</span> JSON (machine-readable), Markdown (human-readable)</li>
                <li><span className="text-zinc-300 font-bold">Scoring:</span> 0-100 with severity-weighted deductions</li>
                <li><span className="text-zinc-300 font-bold">Trending:</span> JSONL append-only history with trend classification</li>
                <li><span className="text-zinc-300 font-bold">Command:</span> <code className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded">rigour export-audit --format json</code></li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl border border-zinc-800 bg-zinc-900/30 p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-outfit text-foreground mb-4">
            Get Started
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Rigour is open-source and free. Install it in your project and run your first quality gate check in under 60 seconds.
          </p>
          <div className="bg-zinc-950 rounded-xl p-4 max-w-md mx-auto mb-8 border border-zinc-800">
            <code className="text-sm text-zinc-300 font-mono">
              <span className="text-zinc-500">$</span> npx @rigour-labs/cli init --preset government
            </code>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="https://github.com/rigour-labs/rigour"
              target="_blank"
              className="bg-accent text-zinc-950 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform"
            >
              GitHub Repository
            </Link>
            <Link
              href="https://docs.rigour.run"
              target="_blank"
              className="border border-zinc-700 text-zinc-300 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:border-zinc-500 transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="mailto:hello@rigour.run"
              className="border border-zinc-700 text-zinc-300 px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest hover:border-zinc-500 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Rigour Labs. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
