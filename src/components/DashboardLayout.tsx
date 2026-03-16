import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  Film,
  FastForward,
  CreditCard,
  Settings,
  FileText,
  LogOut,
  Menu,
  Coins,
  Globe,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const navItems = [
  { key: "dashboard" as const, path: "/dashboard", icon: LayoutDashboard },
  { key: "createVideo" as const, path: "/create", icon: Video },
  { key: "myVideos" as const, path: "/videos", icon: Film },
  { key: "billing" as const, path: "/billing", icon: CreditCard },
  { key: "settings" as const, path: "/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, signOut } = useAuth();
  const { t, lang, setLang } = useI18n();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 flex-col border-r border-border bg-sidebar p-4 fixed inset-y-0 start-0 z-30">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold gradient-text">OFA AI</h1>
          <p className="text-xs text-muted-foreground mt-1">{t("tagline")}</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              end={item.path === "/dashboard"}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
              activeClassName="bg-sidebar-accent text-foreground font-medium"
            >
              <item.icon className="h-5 w-5" />
              <span>{t(item.key)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" onClick={() => setLang(lang === "en" ? "ar" : "en")}>
            <Globe className="h-4 w-4" />
            {lang === "en" ? "العربية" : "English"}
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <aside className="absolute inset-y-0 start-0 w-64 border-r border-border bg-sidebar p-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="mb-8">
              <h1 className="font-display text-2xl font-bold gradient-text">OFA AI</h1>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.key}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
                  activeClassName="bg-sidebar-accent text-foreground font-medium"
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{t(item.key)}</span>
                </NavLink>
              ))}
            </nav>
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-destructive mt-auto" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </Button>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ms-64 flex flex-col">
        {/* Top navbar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-4 lg:px-6 h-16">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <Coins className="h-4 w-4 text-primary" />
              <span className="font-display font-semibold text-foreground">{profile?.credits ?? 0}</span>
              <span className="text-xs text-muted-foreground">{t("credits")}</span>
            </div>
            <div className="lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setLang(lang === "en" ? "ar" : "en")}>
                <Globe className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-30 flex lg:hidden border-t border-border bg-background/90 backdrop-blur-sm">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.key}
            to={item.path}
            end={item.path === "/dashboard"}
            className="flex-1 flex flex-col items-center gap-1 py-2 text-muted-foreground text-xs transition-colors"
            activeClassName="text-primary"
          >
            <item.icon className="h-5 w-5" />
            <span>{t(item.key)}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
