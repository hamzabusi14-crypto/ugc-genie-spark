import { useState, useEffect, useCallback } from "react";
import { useSubtitleGenerator, SubtitleSettings, SubtitleJob } from "@/hooks/useSubtitleGenerator";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Download, Play, X, CheckCircle2, AlertCircle, Captions } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const FONTS = [
  { value: "Poppins/Poppins-ExtraBold.ttf", label: "Poppins Bold" },
  { value: "Roboto/Roboto-Bold.ttf", label: "Roboto Bold" },
  { value: "Montserrat/Montserrat-ExtraBold.ttf", label: "Montserrat Bold" },
  { value: "Bangers/Bangers-Regular.ttf", label: "Bangers" },
  { value: "Oswald/Oswald-Bold.ttf", label: "Oswald Bold" },
];

const TEXT_COLORS = [
  { value: "white", label: "White", hex: "#ffffff" },
  { value: "yellow", label: "Yellow", hex: "#facc15" },
  { value: "cyan", label: "Cyan", hex: "#22d3ee" },
  { value: "lime", label: "Lime", hex: "#a3e635" },
  { value: "pink", label: "Pink", hex: "#f472b6" },
];

const HIGHLIGHT_COLORS = [
  { value: "yellow", label: "Yellow", hex: "#facc15" },
  { value: "cyan", label: "Cyan", hex: "#22d3ee" },
  { value: "lime", label: "Lime", hex: "#a3e635" },
  { value: "red", label: "Red", hex: "#ef4444" },
  { value: "orange", label: "Orange", hex: "#f97316" },
  { value: "white", label: "White", hex: "#ffffff" },
];

const POSITIONS = [
  { value: "bottom75", label: "Bottom" },
  { value: "center", label: "Center" },
  { value: "top25", label: "Top" },
];

