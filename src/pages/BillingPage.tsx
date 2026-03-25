import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useCredits } from "@/hooks/useCredits";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Check, Coins, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const SAR_RATE = 3.75;

const creditPacks = [
  { name: "Starter", price: 9, credits: 100, popular: false },
  { name: "Growth", price: 19, credits: 300, popular: false },
  { name: "Pro", price: 39, credits: 750, popular: true },
  { name: "Scale", price: 79, credits: 2000, popular: false },
  { name: "Agency", price: 149, credits: 5000, popular: false },
];

const bundles = [
  {
    name: "Starter", price: 15, popular: false,
    items: ["5x 16s Videos", "5x Landing Pages", "FREE Subtitles"],
  },
  {
    name: "Growth", price: 35, popular: true,
    items: ["15x 16s Videos", "10x Landing Pages", "FREE Subtitles"],
  },
  {
    name: "Scale", price: 79, popular: false,
    items: ["40x 16s Videos", "25x Landing Pages", "FREE Subtitles", "Priority Support"],
  },
  {
    name: "Agency", price: 169, popular: false,
    items: ["100x 16s Videos", "50x Landing Pages", "FREE Subtitles", "Priority Support", "White Label"],
  },
];

export default function BillingPage() {
  const { t } = useI18n();
  const { profile } = useAuth();
  const { credits } = useCredits();
  const [currency, setCurrency] = useState<"USD" | "SAR">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("pricing_currency") as "USD" | "SAR") || "USD";
    }
    return "USD";
  });

  useEffect(() => {
    localStorage.setItem("pricing_currency", currency);
  }, [currency]);

  const formatPrice = (usd: number) =>
    currency === "SAR" ? `${Math.round(usd * SAR_RATE)} ر.س` : `$${usd}`;

  const balance = credits ?? profile?.credits ?? 0;

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

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">{t("billing")}</h2>
          <div className="inline-flex items-center gap-1 p-1 rounded-full glass-card text-sm">
            <button
              onClick={() => setCurrency("USD")}
              className={`px-3 py-1 rounded-full transition-all ${currency === "USD" ? "btn-primary-gradient text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              $ USD
            </button>
            <button
              onClick={() => setCurrency("SAR")}
              className={`px-3 py-1 rounded-full transition-all ${currency === "SAR" ? "btn-primary-gradient text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              ر.س SAR
            </button>
          </div>
        </div>

        {/* Current Plan */}
        <div className="glass-card p-6 gradient-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t("currentPlan")}</p>
              <p className="font-display text-2xl font-bold capitalize">{profile?.plan || "Free"}</p>
            </div>
            <div className="text-end">
              <p className="text-sm text-muted-foreground">{t("creditBalance")}</p>
              <p className="font-display text-3xl font-bold">{balance}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full btn-primary-gradient rounded-full transition-all"
                style={{ width: `${Math.min(100, (balance / Math.max(balance, 50)) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{balance} credits remaining</p>
          </div>
          {(profile?.plan === "free" || !profile?.plan) && (
            <div className="flex items-center gap-2 mt-3 text-sm text-primary">
              <Gift className="h-4 w-4" />
              <span>🎁 Free Trial — 50 credits to get started</span>
            </div>
          )}
        </div>

        {/* Credit Packs */}
        <div>
          <h3 className="font-display text-xl font-bold mb-1">💳 Buy Credit Packs</h3>
          <p className="text-sm text-muted-foreground mb-5">Flexible credits — use for any product</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {creditPacks.map((pack) => (
              <div key={pack.name} className={`glass-card p-5 flex flex-col ${pack.popular ? "gradient-border ring-1 ring-primary/30 relative" : ""}`}>
                {pack.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold btn-primary-gradient">
                    POPULAR
                  </span>
                )}
                <h4 className="font-display font-semibold">{pack.name}</h4>
                <p className="font-display text-3xl font-bold mt-1">{formatPrice(pack.price)}</p>
                <p className="text-sm text-primary font-medium mt-1 mb-4">{pack.credits.toLocaleString()} credits</p>
                <Button variant={pack.popular ? "gradient" : "outline"} size="sm" className="w-full mt-auto">
                  Buy Credits
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Credit Info Banner */}
        <div className="glass-card px-5 py-3 flex items-start gap-3 text-sm">
          <Coins className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">💡 How credits work:</span>{" "}
            8s Video = 30 credits · 16s Video = 50 credits · 24s Video = 75 credits · Landing Page = 25 credits · Subtitles = FREE
          </p>
        </div>

        {/* E-commerce Bundles */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-display text-xl font-bold">🛒 E-commerce Bundles</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold btn-primary-gradient">BEST VALUE</span>
          </div>
          <p className="text-sm text-muted-foreground mb-5">Best value for dropshippers</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bundles.map((bundle) => (
              <div key={bundle.name} className={`glass-card p-5 flex flex-col ${bundle.popular ? "gradient-border ring-1 ring-primary/30 relative" : ""}`}>
                {bundle.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold btn-primary-gradient">
                    POPULAR
                  </span>
                )}
                <h4 className="font-display font-semibold">{bundle.name}</h4>
                <p className="font-display text-3xl font-bold mt-1 mb-3">{formatPrice(bundle.price)}</p>
                <ul className="space-y-1.5 mb-4 flex-1">
                  {bundle.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant={bundle.popular ? "gradient" : "outline"} size="sm" className="w-full mt-auto">
                  Buy Bundle
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Credit History */}
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
                        <td className={`p-3 text-end font-medium ${tx.type === "debit" ? "text-destructive" : "text-emerald-400"}`}>
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
