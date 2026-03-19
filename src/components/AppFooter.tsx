import { Link } from "react-router-dom";

const legalLinks = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Service", path: "/terms" },
  { label: "Refund Policy", path: "/refund" },
  { label: "Cookie Policy", path: "/cookies" },
];

export default function AppFooter() {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm py-6 px-4 lg:px-6">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">© 2026 OFA AI. All rights reserved.</p>
        <nav className="flex flex-wrap items-center gap-4">
          {legalLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
