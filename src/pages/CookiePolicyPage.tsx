import AppFooter from "@/components/AppFooter";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
        <div className="prose prose-invert max-w-none space-y-4 text-muted-foreground">
          <p>Last updated: March 2026</p>
          <p>This is a placeholder cookie policy for OFA AI. Replace this content with your actual cookie policy.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">What Are Cookies</h2>
          <p>Placeholder content describing cookies.</p>
          <h2 className="text-xl font-semibold text-foreground mt-8">How We Use Cookies</h2>
          <p>Placeholder content describing cookie usage.</p>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
