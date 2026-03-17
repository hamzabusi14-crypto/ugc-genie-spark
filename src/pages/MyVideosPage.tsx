import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Film, Download, Trash2, FastForward, Play, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
  const [extendVideoId, setExtendVideoId] = useState<string | null>(null);
  const [additionalDescription, setAdditionalDescription] = useState("");
  const [extendLoading, setExtendLoading] = useState(false);

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
            {videos.map((video) => {
              const isExtended = !!(video as any).parent_video_id;
              return (
                <div key={video.id} className={`glass-card overflow-hidden group ${video.status === "generating" ? "generating-border" : ""}`}>
                  <div
                    className="aspect-video bg-muted relative flex items-center justify-center cursor-pointer overflow-hidden"
                    onClick={() => video.video_url && setPlayVideo(video.video_url)}
                  >
                    {video.video_url ? (
                      <>
                        <img
                          src={video.video_url.replace(/\.[^.]+$/, '.jpg')}
                          alt={video.product_name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-12 w-12 text-white fill-white/80" />
                        </div>
                      </>
                    ) : video.thumbnail_url ? (
                      <img src={video.thumbnail_url} alt={video.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <Film className="h-10 w-10 text-muted-foreground" />
                    )}
                    {isExtended && (
                      <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        Extended
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium truncate">
                      {video.product_name}{isExtended ? " · Extended" : ""}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {isExtended ? "16s" : video.duration} · {new Date(video.created_at).toLocaleDateString()}
                      </span>
                      <StatusBadge status={video.status} />
                    </div>
                    <div className="flex gap-2 mt-3">
                      {video.status === "done" && video.video_url && (
                        <Button variant="glass" size="sm" onClick={() => {
                          const a = document.createElement('a');
                          a.href = video.video_url + '?fl_attachment=true';
                          a.download = 'video.mp4';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                        }}>
                          <Download className="h-3.5 w-3.5" />
                          {t("download")}
                        </Button>
                      )}
                      {video.status === "done" && !isExtended && (
                        <Button variant="glass" size="sm" onClick={() => {
                          setExtendVideoId(video.id);
                          setAdditionalDescription("");
                        }}>
                          <FastForward className="h-3.5 w-3.5" />
                          {t("extend")}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-destructive ms-auto" onClick={() => handleDelete(video.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Video player modal */}
        {playVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setPlayVideo(null)}>
            <button
              className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
              onClick={() => setPlayVideo(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="w-full max-w-md max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <video
                src={playVideo}
                controls
                autoPlay
                className="max-w-full max-h-[90vh] rounded-lg"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        )}

        {/* Extend video modal */}
        <Dialog open={!!extendVideoId} onOpenChange={(open) => { if (!open) setExtendVideoId(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Extend Video +8s</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="additionalDescription">Additional Description (Optional)</Label>
                <Textarea
                  id="additionalDescription"
                  placeholder="Environment, places, script ideas..."
                  value={additionalDescription}
                  onChange={(e) => setAdditionalDescription(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">Credit cost: <span className="font-semibold text-foreground">10 credits</span></p>
            </div>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={() => setExtendVideoId(null)}>
                Cancel
              </Button>
              <Button
                variant="gradient"
                disabled={extendLoading}
                onClick={async () => {
                  setExtendLoading(true);
                  try {
                    const extendVideo = videos?.find(v => v.id === extendVideoId);
                    await fetch("https://snap-automation1.app.n8n.cloud/webhook/extend-video", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        videoId: extendVideoId,
                        taskId: extendVideo?.task_id ?? "",
                        cloudinaryPublicId: (extendVideo as any)?.cloudinary_public_id ?? "",
                        productName: extendVideo?.product_name ?? "",
                        productImageUrl: extendVideo?.product_image_url ?? "",
                        language: extendVideo?.language ?? "",
                        targetedCountry: extendVideo?.country ?? "",
                        additionalDescription,
                      }),
                    });
                    toast.success("Video extension started");
                    setExtendVideoId(null);
                  } catch (err) {
                    toast.error("Failed to extend video");
                  } finally {
                    setExtendLoading(false);
                  }
                }}
              >
                {extendLoading ? "Extending..." : "Extend Video"}
              </Button>
            </DialogFooter>
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
