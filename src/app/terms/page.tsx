import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Rigour Labs Terms of Service - The rules and guidelines for using our services.",
};

export default function TermsOfService() {
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
        <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-12">Last updated: February 2, 2026</p>

        <div className="prose prose-invert prose-lg max-w-none">
          {/* Agreement */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the services provided by Rigour Labs (&ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;),
              including Rigour Bot, Rigour MCP Server, and our website at rigour.run (collectively, the &ldquo;Services&rdquo;),
              you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              If you do not agree to these Terms, you may not access or use the Services. If you are using the Services
              on behalf of an organization, you represent and warrant that you have the authority to bind that organization
              to these Terms.
            </p>
          </section>

          {/* Description of Services */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              Rigour Labs provides code quality analysis tools designed to help development teams maintain high
              engineering standards. Our Services include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li><strong className="text-foreground">Rigour Bot:</strong> A GitHub App that automatically reviews pull requests for code quality issues, security vulnerabilities, and adherence to best practices.</li>
              <li><strong className="text-foreground">Rigour MCP Server:</strong> A local-first Model Context Protocol server that integrates with AI coding assistants to enforce code quality gates.</li>
              <li><strong className="text-foreground">Rigour CLI:</strong> A command-line tool for running code quality checks locally or in CI/CD pipelines.</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Account and Access</h2>
            <p className="text-muted-foreground leading-relaxed">
              To use certain features of our Services, you may need to install Rigour Bot on your GitHub repositories.
              By doing so, you grant us the permissions outlined during the installation process, which include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Read access to repository code and pull request content</li>
              <li>Write access to create check runs and post review comments</li>
              <li>Access to repository metadata (names, branches, pull request numbers)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              You are responsible for maintaining the security of your GitHub account and any repositories where
              Rigour Bot is installed. You must promptly notify us of any unauthorized access or security breaches.
            </p>
          </section>

          {/* Acceptable Use */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to use the Services only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Use the Services to analyze code that you do not have the right to access or analyze</li>
              <li>Attempt to circumvent, disable, or interfere with security features of the Services</li>
              <li>Use the Services to transmit malware, viruses, or other malicious code</li>
              <li>Reverse engineer, decompile, or disassemble the Services</li>
              <li>Use automated means to access the Services in a manner that exceeds reasonable usage</li>
              <li>Resell, sublicense, or redistribute the Services without our prior written consent</li>
              <li>Use the Services to violate the intellectual property rights of others</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Our Intellectual Property</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Services, including all software, algorithms, documentation, trademarks, and other intellectual
              property, are owned by Rigour Labs or our licensors. These Terms do not grant you any ownership
              rights in the Services.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Your Code</h3>
            <p className="text-muted-foreground leading-relaxed">
              You retain all ownership rights to the code you submit for analysis. By using our Services, you grant
              us a limited, non-exclusive license to access and analyze your code solely for the purpose of providing
              the Services. We do not claim any ownership of your code, and we do not use your code to train machine
              learning models or for any purpose other than providing the Services.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Feedback</h3>
            <p className="text-muted-foreground leading-relaxed">
              If you provide us with feedback, suggestions, or ideas about the Services, you grant us a perpetual,
              irrevocable, worldwide license to use such feedback without restriction or compensation.
            </p>
          </section>

          {/* Service Availability */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Service Availability and Support</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to maintain high availability of our Services, but we do not guarantee uninterrupted access.
              The Services may be temporarily unavailable due to maintenance, updates, or factors beyond our control.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Support is provided on a reasonable-efforts basis. We may modify, suspend, or discontinue any part
              of the Services at any time with or without notice. We will make reasonable efforts to notify users
              of significant changes.
            </p>
          </section>

          {/* Pricing and Payment */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Pricing and Payment</h2>
            <p className="text-muted-foreground leading-relaxed">
              Certain features of the Services may require payment. If you subscribe to a paid plan:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>You agree to pay all fees associated with your subscription</li>
              <li>Fees are billed in advance on a monthly or annual basis</li>
              <li>All fees are non-refundable except as required by law</li>
              <li>We may change pricing with 30 days&apos; notice</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Free tiers and trial periods may be subject to usage limits and are provided at our discretion.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed uppercase font-medium">
              THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
              OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
              NON-INFRINGEMENT, OR ACCURACY.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We do not warrant that:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>The Services will meet your specific requirements</li>
              <li>The Services will be uninterrupted, timely, secure, or error-free</li>
              <li>The analysis results will be accurate or complete</li>
              <li>Any defects in the Services will be corrected</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              The Services are designed to assist with code review but should not be relied upon as the sole
              mechanism for ensuring code quality or security. You remain responsible for your own code.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed uppercase font-medium">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RIGOUR LABS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE,
              OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICES.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4 uppercase font-medium">
              OUR TOTAL LIABILITY FOR ANY CLAIMS ARISING OUT OF OR RELATED TO THESE TERMS OR THE SERVICES SHALL
              NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR (B) $100 USD.
            </p>
          </section>

          {/* Indemnification */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless Rigour Labs and its officers, directors, employees,
              and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable
              attorneys&apos; fees) arising out of or related to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Your use of the Services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any code or content you submit through the Services</li>
            </ul>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              You may stop using the Services at any time by uninstalling Rigour Bot from your repositories.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We may suspend or terminate your access to the Services at any time, with or without cause, and
              with or without notice. Reasons for termination may include, but are not limited to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
              <li>Violation of these Terms</li>
              <li>Conduct that we believe is harmful to other users or the Services</li>
              <li>Extended periods of inactivity</li>
              <li>Failure to pay applicable fees</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Upon termination, your right to use the Services will immediately cease. Sections 5, 8, 9, 10, and 13
              shall survive termination.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. Governing Law and Disputes</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware,
              United States, without regard to its conflict of law provisions.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Any disputes arising out of or related to these Terms or the Services shall be resolved through
              binding arbitration in accordance with the rules of the American Arbitration Association. The
              arbitration shall take place in Delaware, and the decision of the arbitrator shall be final and binding.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in any
              court of competent jurisdiction to prevent the actual or threatened infringement of intellectual
              property rights.
            </p>
          </section>

          {/* General */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. General Provisions</h2>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Entire Agreement</h3>
            <p className="text-muted-foreground leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and
              Rigour Labs regarding the Services and supersede all prior agreements and understandings.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Severability</h3>
            <p className="text-muted-foreground leading-relaxed">
              If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions
              shall continue in full force and effect.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Waiver</h3>
            <p className="text-muted-foreground leading-relaxed">
              Our failure to enforce any right or provision of these Terms shall not be considered a waiver of
              that right or provision.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Assignment</h3>
            <p className="text-muted-foreground leading-relaxed">
              You may not assign or transfer these Terms or your rights under these Terms without our prior
              written consent. We may assign these Terms without restriction.
            </p>

            <h3 className="text-xl font-medium text-foreground mt-6 mb-3">Modifications</h3>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will provide notice of material changes
              by posting the updated Terms on our website or through other reasonable means. Your continued use
              of the Services after such changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="list-none pl-0 text-muted-foreground space-y-2 mt-4">
              <li><strong className="text-foreground">Email:</strong>{" "}
                <a href="mailto:legal@rigour.run" className="text-accent hover:underline">
                  legal@rigour.run
                </a>
              </li>
              <li><strong className="text-foreground">Website:</strong>{" "}
                <a href="https://rigour.run" className="text-accent hover:underline">
                  https://rigour.run
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