export default function SubtitleGenerator() {
  const { lang } = useI18n();
  const { isLoading, generateSubtitles, getJobStatus, getUserJobs } = useSubtitleGenerator();

  const [videoUrl, setVideoUrl] = useState("");
  const [font, setFont] = useState(FONTS[0].value);
  const [color, setColor] = useState("white");
  const [highlightColor, setHighlightColor] = useState("yellow");
  const [fontsize, setFontsize] = useState(7);
  const [maxChars, setMaxChars] = useState(20);
  const [subsPosition, setSubsPosition] = useState("bottom75");
  const [opacity, setOpacity] = useState(0);
  const [strokeColor, setStrokeColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(2.6);
  const [rightToLeft, setRightToLeft] = useState(false);
  const [translate, setTranslate] = useState(false);

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<SubtitleJob | null>(null);
  const [recentJobs, setRecentJobs] = useState<SubtitleJob[]>([]);
  const [playVideo, setPlayVideo] = useState<string | null>(null);

  // Load recent jobs on mount
  useEffect(() => {
    getUserJobs().then(setRecentJobs);
  }, [getUserJobs]);

  // Realtime subscription for subtitle_jobs
  useEffect(() => {
    const channel = supabase
      .channel("subtitle-jobs-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subtitle_jobs" },
        (payload) => {
          const updated = payload.new as unknown as SubtitleJob;
          if (activeJobId && updated?.id === activeJobId) {
            setActiveJob(updated);
          }
          getUserJobs().then(setRecentJobs);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeJobId, getUserJobs]);

  // Poll as fallback while processing
  useEffect(() => {
    if (!activeJobId || activeJob?.status === "completed" || activeJob?.status === "failed") return;
    const interval = setInterval(async () => {
      const job = await getJobStatus(activeJobId);
      if (job) setActiveJob(job);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeJobId, activeJob?.status, getJobStatus]);

  const handleGenerate = useCallback(async () => {
    if (!videoUrl.trim()) return;
    const settings: SubtitleSettings = {
      font,
      color,
      highlightColor,
      fontsize,
      maxChars,
      subsPosition,
      opacity,
      strokeColor,
      strokeWidth,
      rightToLeft,
      translate,
    };
    const jobId = await generateSubtitles(videoUrl.trim(), settings);
    if (jobId) {
      setActiveJobId(jobId);
      setActiveJob({ id: jobId, status: "processing" } as SubtitleJob);
    }
  }, [videoUrl, font, color, highlightColor, fontsize, maxChars, subsPosition, opacity, strokeColor, strokeWidth, rightToLeft, translate, generateSubtitles]);

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Captions className="h-5 w-5 text-primary" />
            {lang === "ar" ? "إضافة ترجمة" : "Add Subtitles"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Video URL */}
          <div>
            <Label>{lang === "ar" ? "رابط الفيديو" : "Video URL"} *</Label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/... or any video URL"
              className="mt-1 bg-muted border-border"
            />
          </div>

          {/* 2-col grid for settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Font */}
            <div>
              <Label>{lang === "ar" ? "الخط" : "Font"}</Label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger className="mt-1 bg-muted border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONTS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Position */}
            <div>
              <Label>{lang === "ar" ? "الموقع" : "Position"}</Label>
              <Select value={subsPosition} onValueChange={setSubsPosition}>
                <SelectTrigger className="mt-1 bg-muted border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Text Color */}
          <div>
            <Label className="mb-2 block">{lang === "ar" ? "لون النص" : "Text Color"}</Label>
            <div className="flex gap-2">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.value}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${color === c.value ? "border-primary scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setColor(c.value)}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Highlight Color */}
          <div>
            <Label className="mb-2 block">{lang === "ar" ? "لون التمييز" : "Highlight Color"}</Label>
            <div className="flex gap-2">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.value}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${highlightColor === c.value ? "border-primary scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setHighlightColor(c.value)}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <Label>{lang === "ar" ? "حجم الخط" : "Font Size"}: {fontsize}</Label>
            <Slider
              value={[fontsize]}
              onValueChange={([v]) => setFontsize(v)}
              min={4}
              max={12}
              step={1}
              className="mt-2"
            />
          </div>

          {/* Max Characters */}
          <div>
            <Label>{lang === "ar" ? "أقصى عدد حروف" : "Max Characters per Line"}: {maxChars}</Label>
            <Slider
              value={[maxChars]}
              onValueChange={([v]) => setMaxChars(v)}
              min={10}
              max={40}
              step={1}
              className="mt-2"
            />
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between gap-3 glass-card p-3 rounded-lg">
              <Label className="cursor-pointer">{lang === "ar" ? "يمين إلى يسار (عربي)" : "Right-to-Left (Arabic)"}</Label>
              <Switch checked={rightToLeft} onCheckedChange={setRightToLeft} />
            </div>
            <div className="flex items-center justify-between gap-3 glass-card p-3 rounded-lg">
              <Label className="cursor-pointer">{lang === "ar" ? "ترجمة إلى الإنجليزية" : "Translate to English"}</Label>
              <Switch checked={translate} onCheckedChange={setTranslate} />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            variant="gradient"
            size="xl"
            className="w-full"
            onClick={handleGenerate}
            disabled={isLoading || !videoUrl.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {lang === "ar" ? "جارٍ المعالجة..." : "Processing..."}
              </>
            ) : (
              <>
                <Captions className="h-5 w-5" />
                {lang === "ar" ? "إنشاء الترجمة" : "Generate Subtitles"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Active Job Status */}
      {activeJob && (
        <Card className="glass-card border-border">
          <CardContent className="p-6">
            <JobStatusCard job={activeJob} onPlay={(url) => setPlayVideo(url)} />
          </CardContent>
        </Card>
      )}

      {/* Recent Jobs */}
      {recentJobs.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-display font-semibold text-lg">
            {lang === "ar" ? "العمليات السابقة" : "Recent Jobs"}
          </h3>
          <div className="grid gap-3">
            {recentJobs
              .filter((j) => j.id !== activeJobId)
              .slice(0, 10)
              .map((job) => (
                <Card key={job.id} className="glass-card border-border">
                  <CardContent className="p-4">
                    <JobStatusCard job={job} onPlay={(url) => setPlayVideo(url)} />
                  </CardContent>
                </Card>
              ))}
          </div>
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
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function JobStatusCard({
  job,
  onPlay,
}: {
  job: SubtitleJob;
  onPlay: (url: string) => void;
}) {
  const { lang } = useI18n();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">{job.original_video_url}</p>
        <div className="flex items-center gap-2 mt-1">
          {job.status === "processing" && (
            <span className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning">
              <Loader2 className="h-3 w-3 animate-spin" />
              {lang === "ar" ? "جارٍ المعالجة..." : "Processing..."}
            </span>
          )}
          {job.status === "completed" && (
            <span className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">
              <CheckCircle2 className="h-3 w-3" />
              {lang === "ar" ? "مكتمل" : "Completed"}
            </span>
          )}
          {job.status === "failed" && (
            <span className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">
              <AlertCircle className="h-3 w-3" />
              {lang === "ar" ? "فشل" : "Failed"}
            </span>
          )}
          {job.status === "pending" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {lang === "ar" ? "قيد الانتظار" : "Pending"}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {new Date(job.created_at).toLocaleString()}
          </span>
        </div>
        {job.status === "failed" && job.error_message && (
          <p className="text-xs text-destructive mt-1">{job.error_message}</p>
        )}
      </div>

      {job.status === "completed" && job.subtitled_video_url && (
        <div className="flex gap-2 shrink-0">
          <Button variant="glass" size="sm" onClick={() => onPlay(job.subtitled_video_url!)}>
            <Play className="h-3.5 w-3.5" />
            {lang === "ar" ? "تشغيل" : "Play"}
          </Button>
          <Button
            variant="glass"
            size="sm"
            onClick={() => {
              const a = document.createElement("a");
              a.href = job.subtitled_video_url + "?fl_attachment=true";
              a.download = "subtitled-video.mp4";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            <Download className="h-3.5 w-3.5" />
            {lang === "ar" ? "تحميل" : "Download"}
          </Button>
        </div>
      )}
    </div>
  );
}
