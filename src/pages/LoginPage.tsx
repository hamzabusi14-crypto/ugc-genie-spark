import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export default function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/dashboard" },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass-card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold gradient-text mb-2">OFA AI</h1>
          <p className="text-muted-foreground">{t("login")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("email")}</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 bg-muted border-border" />
          </div>
          <div>
            <Label htmlFor="password">{t("password")}</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 bg-muted border-border" />
          </div>
          <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
            {loading ? "..." : t("login")}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">{t("orContinueWith")}</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Button variant="glass" className="w-full" onClick={handleGoogleLogin}>
          {t("google")}
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t("noAccount")}{" "}
          <Link to="/signup" className="text-primary hover:underline">{t("signup")}</Link>
        </p>
      </div>
    </div>
  );
}
