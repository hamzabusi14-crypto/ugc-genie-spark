import AppFooter from "@/components/AppFooter";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: March 19, 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <p>
              OFA AI ("we," "our," or "us") is committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our AI-powered video generation platform, website, and related services (collectively, the "Service"). By accessing or using OFA AI, you agree to the terms of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">1.1 Information You Provide Directly</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Account Information:</strong> When you create an account, we collect your name, email address, and password. If you sign up using a third-party authentication provider, we may receive your name and email from that provider.</li>
              <li><strong className="text-foreground">Profile Information:</strong> You may optionally provide a profile picture, display name, and language preference.</li>
              <li><strong className="text-foreground">Content and Media:</strong> Product images, descriptions, video scripts, and any other content you upload or input to generate videos and landing pages.</li>
              <li><strong className="text-foreground">Payment Information:</strong> When purchasing credits, payment details are processed by our third-party payment processor. We do not store full credit card numbers on our servers.</li>
              <li><strong className="text-foreground">Communications:</strong> Any messages, feedback, or support requests you send to us.</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">1.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Usage Data:</strong> Pages visited, features used, videos created, time spent on the platform, and interaction patterns.</li>
              <li><strong className="text-foreground">Device and Browser Information:</strong> IP address, browser type and version, operating system, device identifiers, and screen resolution.</li>
              <li><strong className="text-foreground">Log Data:</strong> Server logs that record requests made to our Service, including timestamps, referring URLs, and error reports.</li>
              <li><strong className="text-foreground">Cookies and Tracking Technologies:</strong> We use cookies, pixels, and similar technologies as described in our Cookie Policy.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Service Delivery:</strong> To create, process, and deliver AI-generated videos and landing pages based on your inputs.</li>
              <li><strong className="text-foreground">Account Management:</strong> To create and manage your account, authenticate your identity, and manage your credit balance.</li>
              <li><strong className="text-foreground">Improvement and Development:</strong> To analyze usage patterns, diagnose technical issues, and improve the quality and performance of our AI models and platform.</li>
              <li><strong className="text-foreground">Communication:</strong> To send you service-related notifications, updates, security alerts, and respond to your inquiries.</li>
              <li><strong className="text-foreground">Billing and Transactions:</strong> To process credit purchases, maintain transaction records, and prevent fraudulent activity.</li>
              <li><strong className="text-foreground">Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, or enforceable governmental requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Third-Party Services and Data Sharing</h2>
            <p className="mb-3">We integrate with and share data with the following third-party services to operate our platform:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Supabase:</strong> Our backend infrastructure provider, used for user authentication, database storage, and real-time data synchronization. Your account data, video records, and transaction history are stored securely on Supabase-managed infrastructure.</li>
              <li><strong className="text-foreground">Cloudinary:</strong> Used for media processing, storage, and delivery of video files and images. Your uploaded product images and generated video content are processed and hosted through Cloudinary's content delivery network.</li>
              <li><strong className="text-foreground">OpenAI:</strong> We use OpenAI's API for generating video scripts, descriptions, and content based on your inputs. Text-based inputs may be sent to OpenAI for processing. OpenAI's data usage policies apply to data processed through their services.</li>
              <li><strong className="text-foreground">Google Veo3:</strong> We leverage Google's Veo3 AI video generation model to create high-quality video content from scripts and images. Visual and textual inputs may be processed through Google's infrastructure.</li>
              <li><strong className="text-foreground">n8n (Automation):</strong> We use workflow automation to orchestrate video generation pipelines. Task identifiers and metadata are transmitted through automated workflows.</li>
            </ul>
            <p className="mt-3">We do not sell, rent, or trade your personal information to third parties for their marketing purposes. We may share aggregated, anonymized data that cannot be used to identify you.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Storage and Security</h2>
            <p className="mb-3">
              Your data is stored on secure, cloud-based infrastructure provided by our hosting partners. We implement industry-standard security measures including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit using TLS/SSL protocols</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Row-level security (RLS) policies on database tables to ensure users can only access their own data</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication requirements for all API endpoints</li>
            </ul>
            <p className="mt-3">While we strive to protect your information, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security of your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide you with our services. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong className="text-foreground">Account Data:</strong> Retained until you request account deletion.</li>
              <li><strong className="text-foreground">Generated Videos:</strong> Stored for as long as your account is active. You may delete individual videos at any time.</li>
              <li><strong className="text-foreground">Transaction Records:</strong> Retained for a minimum of 7 years to comply with financial and tax regulations.</li>
              <li><strong className="text-foreground">Usage Logs:</strong> Automatically purged after 90 days.</li>
              <li><strong className="text-foreground">Support Communications:</strong> Retained for up to 2 years after resolution.</li>
            </ul>
            <p className="mt-3">Upon account deletion, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes such as fraud prevention.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p className="mb-3">Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate or incomplete personal data.</li>
              <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements.</li>
              <li><strong className="text-foreground">Data Portability:</strong> Request a machine-readable copy of your data.</li>
              <li><strong className="text-foreground">Objection:</strong> Object to processing of your data for certain purposes.</li>
              <li><strong className="text-foreground">Withdrawal of Consent:</strong> Where processing is based on consent, you may withdraw it at any time.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, please contact us using the information provided below. We will respond to your request within 30 days.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience on our platform. For detailed information about the cookies we use and how to manage them, please refer to our <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Children's Privacy</h2>
            <p>
              OFA AI is not intended for use by individuals under the age of 16. We do not knowingly collect personal information from children under 16. If we become aware that we have collected data from a child under 16, we will take steps to delete such information promptly. If you believe a child has provided us with personal data, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from your jurisdiction. By using our Service, you consent to the transfer of your information to countries outside your country of residence, including the United States and the European Union, where our service providers operate. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by posting the updated policy on our website and updating the "Last updated" date. Your continued use of the Service after any changes constitutes your acceptance of the revised Privacy Policy. We encourage you to review this page periodically.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-3 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="font-medium text-foreground">OFA AI</p>
              <p>Email: privacy@ofa-ai.com</p>
              <p>Website: ofa-ai.com</p>
            </div>
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
