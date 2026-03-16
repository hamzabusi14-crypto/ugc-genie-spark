import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Film, Download, Trash2, FastForward } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function MyVideosPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const { data: videos, refetch } = useQuery({
    queryKey: ["all-videos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("videos-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "videos" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["all-videos"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const [playVideo, setPlayVideo] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Video deleted");
      refetch();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">{t("myVideos")}</h2>
          <Button variant="gradient" asChild>
            <Link to="/create">{t("createNewVideo")}</Link>
          </Button>
        </div>

        {!videos?.length ? (
          <div className="glass-card p-16 text-center">
            <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">No videos yet</p>
            <Button variant="gradient" className="mt-4" asChild>
              <Link to="/create">{t("createNewVideo")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className={`glass-card overflow-hidden group ${video.status === "generating" ? "generating-border" : ""}`}>
                <div
                  className="aspect-video bg-muted flex items-center justify-center cursor-pointer"
                  onClick={() => video.video_url && setPlayVideo(video.video_url)}
                >
                  {video.thumbnail_url ? (
                    <img src={video.thumbnail_url} alt={video.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <Film className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-medium truncate">{video.product_name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{video.duration} · {new Date(video.created_at).toLocaleDateString()}</span>
                    <StatusBadge status={video.status} />
                  </div>
                  <div className="flex gap-2 mt-3">
                    {video.status === "done" && video.video_url && (
                      <Button variant="glass" size="sm" asChild>
                        <a href={video.video_url} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-3.5 w-3.5" />
                          {t("download")}
                        </a>
                      </Button>
                    )}
                    {video.status === "done" && (
                      <Button variant="glass" size="sm" asChild>
                        <Link to={`/extend/${video.id}`}>
                          <FastForward className="h-3.5 w-3.5" />
                          {t("extend")}
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-destructive ms-auto" onClick={() => handleDelete(video.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video player modal */}
        <Dialog open={!!playVideo} onOpenChange={() => setPlayVideo(null)}>
          <DialogContent className="max-w-3xl bg-card border-border p-0 overflow-hidden">
            {playVideo && (
              <video src={playVideo} controls autoPlay className="w-full" />
            )}
          </DialogContent>
        </Dialog>
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
