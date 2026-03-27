import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/hooks/useCredits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, Coins } from "lucide-react";

export default function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const { profile, refreshProfile } = useAuth();
  const { credits, fetchCredits } = useCredits();

  const [name, setName] = useState(profile?.name ?? "");
  const [email] = useState(profile?.email ?? "");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [updatingCredits, setUpdatingCredits] = useState(false);
  const isAdmin = profile?.email === "hamzaakarid14@gmail.com";

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name, language: lang })
      .eq("id", profile!.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Settings saved!");
      await refreshProfile();
    }
  };

  const handleUpdateCredits = async () => {
    const amount = parseInt(creditAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid positive number");
      return;
    }
    setUpdatingCredits(true);
    const { error } = await supabase
      .from("user_credits" as any)
      .update({ credits: (credits ?? 0) + amount, updated_at: new Date().toISOString() } as any)
      .eq("user_id", profile!.id);
    setUpdatingCredits(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Added ${amount} credits!`);
      setCreditAmount("");
      fetchCredits();
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="font-display text-2xl font-bold">{t("settings")}</h2>

        {/* Profile */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">{t("profile")}</h3>
          <div>
            <Label htmlFor="name">{t("name")}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 bg-muted border-border" />
          </div>
          <div>
            <Label>{t("email")}</Label>
            <Input value={email} disabled className="mt-1 bg-muted border-border opacity-50" />
          </div>
        </div>

        {/* Language */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold">{t("languagePref")}</h3>
          <div className="flex gap-3">
            {[
              { code: "en" as const, label: "English" },
              { code: "ar" as const, label: "العربية" },
            ].map((l) => (
              <button
                key={l.code}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                  lang === l.code ? "btn-primary-gradient" : "glass-card hover:bg-[rgba(255,255,255,0.1)]"
                }`}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold">{t("notifications")}</h3>
              <p className="text-sm text-muted-foreground">Receive email notifications for video completions</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>
        </div>

        <Button variant="gradient" size="lg" className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? "..." : t("save")}
        </Button>

        {/* Admin Credits Management */}
        {isAdmin && (
          <div className="glass-card p-6 space-y-4 border border-primary/30">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Admin: Credits Management</h3>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
              <Coins className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Current balance:</span>
              <span className="font-display font-bold text-foreground">{credits ?? 0}</span>
            </div>
            <div>
              <Label htmlFor="credit-amount">Add Credits</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="credit-amount"
                  type="number"
                  min="1"
                  placeholder="e.g. 100"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="bg-muted border-border"
                />
                <Button variant="gradient" onClick={handleUpdateCredits} disabled={updatingCredits}>
                  {updatingCredits ? "..." : "Update Credits"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
