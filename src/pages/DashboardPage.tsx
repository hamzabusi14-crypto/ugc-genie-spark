import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useCredits } from "@/hooks/useCredits";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Coins, Film, TrendingUp, Zap } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { t } = useI18n();
  const { credits: balance } = useCredits();

  const creditBalance = balance ?? profile?.credits ?? 0;

  const { data: videos } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["video-stats"],
    queryFn: async () => {
      const { data: allVideos } = await supabase.from("videos").select("credits_used, status");
      const total = allVideos?.length ?? 0;
      const creditsUsed = allVideos?.reduce((sum, v) => sum + v.credits_used, 0) ?? 0;
      const done = allVideos?.filter((v) => v.status === "done").length ?? 0;
      return { total, creditsUsed, done };
    },
  });

  const videosRemaining16s = Math.floor(creditBalance / 50);
  const videosRemaining8s = Math.floor(creditBalance / 30);

  const statCards = [
    { label: t("videosCreated"), value: String(stats?.total ?? 0), sub: "", icon: Film, color: "text-primary" },
    { label: t("creditsUsed"), value: String(stats?.creditsUsed ?? 0), sub: "", icon: Coins, color: "text-secondary" },
    { label: t("videosRemaining"), value: `~${videosRemaining16s} videos`, sub: `or ${videosRemaining8s}x 8s videos`, icon: TrendingUp, color: "text-success" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold">{t("welcome")}, {profile?.name ?? "User"} 👋</h2>
            <p className="text-muted-foreground">{t("tagline")}</p>
          </div>
          <Button variant="gradient" size="lg" asChild>
            <Link to="/create">
              <Video className="h-5 w-5" />
              {t("createNewVideo")}
            </Link>
          </Button>
        </div>

        {/* Credit balance card */}
        <div className="glass-card p-6 gradient-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl btn-primary-gradient flex items-center justify-center">
              <Coins className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("creditBalance")}</p>
              <p className="font-display text-4xl font-bold">{profile?.credits ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="font-display text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent videos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-semibold">{t("recentVideos")}</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/videos">{t("myVideos")} →</Link>
            </Button>
          </div>
          {!videos?.length ? (
            <div className="glass-card p-12 text-center">
              <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No videos yet. Create your first one!</p>
              <Button variant="gradient" className="mt-4" asChild>
                <Link to="/create">{t("createNewVideo")}</Link>
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <Link key={video.id} to="/videos" className={`glass-card overflow-hidden group ${video.status === "generating" ? "generating-border" : ""}`}>
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {video.thumbnail_url ? (
                      <img src={video.thumbnail_url} alt={video.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <Film className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium truncate">{video.product_name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{video.duration}</span>
                      <StatusBadge status={video.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useI18n();
  if (status === "generating") return <span className="text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning pulse-yellow">{t("generating")}</span>;
  if (status === "done") return <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">{t("done")}</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">{t("failed")}</span>;
}
