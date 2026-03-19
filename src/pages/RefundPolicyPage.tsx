import AppFooter from "@/components/AppFooter";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Refund Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: March 19, 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <p>
              At OFA AI, we strive to deliver high-quality AI-generated video content and landing pages. This Refund Policy outlines the terms and conditions regarding credit purchases, refund eligibility, and the process for requesting a refund. Please read this policy carefully before making any purchases on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Credit Purchase Policy</h2>
            <p className="mb-3">
              OFA AI operates on a prepaid credit-based system. Credits are the virtual currency used to access our AI video generation and landing page creation services.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Pricing:</strong> Credit packages are priced as displayed on our Billing page at the time of purchase. Prices are listed in US dollars and may vary by region or promotional period.</li>
              <li><strong className="text-foreground">Instant Delivery:</strong> Upon successful payment, credits are immediately added to your account balance and available for use.</li>
              <li><strong className="text-foreground">Purchase Confirmation:</strong> You will receive a confirmation of your purchase via the email address associated with your account. A record of all transactions is available on your Billing page.</li>
              <li><strong className="text-foreground">Promotional Credits:</strong> Free or promotional credits provided during sign-up, events, or promotions are granted at our discretion and are not eligible for refund or cash redemption under any circumstances.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. General Refund Policy — Non-Refundable Credits</h2>
            <p className="mb-3">
              As a general rule, all credit purchases on OFA AI are final and non-refundable. This policy exists because:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Digital Service:</strong> Our Service provides immediate access to AI processing capabilities. Once credits are purchased, you have instant access to utilize them, making the transaction irreversible in nature.</li>
              <li><strong className="text-foreground">Resource Allocation:</strong> Each video generation and landing page creation consumes significant computational resources, including GPU processing time, AI model inference, media processing, and cloud storage.</li>
              <li><strong className="text-foreground">Third-Party Costs:</strong> Credit usage incurs real costs from third-party providers (AI models, cloud computing, media processing, content delivery) that cannot be recovered once consumed.</li>
            </ul>
            <p className="mt-3">
              By purchasing credits, you acknowledge and agree that you are purchasing access to a digital service and that refunds are not guaranteed. We encourage you to start with a smaller credit package to evaluate the Service before making larger purchases.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Exceptions — When Refunds May Be Granted</h2>
            <p className="mb-3">
              While credits are generally non-refundable, we recognize that exceptional circumstances may warrant a refund. We may consider refund requests in the following situations:
            </p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.1 Technical Failures</h3>
            <p>If our system experiences a technical failure that results in:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Credits being deducted without a video or landing page being generated</li>
              <li>A video generation process that fails to complete due to a server-side error</li>
              <li>Duplicate charges caused by a system glitch</li>
              <li>A video rendered with severe quality issues clearly caused by a platform bug (not related to input quality)</li>
            </ul>
            <p className="mt-2">In these cases, we will either restore the consumed credits to your account or issue a refund for the equivalent monetary value, at our discretion.</p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.2 Billing Errors</h3>
            <p>If you were charged incorrectly due to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Being charged a different amount than displayed at checkout</li>
              <li>Being charged multiple times for a single purchase</li>
              <li>Unauthorized charges (in which case we may also require identity verification)</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">3.3 Service Discontinuation</h3>
            <p>
              If we permanently discontinue the OFA AI Service, we will provide a pro-rata refund for any unused credits remaining in active accounts at the time of discontinuation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Non-Eligible Refund Scenarios</h2>
            <p className="mb-3">Refunds will not be granted in the following situations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Dissatisfaction with Output Quality:</strong> AI-generated content quality depends on input quality, prompt specificity, and the inherent nature of AI models. Subjective dissatisfaction with the creative output is not grounds for a refund.</li>
              <li><strong className="text-foreground">User Error:</strong> Credits consumed due to incorrect inputs, accidental submissions, or misunderstanding of how the Service works.</li>
              <li><strong className="text-foreground">Change of Mind:</strong> Purchasing credits and later deciding you no longer need them.</li>
              <li><strong className="text-foreground">Account Termination for Violations:</strong> If your account is terminated due to violations of our Terms of Service, no refund will be provided for remaining credits.</li>
              <li><strong className="text-foreground">Partial Usage:</strong> Using some credits from a package and requesting a refund for the remainder.</li>
              <li><strong className="text-foreground">Promotional or Free Credits:</strong> Credits received through promotions, referrals, or sign-up bonuses.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. How to Request a Refund</h2>
            <p className="mb-3">If you believe you are eligible for a refund, please follow these steps:</p>
            <ol className="list-decimal pl-6 space-y-3">
              <li>
                <strong className="text-foreground">Contact Support:</strong> Send an email to <span className="text-primary">refunds@ofa-ai.com</span> with the subject line "Refund Request."
              </li>
              <li>
                <strong className="text-foreground">Include Required Information:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Your account email address</li>
                  <li>Date of the transaction</li>
                  <li>Amount charged and credit package purchased</li>
                  <li>Transaction ID (available on your Billing page)</li>
                  <li>Detailed description of the issue, including screenshots or video IDs if applicable</li>
                </ul>
              </li>
              <li>
                <strong className="text-foreground">Await Review:</strong> Our team will review your request and may ask for additional information or evidence.
              </li>
              <li>
                <strong className="text-foreground">Resolution:</strong> You will receive a response with our decision within the processing timeframe outlined below.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Processing Time</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Initial Response:</strong> We aim to acknowledge all refund requests within 2 business days of receipt.</li>
              <li><strong className="text-foreground">Review Period:</strong> Refund requests are typically reviewed and resolved within 5–10 business days.</li>
              <li><strong className="text-foreground">Refund Delivery:</strong> Approved refunds will be processed to the original payment method within 5–14 business days, depending on your payment provider and financial institution.</li>
              <li><strong className="text-foreground">Credit Restoration:</strong> If we determine that credit restoration (rather than monetary refund) is appropriate, credits will be added to your account within 1 business day of approval.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Chargebacks</h2>
            <p>
              We strongly encourage you to contact us directly before initiating a chargeback with your bank or payment provider. Chargebacks incur significant processing fees and administrative overhead. If you file a chargeback, your account will be immediately suspended pending investigation. If the chargeback is found to be unjustified, your account may be permanently terminated. We reserve the right to dispute chargebacks we believe are unwarranted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to This Policy</h2>
            <p>
              We reserve the right to update this Refund Policy at any time. Changes will be posted on this page with an updated "Last updated" date. Your continued use of the Service after changes constitutes acceptance of the revised policy. Material changes will be communicated via email to registered users.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Us</h2>
            <p>
              For refund inquiries or questions about this policy, please contact us at:
            </p>
            <div className="mt-3 p-4 rounded-lg bg-muted/50 border border-border">
              <p className="font-medium text-foreground">OFA AI — Billing Support</p>
              <p>Email: refunds@ofa-ai.com</p>
              <p>General Support: support@ofa-ai.com</p>
              <p>Website: ofa-ai.com</p>
            </div>
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
