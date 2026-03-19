import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import { CREDIT_COSTS } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Upload, Coins, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  { key: "analyzing", min: 0 },
  { key: "generatingImage", min: 15 },
  { key: "creatingScript", min: 60 },
  { key: "generatingVideo", min: 90 },
  { key: "finalizing", min: 300 },
] as const;

export default function CreateVideoPage() {
  const { profile, refreshProfile } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState("8s");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [language, setLanguage] = useState("Arabic");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [stage, setStage] = useState(0);
  const isSubmitting = useRef(false);

  const creditCost = CREDIT_COSTS[duration] || 10;

  const handleImageSelect = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    setProductImage(file);
    setImagePreview(URL.createObjectURL(file));

    // Upload to Cloudinary
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "n8n-upload");
      const res = await fetch("https://api.cloudinary.com/v1_1/da2zkmtcn/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        toast.success("Image uploaded!");
      } else {
        throw new Error("Upload failed");
      }
    } catch {
      toast.error("Failed to upload image");
      setImageUrl(null);
    }
    setUploading(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleImageSelect(file);
  }, [handleImageSelect]);

  const handleGenerate = async () => {
    if (!productName.trim() || !imageUrl || !country.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    if ((profile?.credits ?? 0) < creditCost) {
      toast.error(t("insufficientCredits"));
      return;
    }

    setGenerating(true);
    setStage(0);

    // Progress stages
    const interval = setInterval(() => {
      setStage((prev) => Math.min(prev + 1, STAGES.length - 1));
    }, 15000);

    try {
      // Create video record first to get the ID
      const { data: videoRecord, error: dbError } = await supabase.from("videos").insert({
        user_id: profile!.id,
        product_name: productName.trim(),
        product_image_url: imageUrl,
        status: "generating",
        duration,
        aspect_ratio: aspectRatio,
        language,
        country: country.trim(),
        description: description.trim() || null,
        credits_used: creditCost,
      }).select("id").single();

      if (dbError || !videoRecord) throw dbError || new Error("Failed to create video record");

      // Send to n8n webhook with videoId
      const res = await fetch("https://snap-automation1.app.n8n.cloud/webhook/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoRecord.id,
          productName: productName.trim(),
          productImage: imageUrl,
          duration,
          aspectRatio,
          language,
          country: country.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Webhook failed");

      const result = await res.json();

      // Update task_id if returned by n8n
      if (result?.taskId) {
        await supabase.from("videos").update({ task_id: result.taskId }).eq("id", videoRecord.id);
      }

      // Deduct credits
      await supabase
        .from("profiles")
        .update({ credits: (profile?.credits ?? 0) - creditCost })
        .eq("id", profile!.id);

      // Log transaction
      await supabase.from("transactions").insert({
        user_id: profile!.id,
        type: "debit",
        amount: 0,
        credits: creditCost,
        description: `Video generation: ${productName.trim()}`,
      });

      await refreshProfile();
      toast.success(t("videoStarted"));
      navigate(`/video-progress/${videoRecord.id}?duration=${duration}`);
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
    } finally {
      clearInterval(interval);
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">{t("createVideo")}</h2>
          <p className="text-muted-foreground mt-1">{t("tagline")}</p>
        </div>

        <div className="glass-card p-6 space-y-6">
          {/* Product Name */}
          <div>
            <Label htmlFor="productName">{t("productName")} *</Label>
            <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={t("productNamePlaceholder")} className="mt-1 bg-muted border-border" required />
          </div>

          {/* Product Image */}
          <div>
            <Label>{t("productImage")} *</Label>
            <div
              className="mt-1 border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">{t("dropImage")}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t("orBrowse")}</p>
                </div>
              )}
              <input id="fileInput" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }} />
            </div>
          </div>

          {/* Duration */}
          <div>
            <Label>{t("duration")}</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="mt-1 bg-muted border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8s">8s</SelectItem>
                <SelectItem value="16s">16s</SelectItem>
                <SelectItem value="24s">24s</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Aspect Ratio */}
          <div>
            <Label>{t("aspectRatio")}</Label>
            <div className="flex gap-3 mt-1">
              {[{ value: "9:16", label: "Portrait (9:16)" }, { value: "16:9", label: "Landscape (16:9)" }].map((ar) => (
                <button
                  key={ar.value}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    aspectRatio === ar.value ? "btn-primary-gradient" : "glass-card hover:bg-[rgba(255,255,255,0.1)]"
                  }`}
                  onClick={() => setAspectRatio(ar.value)}
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <Label>{t("language")}</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-1 bg-muted border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arabic">{t("arabic")}</SelectItem>
                <SelectItem value="English">{t("english")}</SelectItem>
                <SelectItem value="French">{t("french")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Country */}
          <div>
            <Label>{t("targetCountry")} *</Label>
            <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder={t("targetCountryPlaceholder")} className="mt-1 bg-muted border-border" required />
          </div>

          {/* Description */}
          <div>
            <Label>{t("additionalDesc")}</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("additionalDescPlaceholder")} className="mt-1 bg-muted border-border" rows={3} />
          </div>

          {/* Credit cost display */}
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              <span className="text-sm">{t("creditCost")}</span>
            </div>
            <span className="font-display font-bold text-lg">{creditCost} {t("credits")}</span>
          </div>

          {/* Generate button */}
          <AnimatePresence mode="wait">
            {generating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-6 text-center"
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="font-display font-semibold text-lg">{t(STAGES[stage].key as any)}</p>
                <div className="flex justify-center gap-1 mt-4">
                  {STAGES.map((_, i) => (
                    <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i <= stage ? "btn-primary-gradient" : "bg-muted"}`} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button variant="gradient" size="xl" className="w-full" onClick={handleGenerate} disabled={!imageUrl || uploading}>
                  {t("generateVideo")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
