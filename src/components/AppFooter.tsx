import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const legalLinks = [
  { label: "Privacy Policy", path: "/privacy" },
  { label: "Terms of Service", path: "/terms" },
  { label: "Refund Policy", path: "/refund" },
  { label: "Cookie Policy", path: "/cookies" },
];

export default function AppFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm py-8 px-4 lg:px-6">
      <div className="container mx-auto flex flex-col sm:flex-row items-start justify-between gap-6">
        <div>
          <h4 className="font-display text-lg font-bold gradient-text mb-1">OFA AI</h4>
          <p className="text-xs text-muted-foreground mb-0.5">One For All AI</p>
          <p className="text-sm text-muted-foreground">{t("aboutDesc" as any)}</p>
        </div>
        <div className="flex flex-col items-end gap-3">
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
          <p className="text-xs text-muted-foreground">© 2026 OFA AI. {t("allRightsReserved" as any)}</p>
        </div>
      </div>
    </footer>
  );
}
