import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PLANS } from "@/lib/types";
import { CreditCard, Coins, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function BillingPage() {
  const { t } = useI18n();
  const { profile } = useAuth();

  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  const currentPlan = PLANS.find((p) => p.key === profile?.plan) || PLANS[0];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="font-display text-2xl font-bold">{t("billing")}</h2>

        {/* Current plan */}
        <div className="glass-card p-6 gradient-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("currentPlan")}</p>
              <p className="font-display text-2xl font-bold capitalize">{profile?.plan || "Free"}</p>
            </div>
            <div className="text-end">
              <p className="text-sm text-muted-foreground">{t("creditBalance")}</p>
              <p className="font-display text-3xl font-bold">{profile?.credits ?? 0}</p>
            </div>
          </div>
          {/* Usage bar */}
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full btn-primary-gradient rounded-full transition-all"
                style={{ width: `${Math.min(100, ((profile?.credits ?? 0) / (currentPlan.credits || 50)) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{profile?.credits ?? 0} / {currentPlan.credits} {t("credits")}</p>
          </div>
        </div>

        {/* Upgrade options */}
        <div>
          <h3 className="font-display text-lg font-semibold mb-4">{t("upgradePlan")}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {PLANS.map((plan) => {
              const isActive = plan.key === profile?.plan;
              return (
                <div key={plan.key} className={`glass-card p-5 ${isActive ? "gradient-border" : ""}`}>
                  <h4 className="font-display font-semibold capitalize">{plan.key}</h4>
                  <p className="font-display text-2xl font-bold mt-1">${plan.price}<span className="text-sm text-muted-foreground">{t("month")}</span></p>
                  <p className="text-sm text-muted-foreground mt-1">{plan.credits} {t("credits")}</p>
                  <Button variant={isActive ? "glass" : "gradient"} size="sm" className="w-full mt-4" disabled={isActive}>
                    {isActive ? t("currentPlan") : t("upgradePlan")}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transaction history */}
        <div>
          <h3 className="font-display text-lg font-semibold mb-4">{t("creditHistory")}</h3>
          {!transactions?.length ? (
            <div className="glass-card p-8 text-center text-muted-foreground">
              No transactions yet
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-start p-3 text-muted-foreground font-medium">Date</th>
                      <th className="text-start p-3 text-muted-foreground font-medium">Description</th>
                      <th className="text-end p-3 text-muted-foreground font-medium">{t("credits")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-border/50">
                        <td className="p-3 text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</td>
                        <td className="p-3">{tx.description}</td>
                        <td className={`p-3 text-end font-medium ${tx.type === "debit" ? "text-destructive" : "text-success"}`}>
                          {tx.type === "debit" ? "-" : "+"}{tx.credits}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
