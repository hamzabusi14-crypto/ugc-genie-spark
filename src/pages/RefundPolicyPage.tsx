import AppFooter from "@/components/AppFooter";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
        <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
          <p>Last updated: March 2026</p>
          <p>This is a placeholder refund policy for OFA AI. Replace this content with your actual refund policy.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">Eligibility for Refunds</h2>
          <p>Placeholder content describing refund eligibility.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">How to Request a Refund</h2>
          <p>Placeholder content describing the refund process.</p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
