import { useState, useEffect, useCallback, useRef } from "react";
import { useSubtitleGenerator, SubtitleSettings, SubtitleJob } from "@/hooks/useSubtitleGenerator";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, Download, Play, X, CheckCircle2, AlertCircle, Captions, Upload, ChevronDown, Link as LinkIcon, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ACCEPTED_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/x-msvideo"];

const ARABIC_FONTS = [
  { value: "Arial/Arial_Bold.ttf", label: "Arial Bold" },
];

const ENGLISH_FONTS = [
  { value: "Poppins/Poppins-Bold.ttf", label: "Poppins Bold" },
  { value: "Poppins/Poppins-ExtraBold.ttf", label: "Poppins Extra Bold" },
  { value: "Poppins/Poppins-Black.ttf", label: "Poppins Black" },
  { value: "Poppins/Poppins-BoldItalic.ttf", label: "Poppins Bold Italic" },
  { value: "Atkinson_Hyperlegible/AtkinsonHyperlegible-Bold.ttf", label: "Atkinson Bold" },
  { value: "M_PLUS_Rounded_1c/MPLUSRounded1c-ExtraBold.ttf", label: "M PLUS Rounded" },
];

const TEXT_COLORS = [
  { value: "#ffffff", label: "White", hex: "#ffffff" },
  { value: "#facc15", label: "Yellow", hex: "#facc15" },
  { value: "#22d3ee", label: "Cyan", hex: "#22d3ee" },
  { value: "#a3e635", label: "Lime", hex: "#a3e635" },
  { value: "#f472b6", label: "Pink", hex: "#f472b6" },
];

const HIGHLIGHT_COLORS = [
  { value: "#facc15", label: "Yellow", hex: "#facc15" },
  { value: "#22d3ee", label: "Cyan", hex: "#22d3ee" },
  { value: "#a3e635", label: "Lime", hex: "#a3e635" },
  { value: "#ef4444", label: "Red", hex: "#ef4444" },
  { value: "#f97316", label: "Orange", hex: "#f97316" },
  { value: "#ffffff", label: "White", hex: "#ffffff" },
];

const POSITIONS = [
  { value: "bottom75", label: "Bottom" },
  { value: "center", label: "Center" },
  { value: "top25", label: "Top" },
];

const STYLE_PRESETS = [
  { 
    name: "TikTok", 
    nameAr: "تيك توك",
    color: "#ffffff", 
    highlightColor: "#facc15", 
    fontsize: 7, 
    maxChars: 10,
    subsPosition: "center"
  },
  { 
    name: "Clean", 
    nameAr: "بسيط",
    color: "#ffffff", 
    highlightColor: "#ffffff", 
    fontsize: 5, 
    maxChars: 15,
    subsPosition: "bottom75"
  },
  { 
    name: "Bold", 
    nameAr: "عريض",
    color: "#facc15", 
    highlightColor: "#ef4444", 
    fontsize: 8, 
    maxChars: 8,
    subsPosition: "center"
  },
  { 
    name: "Neon", 
    nameAr: "نيون",
    color: "#22d3ee", 
    highlightColor: "#f472b6", 
    fontsize: 6, 
    maxChars: 12,
    subsPosition: "center"
  },
];

