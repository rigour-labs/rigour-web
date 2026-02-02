import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Rigour Labs Privacy Policy - How we handle your data with transparency and respect.",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Link href="/" className="text-accent hover:text-accent/80 transition-colors">
            &larr; Back to Rigour Labs
          </Link>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: February 2, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              At Rigour Labs (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we believe privacy is a fundamental right, not a feature.
              This Privacy Policy explains how we collect, use, and protect your information when you use our
              services, including Rigour Bot, Rigour MCP Server, and our website at rigour.run.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong className="text-foreground">Our core principle:</strong> We collect the minimum data necessary to provide our
              services, and we never sell your data to third parties.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">When You Use Rigour Bot</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Repository metadata:</strong> Repository names, branch names, and pull request numbers necessary to perform code analysis.</li>
              <li><strong className="text-foreground">Code diffs:</strong> We analyze the changes in your pull requests to detect code quality issues. This data is processed in real-time and not stored permanently.</li>
              <li><strong className="text-foreground">GitHub App installation data:</strong> Installation IDs and account information required by GitHub&apos;s App platform.</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">When You Use Our Website</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Analytics data:</strong> We use Vercel Analytics to understand how visitors use our site. This includes page views, referrers, and general geographic regions. No personally identifiable information is collected.</li>
              <li><strong className="text-foreground">Contact information:</strong> If you contact us via email, we retain your email address and message content to respond to your inquiry.</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">When You Use Rigour MCP Server</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Local-first by design:</strong> The MCP server runs locally on your machine. Your code never leaves your environment unless you explicitly configure it to connect to our remote API.</li>
              <li><strong className="text-foreground">Zero telemetry:</strong> We do not collect usage statistics, error reports, or any other telemetry from the local MCP server.</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Analyze code in pull requests and provide quality feedback</li>
              <li>Respond to your inquiries and support requests</li>
              <li>Detect and prevent security issues, fraud, or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong className="text-foreground">We do not:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>Sell your data to third parties</li>
              <li>Use your code to train machine learning models</li>
              <li>Share your code with other users or organizations</li>
              <li>Retain your code after analysis is complete</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong className="text-foreground">Code analysis:</strong> Code diffs are processed in memory and discarded immediately after analysis. We do not store your source code.</li>
              <li><strong className="text-foreground">Analysis results:</strong> Results are posted to GitHub via the Checks API and stored by GitHub according to their retention policies.</li>
              <li><strong className="text-foreground">Account data:</strong> If you uninstall Rigour Bot, we delete your installation data within 30 days.</li>
              <li><strong className="text-foreground">Support communications:</strong> We retain support emails for up to 2 years to provide context for future inquiries.</li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>All data in transit is encrypted using TLS 1.3</li>
              <li>Webhook payloads are verified using HMAC signatures</li>
              <li>GitHub App authentication uses short-lived tokens</li>
              <li>Our infrastructure is hosted on secure, SOC 2 compliant platforms</li>
              <li>We conduct regular security reviews of our codebase</li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">We use the following third-party services:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li><strong className="text-foreground">GitHub:</strong> To receive webhook events and post analysis results</li>
              <li><strong className="text-foreground">Vercel:</strong> To host our website and collect anonymous analytics</li>
              <li><strong className="text-foreground">Railway:</strong> To host our bot infrastructure</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Each of these services has their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li><strong className="text-foreground">Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate personal data</li>
              <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal data</li>
              <li><strong className="text-foreground">Portability:</strong> Request your data in a machine-readable format</li>
              <li><strong className="text-foreground">Objection:</strong> Object to certain types of processing</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:privacy@rigour.run" className="text-accent hover:underline">
                privacy@rigour.run
              </a>
              .
            </p>
          </section>

          {/* International Data Transfers */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are hosted in the United States. If you access our services from outside the United States,
              your data may be transferred to and processed in the United States. We ensure appropriate safeguards
              are in place to protect your data in compliance with applicable laws.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Children&apos;s Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are not directed to individuals under the age of 16. We do not knowingly collect
              personal information from children. If you believe we have collected information from a child,
              please contact us immediately.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes
              by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date. We encourage
              you to review this policy periodically.
            </p>
          </section>

          {/* Contact Us */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <ul className="list-none pl-0 text-muted-foreground space-y-2 mt-4">
              <li><strong className="text-foreground">Email:</strong>{" "}
                <a href="mailto:privacy@rigour.run" className="text-accent hover:underline">
                  privacy@rigour.run
                </a>
              </li>
              <li><strong className="text-foreground">Website:</strong>{" "}
                <a href="https://rigour.run" className="text-accent hover:underline">
                  https://rigour.run
                </a>
              </li>
              <li><strong className="text-foreground">GitHub:</strong>{" "}
                <a href="https://github.com/rigour-labs" className="text-accent hover:underline">
                  @rigour-labs
                </a>
              </li>
            </ul>
          </section>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center text-muted-foreground text-sm">
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
