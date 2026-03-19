import { useParams, useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FastForward, CheckCircle, Clock, Loader2, Film, Coins } from "lucide-react";
import { useState } from "react";

export default function ExtendVideoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { profile, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const [extending, setExtending] = useState(false);

  const { data: video } = useQuery({
    queryKey: ["video", id],
    queryFn: async () => {
      const { data } = await supabase.from("videos").select("*").eq("id", id!).single();
      return data;
    },
    enabled: !!id,
  });

  const { data: segments } = useQuery({
    queryKey: ["segments", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("script_segments")
        .select("*")
        .eq("video_id", id!)
        .order("segment_number", { ascending: true });
      return data ?? [];
    },
    enabled: !!id,
  });

  const handleExtend = async () => {
    // if ((profile?.credits ?? 0) < 5) {
    //   toast.error(t("insufficientCredits"));
    //   return;
    // }

    setExtending(true);
    try {
      const res = await fetch("https://snap-automation1.app.n8n.cloud/webhook/extend-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: video?.task_id,
          currentSegment: video?.current_segment ?? 1,
          userId: profile?.id,
        }),
      });
      if (!res.ok) throw new Error("Extension failed");

      // Update segment
      await supabase
        .from("videos")
        .update({ current_segment: (video?.current_segment ?? 1) + 1 })
        .eq("id", id!);

      // Deduct credits (disabled for testing)
      // await supabase
      //   .from("profiles")
      //   .update({ credits: (profile?.credits ?? 0) - 5 })
      //   .eq("id", profile!.id);

      // await supabase.from("transactions").insert({
      //   user_id: profile!.id,
      //   type: "debit",
      //   amount: 0,
      //   credits: 5,
      //   description: `Video extension: ${video?.product_name}`,
      // });

      await refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["video", id] });
      queryClient.invalidateQueries({ queryKey: ["segments", id] });
      
      // Redirect to progress page
      navigate(`/extend-progress/${id}?name=${encodeURIComponent(video?.product_name || "")}`);
    } catch (err: any) {
      toast.error(err.message || "Extension failed");
    }
    setExtending(false);
  };

  if (!video) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const totalDuration = (video.current_segment ?? 1) * 8;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="font-display text-2xl font-bold">{t("extendVideo")}</h2>

        {/* Video player */}
        <div className="glass-card overflow-hidden">
          {video.video_url ? (
            <video src={video.video_url} controls className="w-full" />
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Film className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="glass-card p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">{video.product_name}</p>
            <p className="text-sm text-muted-foreground">{t("totalDuration")}: {totalDuration}s</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Coins className="h-4 w-4 text-primary" />
            5 {t("credits")} {t("perSegment")}
          </div>
        </div>

        {/* Segments */}
        <div className="space-y-3">
          {segments?.map((seg) => (
            <div key={seg.id} className="glass-card p-4 flex items-start gap-3">
              {seg.status === "done" ? (
                <CheckCircle className="h-5 w-5 text-success mt-0.5 shrink-0" />
              ) : (
                <Clock className="h-5 w-5 text-warning mt-0.5 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Segment {seg.segment_number}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${seg.status === "done" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}`}>
                    {seg.status === "done" ? t("done") : "Pending"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{seg.paragraph_text}</p>
              </div>
            </div>
          ))}
          {!segments?.length && (
            <div className="glass-card p-8 text-center text-muted-foreground">
              No segments available yet
            </div>
          )}
        </div>

        {/* Extend button */}
        <Button variant="gradient" size="lg" className="w-full" onClick={handleExtend} disabled={extending}>
          {extending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <FastForward className="h-5 w-5" />
          )}
          {t("extend")}
        </Button>
      </div>
    </DashboardLayout>
  );
}