export default function SubtitleGenerator() {
  const { lang } = useI18n();
  const { isLoading, generateSubtitles, getJobStatus, getUserJobs } = useSubtitleGenerator();

  const [videoUrl, setVideoUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlOpen, setUrlOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [font, setFont] = useState(ARABIC_FONTS[0].value);
  const [color, setColor] = useState("#ffffff");
  const [highlightColor, setHighlightColor] = useState("#facc15");
  const [fontsize, setFontsize] = useState(7);
  const [maxChars, setMaxChars] = useState(10);
  const [subsPosition, setSubsPosition] = useState("center");
  const [opacity, setOpacity] = useState(0.7);
  const [strokeColor, setStrokeColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(1.5);
  const [languageCode, setLanguageCode] = useState<'ar' | 'en'>("ar");
  const [selectedPreset, setSelectedPreset] = useState<string | null>("TikTok");

  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<SubtitleJob | null>(null);
  const [recentJobs, setRecentJobs] = useState<SubtitleJob[]>([]);
  const [playVideo, setPlayVideo] = useState<string | null>(null);

  useEffect(() => {
    if (languageCode === 'ar') {
      setFont('Arial/Arial_Bold.ttf');
    } else {
      setFont('Poppins/Poppins-Bold.ttf');
    }
  }, [languageCode]);

  useEffect(() => {
    getUserJobs().then(setRecentJobs);
  }, [getUserJobs]);

  useEffect(() => {
    const channel = supabase
      .channel("subtitle-jobs-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "subtitle_jobs" }, (payload) => {
        const updated = payload.new as unknown as SubtitleJob;
        if (activeJobId && updated?.id === activeJobId) setActiveJob(updated);
        getUserJobs().then(setRecentJobs);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeJobId, getUserJobs]);

  useEffect(() => {
    if (!activeJobId || activeJob?.status === "completed" || activeJob?.status === "failed") return;
    const interval = setInterval(async () => {
      const job = await getJobStatus(activeJobId);
      if (job) setActiveJob(job);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeJobId, activeJob?.status, getJobStatus]);

  const applyPreset = (preset: typeof STYLE_PRESETS[0]) => {
    setColor(preset.color);
    setHighlightColor(preset.highlightColor);
    setFontsize(preset.fontsize);
    setMaxChars(preset.maxChars);
    setSubsPosition(preset.subsPosition);
    setSelectedPreset(preset.name);
  };

  const uploadToCloudinary = useCallback(async (file: File): Promise<string | null> => {
    setUploading(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "n8n-upload");

      return await new Promise<string | null>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.cloudinary.com/v1_1/da2zkmtcn/video/upload");

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            if (data.secure_url) {
              toast.success(lang === "ar" ? "تم رفع الفيديو!" : "Video uploaded!");
              resolve(data.secure_url);
            } else {
              reject(new Error("No URL in response"));
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(formData);
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload video");
      return null;
    } finally {
      setUploading(false);
    }
  }, [lang]);

  const handleFileSelect = useCallback(async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error(lang === "ar" ? "حجم الملف يتجاوز 100 ميجابايت" : "File size exceeds 100MB limit");
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error(lang === "ar" ? "نوع الملف غير مدعوم" : "Unsupported file type. Use MP4, MOV, WebM, or AVI");
      return;
    }
    setUploadedFile(file);
    setUploadPreview(URL.createObjectURL(file));

    const url = await uploadToCloudinary(file);
    if (url) {
      setVideoUrl(url);
    } else {
      setUploadedFile(null);
      setUploadPreview(null);
    }
  }, [lang, uploadToCloudinary]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const clearUpload = useCallback(() => {
    setUploadedFile(null);
    setUploadPreview(null);
    setVideoUrl("");
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!videoUrl.trim()) return;
    const settings: SubtitleSettings = {
      font, color, highlightColor, fontsize, maxChars, subsPosition,
      opacity, strokeColor, strokeWidth, languageCode,
    };
    const jobId = await generateSubtitles(videoUrl.trim(), settings);
    if (jobId) {
      setActiveJobId(jobId);
      setActiveJob({ id: jobId, status: "processing" } as SubtitleJob);
    }
  }, [videoUrl, font, color, highlightColor, fontsize, maxChars, subsPosition, opacity, strokeColor, strokeWidth, languageCode, generateSubtitles]);

  const hasVideo = !!videoUrl.trim();

  return (
    <div className="space-y-6">
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Captions className="h-5 w-5 text-primary" />
            {lang === "ar" ? "إضافة ترجمة" : "Add Subtitles"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Upload Dropzone */}
          {!uploadedFile && !videoUrl && (
            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/30"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium text-lg">
                {lang === "ar" ? "اسحب وأفلت فيديو هنا" : "Drag & drop your video here"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {lang === "ar" ? "أو انقر للاستعراض • MP4, MOV, WebM • حد أقصى 100MB" : "or click to browse • MP4, MOV, WebM • Max 100MB"}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp4,.mov,.webm,.avi,video/mp4,video/quicktime,video/webm,video/x-msvideo"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
              />
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {lang === "ar" ? "جارٍ رفع الفيديو..." : "Uploading video..."}
                </span>
                <span className="font-medium text-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Uploaded Video Preview */}
          {uploadedFile && uploadPreview && !uploading && (
            <div className="rounded-xl overflow-hidden border border-border relative">
              <video
                src={uploadPreview}
                controls
                className="w-full max-h-48 object-contain bg-black"
              />
              <div className="p-3 flex items-center justify-between bg-muted/50">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive shrink-0" onClick={clearUpload}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* URL Alternative */}
          {!uploadedFile && (
            <Collapsible open={urlOpen} onOpenChange={setUrlOpen}>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
                <LinkIcon className="h-4 w-4" />
                {lang === "ar" ? "أو أدخل رابط الفيديو" : "Or paste a video URL"}
                <ChevronDown className={`h-4 w-4 ms-auto transition-transform ${urlOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-muted border-border"
                />
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Style Presets */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{lang === "ar" ? "أنماط سريعة" : "Quick Styles"}</Label>
            <div className="grid grid-cols-4 gap-2">
              {STYLE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    selectedPreset === preset.name
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border hover:border-primary/50 bg-muted/30"
                  }`}
                >
                  <div 
                    className="w-full h-8 rounded-lg mb-2 flex items-center justify-center text-sm font-bold"
                    style={{ 
                      backgroundColor: "#0a0a0a",
                      color: preset.highlightColor,
                      textShadow: "0 0 10px currentColor"
                    }}
                  >
                    Aa
                  </div>
                  <span className="text-xs font-medium">
                    {lang === "ar" ? preset.nameAr : preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{lang === "ar" ? "معاينة مباشرة" : "Live Preview"}</Label>
            <div 
              className="relative rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/50 to-pink-900/50 aspect-video flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600')] bg-cover bg-center opacity-40" />
              <div 
                className="relative text-center px-6 py-3 rounded-lg"
                style={{ backgroundColor: `rgba(0,0,0,${opacity})` }}
              >
                <span 
                  className="font-bold"
                  style={{ 
                    color: color,
                    fontSize: `${fontsize * 4}px`,
                    textShadow: `2px 2px 4px ${strokeColor}, -1px -1px 2px ${strokeColor}`
                  }}
                >
                  {languageCode === "ar" ? "مرحباً " : "Hello "}
                </span>
                <span 
                  className="font-bold"
                  style={{ 
                    color: highlightColor,
                    fontSize: `${fontsize * 4}px`,
                    textShadow: `2px 2px 4px ${strokeColor}, -1px -1px 2px ${strokeColor}, 0 0 20px ${highlightColor}`
                  }}
                >
                  {languageCode === "ar" ? "بالعالم" : "World"}
                </span>
              </div>
            </div>
          </div>

          {/* Language & Font Section */}
          <div className="glass-card p-4 space-y-4 rounded-xl">
            <Label className="text-sm font-semibold">{lang === "ar" ? "اللغة والخط" : "Language & Font"}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  {lang === "ar" ? "لغة الفيديو" : "Video Language"}
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={languageCode === 'ar' ? 'default' : 'outline'}
                    onClick={() => setLanguageCode('ar')}
                    className={`flex-1 ${languageCode === 'ar' ? 'btn-primary-gradient' : ''}`}
                  >
                    العربية
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={languageCode === 'en' ? 'default' : 'outline'}
                    onClick={() => setLanguageCode('en')}
                    className={`flex-1 ${languageCode === 'en' ? 'btn-primary-gradient' : ''}`}
                  >
                    English
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  {lang === "ar" ? "نوع الخط" : "Font"}
                </Label>
                <Select value={font} onValueChange={setFont}>
                  <SelectTrigger className="bg-muted border-border h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(languageCode === 'ar' ? ARABIC_FONTS : ENGLISH_FONTS).map((f) => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Colors Section */}
          <div className="glass-card p-4 space-y-4 rounded-xl">
            <Label className="text-sm font-semibold">{lang === "ar" ? "الألوان" : "Colors"}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  {lang === "ar" ? "لون النص" : "Text Color"}
                </Label>
                <div className="flex gap-2">
                  {TEXT_COLORS.map((c) => (
                    <button 
                      key={c.value} 
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        color === c.value ? "border-primary scale-110 ring-2 ring-primary/30" : "border-border hover:scale-105"
                      }`} 
                      style={{ backgroundColor: c.hex }} 
                      onClick={() => { setColor(c.value); setSelectedPreset(null); }} 
                      title={c.label} 
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  {lang === "ar" ? "لون التمييز" : "Highlight"}
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button 
                      key={c.value} 
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        highlightColor === c.value ? "border-primary scale-110 ring-2 ring-primary/30" : "border-border hover:scale-105"
                      }`} 
                      style={{ backgroundColor: c.hex }} 
                      onClick={() => { setHighlightColor(c.value); setSelectedPreset(null); }} 
                      title={c.label} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Size & Position Section - Collapsible */}
          <Collapsible>
            <div className="glass-card rounded-xl overflow-hidden">
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <Label className="text-sm font-semibold cursor-pointer">
                  {lang === "ar" ? "الحجم والموقع" : "Size & Position"}
                </Label>
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-4">
                  {/* Position */}
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      {lang === "ar" ? "الموقع" : "Position"}
                    </Label>
                    <div className="flex gap-2">
                      {POSITIONS.map((p) => (
                        <Button
                          key={p.value}
                          type="button"
                          size="sm"
                          variant={subsPosition === p.value ? 'default' : 'outline'}
                          onClick={() => setSubsPosition(p.value)}
                          className={`flex-1 ${subsPosition === p.value ? 'btn-primary-gradient' : ''}`}
                        >
                          {p.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">{lang === "ar" ? "حجم الخط" : "Font Size"}</Label>
                      <span className="text-xs font-semibold text-primary">{fontsize}</span>
                    </div>
                    <Slider 
                      value={[fontsize]} 
                      onValueChange={([v]) => { setFontsize(v); setSelectedPreset(null); }} 
                      min={4} max={12} step={1} 
                    />
                  </div>

                  {/* Max Characters */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">{lang === "ar" ? "أقصى حروف بالسطر" : "Max Chars/Line"}</Label>
                      <span className="text-xs font-semibold text-primary">{maxChars}</span>
                    </div>
                    <Slider 
                      value={[maxChars]} 
                      onValueChange={([v]) => { setMaxChars(v); setSelectedPreset(null); }} 
                      min={8} max={25} step={1} 
                    />
                  </div>

                  {/* Background Opacity */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">{lang === "ar" ? "خلفية النص" : "Text Background"}</Label>
                      <span className="text-xs font-semibold text-primary">{Math.round(opacity * 100)}%</span>
                    </div>
                    <Slider 
                      value={[opacity]} 
                      onValueChange={([v]) => setOpacity(v)} 
                      min={0} max={1} step={0.1} 
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Generate Button */}
          <Button 
            variant="gradient" 
            size="xl" 
            className="w-full" 
            onClick={handleGenerate} 
            disabled={isLoading || !hasVideo || uploading}
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
          <h3 className="font-display font-semibold text-lg">{lang === "ar" ? "العمليات السابقة" : "Recent Jobs"}</h3>
          <div className="grid gap-3">
            {recentJobs.filter((j) => j.id !== activeJobId).slice(0, 10).map((job) => (
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
          <button className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors" onClick={() => setPlayVideo(null)}>
            <X className="h-6 w-6" />
          </button>
          <div className="w-full max-w-md max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <video src={playVideo} controls autoPlay className="max-w-full max-h-[90vh] rounded-lg" style={{ objectFit: "contain" }} />
          </div>
        </div>
      )}
    </div>
  );
}

function JobStatusCard({ job, onPlay }: { job: SubtitleJob; onPlay: (url: string) => void }) {
  const { lang } = useI18n();
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground truncate">{job.original_video_url}</p>
        <div className="flex items-center gap-2 mt-1">
          {job.status === "processing" && (
            <span className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-warning/20 text-warning">
              <Loader2 className="h-3 w-3 animate-spin" />{lang === "ar" ? "جارٍ المعالجة..." : "Processing..."}
            </span>
          )}
          {job.status === "completed" && (
            <span className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-success/20 text-success">
              <CheckCircle2 className="h-3 w-3" />{lang === "ar" ? "مكتمل" : "Completed"}
            </span>
          )}
          {job.status === "failed" && (
            <span className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">
              <AlertCircle className="h-3 w-3" />{lang === "ar" ? "فشل" : "Failed"}
            </span>
          )}
          {job.status === "pending" && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{lang === "ar" ? "قيد الانتظار" : "Pending"}</span>
          )}
          <span className="text-xs text-muted-foreground">{new Date(job.created_at).toLocaleString()}</span>
        </div>
        {job.status === "failed" && job.error_message && (
          <p className="text-xs text-destructive mt-1">{job.error_message}</p>
        )}
      </div>
      {job.status === "completed" && job.subtitled_video_url && (
        <div className="flex gap-2 shrink-0">
          <Button variant="glass" size="sm" onClick={() => onPlay(job.subtitled_video_url!)}>
            <Play className="h-3.5 w-3.5" />{lang === "ar" ? "تشغيل" : "Play"}
          </Button>
          <Button variant="glass" size="sm" onClick={() => {
            const a = document.createElement("a");
            a.href = job.subtitled_video_url + "?fl_attachment=true";
            a.download = "subtitled-video.mp4";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}>
            <Download className="h-3.5 w-3.5" />{lang === "ar" ? "تحميل" : "Download"}
          </Button>
        </div>
      )}
    </div>
  );
}
