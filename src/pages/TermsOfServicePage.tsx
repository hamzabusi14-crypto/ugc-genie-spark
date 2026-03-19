import AppFooter from "@/components/AppFooter";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: March 19, 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <p>
              Welcome to OFA AI. These Terms of Service ("Terms") govern your access to and use of OFA AI's website, applications, APIs, and AI-powered video generation services (collectively, the "Service"). By creating an account or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using OFA AI, you confirm that you are at least 16 years old and have the legal capacity to enter into these Terms. If you are using the Service on behalf of a company or organization, you represent that you have authority to bind that entity to these Terms. We reserve the right to modify these Terms at any time. Changes will be effective upon posting to the website. Your continued use of the Service after modifications constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Account Registration</h2>
            <p className="mb-3">To use OFA AI, you must create an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information to keep it accurate</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="mt-3">
              We reserve the right to suspend or terminate accounts that contain false or misleading information, or that we reasonably believe have been compromised. You may not create multiple accounts for the purpose of abusing promotions or circumventing usage limits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Credits System</h2>
            <p className="mb-3">OFA AI operates on a credit-based system:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Credit Purchase:</strong> Credits can be purchased through the platform via our billing page. Prices are displayed at the time of purchase and may be subject to change.</li>
              <li><strong className="text-foreground">Credit Usage:</strong> Each video generation or landing page creation consumes a specified number of credits. The credit cost for each action is displayed before you confirm the action.</li>
              <li><strong className="text-foreground">Free Credits:</strong> New accounts may receive complimentary credits upon registration. These credits are subject to the same terms as purchased credits.</li>
              <li><strong className="text-foreground">Credit Expiration:</strong> Credits do not expire as long as your account remains active and in good standing.</li>
              <li><strong className="text-foreground">Non-Transferable:</strong> Credits are tied to your account and cannot be transferred, gifted, or sold to other users.</li>
              <li><strong className="text-foreground">No Monetary Value:</strong> Credits have no cash value and cannot be redeemed for cash or refunds except as described in our Refund Policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Acceptable Use Policy</h2>
            <p className="mb-3">You agree to use OFA AI only for lawful purposes. You shall not use the Service to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Generate content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
              <li>Create deepfake content, misleading media, or content that impersonates real individuals without their consent</li>
              <li>Produce content that infringes on intellectual property rights, trademarks, or copyrights of third parties</li>
              <li>Generate content that promotes discrimination, hate speech, or violence against any individual or group</li>
              <li>Create sexually explicit or pornographic content</li>
              <li>Produce content that targets or exploits minors in any way</li>
              <li>Use the Service for spam, phishing, or distributing malware</li>
              <li>Attempt to reverse-engineer, decompile, or extract the underlying AI models or algorithms</li>
              <li>Use automated tools, bots, or scripts to access the Service beyond normal usage</li>
              <li>Circumvent or attempt to circumvent any usage limits, security measures, or access controls</li>
              <li>Resell, redistribute, or sublicense access to the Service without our written consent</li>
            </ul>
            <p className="mt-3">
              We reserve the right to review generated content and take action — including content removal, account suspension, or permanent ban — against users who violate this policy. Violations may be reported to law enforcement if appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Prohibited Content</h2>
            <p className="mb-3">The following types of content are strictly prohibited on OFA AI:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Content that violates any local, national, or international law or regulation</li>
              <li>Content that promotes illegal activities or provides instructions for illegal acts</li>
              <li>Content depicting or promoting violence, self-harm, or terrorism</li>
              <li>Content that constitutes or facilitates fraud or deception</li>
              <li>Content containing personal data of third parties without their consent</li>
              <li>Content designed to manipulate elections, public opinion, or spread disinformation</li>
              <li>Content that violates export control laws or sanctions</li>
            </ul>
            <p className="mt-3">We may use automated tools and manual review to detect and remove prohibited content. Users who repeatedly violate content policies will have their accounts permanently terminated without refund.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">6.1 Your Content</h3>
            <p>
              You retain ownership of any original content you upload to OFA AI, including product images and descriptions. By uploading content, you grant us a limited, non-exclusive, worldwide license to use, process, and store your content solely for the purpose of providing the Service.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">6.2 Generated Content</h3>
            <p>
              Subject to these Terms and applicable law, you are granted a license to use AI-generated videos and landing pages created through OFA AI for your commercial and personal purposes. You acknowledge that AI-generated content may not be eligible for copyright protection in all jurisdictions. We make no guarantees regarding the exclusivity or uniqueness of generated content — similar inputs may produce similar outputs for different users.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">6.3 Our Intellectual Property</h3>
            <p>
              The OFA AI platform, including its design, code, AI models, algorithms, logos, trademarks, and documentation, is owned by us and protected by intellectual property laws. Nothing in these Terms grants you any rights to our intellectual property except the limited right to use the Service as described herein.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Service Availability and Modifications</h2>
            <p>
              We strive to maintain high availability of our Service but do not guarantee uninterrupted or error-free operation. We may modify, suspend, or discontinue any part of the Service at any time, with or without notice. Scheduled maintenance will be communicated in advance when possible. We are not liable for any losses resulting from service interruptions, including but not limited to lost credits, failed video generations, or data loss during downtime.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Disclaimers</h2>
            <p className="mb-3">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
              <li>Warranties that the Service will be uninterrupted, timely, secure, or error-free</li>
              <li>Warranties regarding the accuracy, quality, or reliability of AI-generated content</li>
              <li>Warranties that AI-generated content will be free from factual errors, biases, or inappropriate material</li>
            </ul>
            <p className="mt-3">
              AI-generated content should be reviewed before use. You are solely responsible for verifying the accuracy and appropriateness of any content generated through the Service before publishing, distributing, or using it for any purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, OFA AI AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, BUSINESS OPPORTUNITIES, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, REGARDLESS OF THE THEORY OF LIABILITY.
            </p>
            <p className="mt-3">
              OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU HAVE PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM. IF YOU HAVE NOT MADE ANY PAYMENTS, OUR LIABILITY SHALL NOT EXCEED ONE HUNDRED US DOLLARS ($100).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless OFA AI and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising from: (a) your use of the Service; (b) your violation of these Terms; (c) your violation of any third-party rights; or (d) content you upload or generate through the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Termination</h2>
            <p className="mb-3">
              Either party may terminate this agreement at any time:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">By You:</strong> You may delete your account at any time through the Settings page. Upon deletion, your data will be removed in accordance with our Privacy Policy.</li>
              <li><strong className="text-foreground">By Us:</strong> We may suspend or terminate your account immediately, without prior notice, if we believe you have violated these Terms, engaged in fraudulent activity, or posed a risk to other users or the platform.</li>
            </ul>
            <p className="mt-3">
              Upon termination, your right to use the Service ceases immediately. Any unused credits will be forfeited unless termination was due to our breach of these Terms. Sections that by their nature should survive termination (including intellectual property, disclaimers, limitation of liability, and indemnification) shall continue in effect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which OFA AI operates, without regard to conflict of law principles. Any disputes arising under or in connection with these Terms shall first be attempted to be resolved through good-faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with the applicable arbitration rules. You agree to waive any right to participate in a class action lawsuit or class-wide arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">13. Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving its original intent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">14. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-3 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="font-medium text-foreground">OFA AI</p>
              <p>Email: legal@ofa-ai.com</p>
              <p>Website: ofa-ai.com</p>
            </div>
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
