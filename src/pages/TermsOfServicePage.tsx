import AppFooter from "@/components/AppFooter";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
          <p>Last updated: March 2026</p>
          <p>This is a placeholder terms of service for OFA AI. Replace this content with your actual terms.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">Acceptance of Terms</h2>
          <p>Placeholder content describing terms acceptance.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">Use of Service</h2>
          <p>Placeholder content describing permitted use of the service.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">Limitation of Liability</h2>
          <p>Placeholder content describing liability limitations.</p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
