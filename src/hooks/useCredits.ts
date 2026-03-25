import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const CREDIT_COSTS: Record<string, number> = {
  "8s": 30,
  "16s": 50,
  "24s": 75,
  "landing_page": 25,
  "subtitles": 0,
  "extension": 10,
  "faceless": 10,
};

export function useCredits() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (!user) { setCredits(null); setLoading(false); return; }
    const { data } = await supabase
      .from("user_credits" as any)
      .select("credits")
      .eq("user_id", user.id)
      .single();
    setCredits((data as any)?.credits ?? 0);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCredits(); }, [fetchCredits]);

  const getCost = (type: string) => CREDIT_COSTS[type] ?? 0;

  const hasEnough = (type: string) => {
    const cost = getCost(type);
    return cost === 0 || (credits !== null && credits >= cost);
  };

  const deductCredits = async (type: string): Promise<boolean> => {
    if (!user) return false;
    const cost = getCost(type);
    if (cost === 0) return true;
    if (credits === null || credits < cost) return false;

    const { error } = await supabase
      .from("user_credits" as any)
      .update({ credits: credits - cost, updated_at: new Date().toISOString() } as any)
      .eq("user_id", user.id);

    if (error) return false;
    setCredits((prev) => (prev !== null ? prev - cost : prev));
    return true;
  };

  return { credits, loading, fetchCredits, getCost, hasEnough, deductCredits, CREDIT_COSTS };
}
