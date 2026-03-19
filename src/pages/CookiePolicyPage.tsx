import AppFooter from "@/components/AppFooter";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: March 19, 2026</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <p>
              This Cookie Policy explains how OFA AI ("we," "our," or "us") uses cookies and similar tracking technologies when you visit and use our website and AI-powered video generation platform (the "Service"). This policy should be read alongside our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which provides additional details about how we handle your personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and supply information to website owners. Cookies can be "persistent" (remaining on your device until they expire or are deleted) or "session-based" (lasting only until you close your browser). They can be set by the website you are visiting ("first-party cookies") or by third-party services operating on that website ("third-party cookies").
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Types of Cookies We Use</h2>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.1 Essential Cookies (Strictly Necessary)</h3>
            <p className="mb-3">
              These cookies are required for the basic functionality of our Service and cannot be disabled. Without them, core features would not work properly.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium text-foreground">Cookie</th>
                    <th className="text-left p-3 font-medium text-foreground">Purpose</th>
                    <th className="text-left p-3 font-medium text-foreground">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3">sb-auth-token</td>
                    <td className="p-3">Maintains your authenticated session so you stay logged in</td>
                    <td className="p-3">Session / 7 days</td>
                  </tr>
                  <tr>
                    <td className="p-3">sb-refresh-token</td>
                    <td className="p-3">Refreshes your authentication token to keep your session active</td>
                    <td className="p-3">30 days</td>
                  </tr>
                  <tr>
                    <td className="p-3">csrf-token</td>
                    <td className="p-3">Protects against cross-site request forgery attacks</td>
                    <td className="p-3">Session</td>
                  </tr>
                  <tr>
                    <td className="p-3">language-preference</td>
                    <td className="p-3">Stores your selected language (e.g., English, Arabic)</td>
                    <td className="p-3">1 year</td>
                  </tr>
                  <tr>
                    <td className="p-3">cookie-consent</td>
                    <td className="p-3">Records whether you have accepted or declined non-essential cookies</td>
                    <td className="p-3">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.2 Functional Cookies</h3>
            <p className="mb-3">
              These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we use on our pages.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium text-foreground">Cookie</th>
                    <th className="text-left p-3 font-medium text-foreground">Purpose</th>
                    <th className="text-left p-3 font-medium text-foreground">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3">theme-preference</td>
                    <td className="p-3">Remembers your dark/light mode preference</td>
                    <td className="p-3">1 year</td>
                  </tr>
                  <tr>
                    <td className="p-3">sidebar-state</td>
                    <td className="p-3">Remembers whether the dashboard sidebar is collapsed or expanded</td>
                    <td className="p-3">Session</td>
                  </tr>
                  <tr>
                    <td className="p-3">recent-projects</td>
                    <td className="p-3">Stores references to your recently accessed videos for quick access</td>
                    <td className="p-3">30 days</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.3 Analytics Cookies</h3>
            <p className="mb-3">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This data helps us improve the Service.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium text-foreground">Cookie</th>
                    <th className="text-left p-3 font-medium text-foreground">Purpose</th>
                    <th className="text-left p-3 font-medium text-foreground">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3">_ga</td>
                    <td className="p-3">Google Analytics — distinguishes unique users</td>
                    <td className="p-3">2 years</td>
                  </tr>
                  <tr>
                    <td className="p-3">_ga_*</td>
                    <td className="p-3">Google Analytics — maintains session state</td>
                    <td className="p-3">2 years</td>
                  </tr>
                  <tr>
                    <td className="p-3">_gid</td>
                    <td className="p-3">Google Analytics — distinguishes users for 24-hour reporting</td>
                    <td className="p-3">24 hours</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">2.4 Marketing Cookies (if applicable)</h3>
            <p>
              We may in the future use marketing cookies to deliver relevant advertisements and track the effectiveness of our marketing campaigns. These cookies are set by third-party advertising partners and may be used to build a profile of your interests. If we introduce marketing cookies, this policy will be updated accordingly and your consent will be obtained before they are placed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Third-Party Cookies</h2>
            <p className="mb-3">
              Some cookies on our Service are placed by third-party services that we use. These third parties have their own privacy and cookie policies, and we encourage you to review them:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Google Analytics:</strong> Used for website analytics and usage tracking. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a></li>
              <li><strong className="text-foreground">Cloudinary:</strong> May set cookies related to media delivery and optimization. <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Cloudinary Privacy Policy</a></li>
              <li><strong className="text-foreground">Supabase:</strong> Used for authentication; sets session-related cookies. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Supabase Privacy Policy</a></li>
            </ul>
            <p className="mt-3">
              We do not control the cookies set by these third parties, and their use is governed by their respective privacy policies. We select our third-party partners carefully and only work with services that maintain high standards of data protection.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. How to Manage Cookies</h2>
            <p className="mb-3">
              You have the right to decide whether to accept or reject cookies (except essential cookies, which are required for the Service to function). You can manage your cookie preferences in the following ways:
            </p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.1 Browser Settings</h3>
            <p className="mb-3">
              Most web browsers allow you to control cookies through their settings. You can typically find these controls in your browser's "Preferences," "Privacy," or "Settings" menu. Common browsers provide the following options:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong className="text-foreground">Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong className="text-foreground">Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong className="text-foreground">Edge:</strong> Settings → Cookies and Site Permissions → Manage and delete cookies</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.2 Opt-Out Links</h3>
            <p>
              You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-out Browser Add-on</a>.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.3 Impact of Disabling Cookies</h3>
            <p>
              Please note that disabling or deleting cookies may affect the functionality of our Service. If you disable essential cookies, you may not be able to log in, maintain your session, or use core features of the platform. Disabling analytics cookies will not affect your use of the Service but will prevent us from understanding how to improve it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Similar Technologies</h2>
            <p className="mb-3">
              In addition to cookies, we may use other similar tracking technologies:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Local Storage:</strong> We use browser local storage to save user preferences and temporary application state. Unlike cookies, local storage data is not sent to the server with every request.</li>
              <li><strong className="text-foreground">Session Storage:</strong> Used to store temporary data for the duration of your browser session, such as form inputs and navigation state.</li>
              <li><strong className="text-foreground">Pixels / Web Beacons:</strong> Small transparent images that may be used in emails or on web pages to track whether content has been accessed.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Do Not Track Signals</h2>
            <p>
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want your online activity tracked. There is no universally accepted standard for how to respond to DNT signals, and our Service does not currently respond to DNT browser signals. However, you can manage tracking through cookie settings as described above.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Changes to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in the cookies we use, changes in technology, or updates to applicable laws and regulations. When we make changes, we will update the "Last updated" date at the top of this page. We encourage you to review this policy periodically to stay informed about how we use cookies. Material changes will be communicated via a notice on our website or through email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
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
