import { useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useCredits } from "@/hooks/useCredits";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import InsufficientCreditsModal from "@/components/InsufficientCreditsModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Upload, Coins, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SHOWCASE_TYPES = [
  { value: "In Action", emoji: "⚡", desc: "Product being used (spray, pour, open)" },
  { value: "Product Showcase", emoji: "🔍", desc: "Just display the product (rotate, close-up view)" },
] as const;

const CREDIT_COST = 10;

const STAGES = [
  { key: "analyzing", min: 0 },
  { key: "generatingImage", min: 15 },
  { key: "generatingVideo", min: 60 },
  { key: "finalizing", min: 120 },
] as const;

export default function ProductDemoPage() {
  const { profile, refreshProfile } = useAuth();
  const { t, lang } = useI18n();
  const { hasEnough, deductCredits } = useCredits();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showcaseType, setShowcaseType] = useState("In Action");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [stage, setStage] = useState(0);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const isSubmitting = useRef(false);

  const handleImageSelect = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    setImagePreview(URL.createObjectURL(file));
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
    if (isSubmitting.current || generating) return;
    if (!productName.trim() || !imageUrl) {
      toast.error(lang === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }

    if (!hasEnough("faceless")) {
      setShowCreditsModal(true);
      return;
    }

    isSubmitting.current = true;
    setGenerating(true);
    setStage(0);

    const interval = setInterval(() => {
      setStage((prev) => Math.min(prev + 1, STAGES.length - 1));
    }, 15000);

    try {
      const { data: videoRecord, error: dbError } = await supabase.from("videos").insert({
        user_id: profile!.id,
        product_name: productName.trim(),
        product_image_url: imageUrl,
        status: "generating",
        duration: "8s",
        aspect_ratio: aspectRatio,
        language: "English",
        country: "Global",
        description: description.trim() || null,
        credits_used: CREDIT_COST,
        video_type: "product_demo",
      }).select("id").single();

      if (dbError || !videoRecord) throw dbError || new Error("Failed to create video record");

      const webhookUrl = import.meta.env.VITE_PRODUCT_DEMO_WEBHOOK_URL || "https://snap-automation1.app.n8n.cloud/webhook/product-demo-video";

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoRecord.id,
          productName: productName.trim(),
          productImage: imageUrl,
          aspectRatio,
          showcaseType,
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Webhook failed");

      const result = await res.json();
      if (result?.taskId) {
        await supabase.from("videos").update({ task_id: result.taskId }).eq("id", videoRecord.id);
      }

      await deductCredits("faceless");
      await refreshProfile();
      toast.success(lang === "ar" ? "بدأ إنشاء الفيديو!" : "Video generation started!");
      navigate(`/video-progress/${videoRecord.id}?duration=8s`);
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
    } finally {
      clearInterval(interval);
      setGenerating(false);
      isSubmitting.current = false;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">
            {lang === "ar" ? "عرض المنتج" : "Product Demo"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {lang === "ar" ? "اعرض منتجك في أكشن — بدون شخصية" : "Show your product in action — no character needed"}
          </p>
        </div>

        <div className="glass-card p-6 space-y-6">
          {/* Product Name */}
          <div>
            <Label htmlFor="productName">{t("productName")} *</Label>
            <Input
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder={lang === "ar" ? "مثل: خلاط محمول، سيروم الوجه، عطر" : "e.g., Portable Blender, Face Serum, Perfume"}
              className="mt-1 bg-muted border-border"
              required
            />
          </div>

          {/* Product Image */}
          <div>
            <Label>{t("productImage")} *</Label>
            <div
              className="mt-1 border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("demoFileInput")?.click()}
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
                  <p className="text-muted-foreground">
                    {lang === "ar" ? "ارفع صورة واضحة لمنتجك فقط" : "Upload a clear photo of just your product"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{t("orBrowse")}</p>
                </div>
              )}
              <input
                id="demoFileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageSelect(file);
                }}
              />
            </div>
          </div>

          {/* Showcase Type */}
          <div>
            <Label>{lang === "ar" ? "نوع العرض" : "Showcase Type"} *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {SHOWCASE_TYPES.map((st) => (
                <button
                  key={st.value}
                  type="button"
                  className={`flex flex-col items-start gap-1.5 rounded-lg px-4 py-4 text-left transition-all ${
                    showcaseType === st.value
                      ? "btn-primary-gradient ring-2 ring-primary/30"
                      : "glass-card hover:bg-[rgba(255,255,255,0.1)]"
                  }`}
                  onClick={() => setShowcaseType(st.value)}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <span className="text-lg">{st.emoji}</span>
                    <span>{st.value}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">{st.desc}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {lang === "ar" ? "كيف نعرض منتجك؟" : "How should we show your product?"}
            </p>
          </div>

          {/* Aspect Ratio */}
          <div>
            <Label>{t("aspectRatio")}</Label>
            <div className="flex gap-3 mt-1">
              {[
                { value: "9:16", label: "Portrait (9:16)", iconW: 20, iconH: 32 },
                { value: "16:9", label: "Landscape (16:9)", iconW: 36, iconH: 20 },
              ].map((ar) => (
                <button
                  key={ar.value}
                  className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all flex flex-col items-center gap-2 ${
                    aspectRatio === ar.value ? "btn-primary-gradient" : "glass-card hover:bg-[rgba(255,255,255,0.1)]"
                  }`}
                  onClick={() => setAspectRatio(ar.value)}
                >
                  <span
                    className="rounded border-2 border-current opacity-70"
                    style={{ width: ar.iconW, height: ar.iconH }}
                  />
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <Label>{lang === "ar" ? "ملاحظات إضافية (اختياري)" : "Additional Notes (Optional)"}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === "ar" ? "مثل: ركز على رذاذ العطر، حركة بطيئة، خلفية رخام فاخرة..." : "e.g., Focus on the spray mist, slow motion pour, luxury marble background..."}
              className="mt-1 bg-muted border-border"
              rows={3}
            />
          </div>

          {/* Credit cost */}
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              <span className="text-sm">{t("creditCost")}</span>
            </div>
            <span className="font-display font-bold text-lg">{CREDIT_COST} {t("credits")}</span>
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
                <Button variant="gradient" size="xl" className="w-full" onClick={handleGenerate} disabled={!imageUrl || uploading || generating}>
                  {t("generateVideo")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <InsufficientCreditsModal open={showCreditsModal} onClose={() => setShowCreditsModal(false)} required={CREDIT_COST} current={0} />
    </DashboardLayout>
  );
}
