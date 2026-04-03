import { useState, useCallback, useRef } from "react";
import AdvancedSceneControls, { SceneControlsData, SCENE_CONTROLS_DEFAULTS } from "@/components/AdvancedSceneControls";
import MarketingStyleControls, { MarketingStyleData, MARKETING_DEFAULTS } from "@/components/MarketingStyleControls";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CountrySelector from "@/components/CountrySelector";
import LanguageSelector from "@/components/LanguageSelector";
import DashboardLayout from "@/components/DashboardLayout";
import { CREDIT_COSTS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Upload, Coins, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STAGES = [
  { key: "analyzing", min: 0 },
  { key: "generatingImage", min: 15 },
  { key: "creatingScript", min: 60 },
  { key: "generatingVideo", min: 90 },
  { key: "finalizing", min: 300 },
] as const;

const countryToLanguage: Record<string, string> = {
  "Saudi Arabia": "Gulf Arabic", "UAE": "Gulf Arabic", "United Arab Emirates": "Gulf Arabic",
  "Kuwait": "Gulf Arabic", "Qatar": "Gulf Arabic", "Bahrain": "Gulf Arabic", "Oman": "Gulf Arabic",
  "Egypt": "Egyptian Arabic",
  "Morocco": "Moroccan Darija", "Algeria": "Algerian Arabic", "Tunisia": "Tunisian Arabic", "Libya": "Libyan Arabic",
  "Lebanon": "Levantine Arabic", "Syria": "Levantine Arabic", "Jordan": "Levantine Arabic", "Palestine": "Levantine Arabic",
  "Iraq": "Iraqi Arabic", "Sudan": "Sudanese Arabic", "Yemen": "Yemeni Arabic",
  "France": "French", "Germany": "German", "Spain": "Spanish", "Italy": "Italian",
  "Netherlands": "Dutch", "Portugal": "Portuguese",
  "United States": "English", "United Kingdom": "English", "Canada": "English",
  "Australia": "English", "Ireland": "English",
  "Turkey": "Turkish", "India": "Hindi", "Pakistan": "Urdu", "Indonesia": "Indonesian",
  "Malaysia": "Malay", "Thailand": "Thai", "Vietnam": "Vietnamese", "Philippines": "Filipino",
  "Japan": "Japanese", "South Korea": "Korean", "China": "Chinese",
  "Mexico": "Spanish", "Argentina": "Spanish", "Colombia": "Spanish", "Brazil": "Portuguese",
};

const getLanguageForCountry = (country: string): string => countryToLanguage[country] || "English";

export default function CreateVideoPage() {
  const { profile, refreshProfile } = useAuth();
  const { t, lang } = useI18n();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState("8s");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [sceneControls, setSceneControls] = useState<SceneControlsData>(SCENE_CONTROLS_DEFAULTS);
  const [marketingStyle, setMarketingStyle] = useState<MarketingStyleData>(MARKETING_DEFAULTS);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingScript, setGeneratingScript] = useState(false);
  const [scriptChosen, setScriptChosen] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const [scripts, setScripts] = useState<{ angle: string; script: string }[]>([]);
  const [selectedScript, setSelectedScript] = useState<string | null>(null);
  const [selectedAngle, setSelectedAngle] = useState<string | null>(null);
  const isSubmitting = useRef(false);

  const creditCost = CREDIT_COSTS[duration] || 10;
  const requiredFieldsFilled = !!(productName.trim() && imageUrl && duration && language && country);

  const handleImageSelect = useCallback(async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    setProductImage(file);
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

  const handleChooseScript = async () => {
    if (!productImage || !requiredFieldsFilled) return;
    setGeneratingScript(true);
    try {
      let currentVideoId = videoId;
      if (!currentVideoId) {
        currentVideoId = crypto.randomUUID();
        setVideoId(currentVideoId);
      }

      const res = await fetch("https://snap-automation1.app.n8n.cloud/webhook/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: currentVideoId,
          productName: productName.trim(),
          productImage: imageUrl,
          duration,
          aspectRatio,
          language,
          country,
          description: description.trim() || "",
        }),
      });

      if (!res.ok) throw new Error("Script generation failed");

      const data = await res.json();
      console.log("Choose Script webhook response:", data);

      if (data.scripts && Array.isArray(data.scripts)) {
        setScripts(data.scripts);
        if (data.videoId) setVideoId(data.videoId);
        if (data.imageUrl) setImageUrl(data.imageUrl);
        setScriptChosen(true);
        toast.success(lang === "ar" ? "تم إنشاء السكربتات! اختر واحداً" : "Scripts generated! Select one");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to generate script");
    } finally {
      setGeneratingScript(false);
    }
  };

  const handleGenerate = async () => {
    if (isSubmitting.current || generating) return;
    if (!productName.trim() || !imageUrl || !language || !country) {
      toast.error("Please fill all required fields");
      return;
    }

    isSubmitting.current = true;
    setGenerating(true);
    setStage(0);

    const interval = setInterval(() => {
      setStage((prev) => Math.min(prev + 1, STAGES.length - 1));
    }, 15000);

    try {
      // Build scene settings string from advanced controls
      const sceneParts: string[] = [];
      const mainParts: string[] = [];
      if (sceneControls.mainCharacterGender) mainParts.push(sceneControls.mainCharacterGender);
      if (sceneControls.mainCharacterAge) mainParts.push(`${sceneControls.mainCharacterAge} years old`);
      if (sceneControls.clothingStyle) mainParts.push(`${sceneControls.clothingStyle} clothing`);
      if (mainParts.length > 0) sceneParts.push(`Main Character: ${mainParts.join(", ")}`);

      if (sceneControls.addSecondCharacter) {
        const secParts: string[] = [];
        if (sceneControls.secondCharacterGender) secParts.push(sceneControls.secondCharacterGender);
        if (sceneControls.secondCharacterAge) secParts.push(`${sceneControls.secondCharacterAge} years old`);
        if (sceneControls.secondCharacterRole) secParts.push(sceneControls.secondCharacterRole);
        if (secParts.length > 0) sceneParts.push(`Second Character: ${secParts.join(", ")}`);
      }

      if (sceneControls.environment) sceneParts.push(`Environment: ${sceneControls.environment}`);
      if (sceneControls.cameraStyle) sceneParts.push(`Camera Style: ${sceneControls.cameraStyle}`);
      if (sceneControls.lightingMood) sceneParts.push(`Lighting: ${sceneControls.lightingMood}`);

      // Build final description: MARKETING → SCENE → USER TEXT
      const sections: string[] = [];

      // 1. Marketing / Script Structure
      const marketingParts: string[] = [];
      if (marketingStyle.marketingAngle) marketingParts.push(`Marketing Angle: ${marketingStyle.marketingAngle}`);
      if (marketingStyle.hookStyle) {
        const hookEx = { "Question Hook": '"Do you struggle with...?"', "Bold Claim": '"This changed everything"', "POV/Relatable": '"POV: When you finally..."', "Curiosity": '"I tried this viral product..."', "Call-out": '"If you have [problem], watch this"', "Shock": '"I can\'t believe this works"' }[marketingStyle.hookStyle] || "";
        marketingParts.push(`Hook Style: ${marketingStyle.hookStyle} ${hookEx}`);
      }
      if (marketingStyle.ctaStyle) {
        const ctaEx = { "Soft/Casual": '"Link in bio if interested"', "Direct": '"Get yours now"', "Urgency": '"Selling out fast"', "Social/Engaging": '"Would you try this?"', "Teaser": '"Part 2 coming soon"' }[marketingStyle.ctaStyle] || "";
        marketingParts.push(`CTA Style: ${marketingStyle.ctaStyle} ${ctaEx}`);
      }
      if (marketingStyle.tone) marketingParts.push(`Tone: ${marketingStyle.tone}`);
      if (marketingParts.length > 0) sections.push(`SCRIPT STRUCTURE (MUST FOLLOW):\n${marketingParts.join("\n")}`);

      // 2. Scene Direction
      if (sceneParts.length > 0) sections.push(`SCENE DIRECTION:\n${sceneParts.join("\n")}`);

      // 3. User text
      const userText = description.trim();
      if (userText) sections.push(`ADDITIONAL NOTES:\n${userText}`);

      const finalDescription = sections.join("\n\n");

      const insertId = videoId || crypto.randomUUID();
      const { data: videoRecord, error: dbError } = await supabase.from("videos").insert({
        id: insertId,
        user_id: profile!.id,
        product_name: productName.trim(),
        product_image_url: imageUrl,
        status: "generating",
        duration,
        aspect_ratio: aspectRatio,
        language,
        country,
        description: finalDescription || null,
        credits_used: creditCost,
        video_type: "ugc",
      }).select("id").single();

      if (dbError || !videoRecord) throw dbError || new Error("Failed to create video record");

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
          country,
          description: finalDescription || undefined,
        }),
      });

      if (!res.ok) throw new Error("Webhook failed");

      const result = await res.json();

      if (result?.taskId) {
        await supabase.from("videos").update({ task_id: result.taskId }).eq("id", videoRecord.id);
      }

      await refreshProfile();
      toast.success(t("videoStarted"));
      navigate(`/video-progress/${videoRecord.id}?duration=${duration}`);
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
          <h2 className="font-display text-2xl font-bold">{lang === "ar" ? "فيديو UGC" : "UGC Video"}</h2>
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
                <SelectItem value="15s">15s</SelectItem>
                <SelectItem value="22s">22s</SelectItem>
              </SelectContent>
            </Select>
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

          {/* Language */}
          <div>
            <Label>{lang === "ar" ? "اللغة" : "Language"} *</Label>
            <div className="mt-1">
              <LanguageSelector value={language} onChange={setLanguage} lang={lang} />
            </div>
          </div>

          {/* Country */}
          <div>
            <Label>{t("targetCountry")} *</Label>
            <div className="mt-1">
              <CountrySelector value={country} onChange={setCountry} lang={lang} />
            </div>
          </div>

          {/* Advanced Scene Controls */}
          <AdvancedSceneControls value={sceneControls} onChange={setSceneControls} selectedCountry={country} />

          {/* Marketing Style */}
          <MarketingStyleControls value={marketingStyle} onChange={setMarketingStyle} />

          {/* Description */}
          <div>
            <Label>{t("additionalDesc")}</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("additionalDescPlaceholder")} className="mt-1 bg-muted border-border" rows={3} />
          </div>

          {/* Choose Script & Marketing Angle */}
          <div className="space-y-3">
              <Button
                variant="ghost"
                size="lg"
                style={{
                  border: 'none',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  ...( (!requiredFieldsFilled || !productImage || generatingScript || scriptChosen)
                    ? { background: '#2a2a3a', color: '#666666' }
                    : { background: 'linear-gradient(135deg, #8B5CF6, #D946EF)', color: '#ffffff' }
                  ),
                }}
                className="w-full font-semibold rounded-lg !border-none !outline-none hover:enabled:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                disabled={!requiredFieldsFilled || !productImage || generatingScript || scriptChosen}
                onClick={handleChooseScript}
              >
                {generatingScript ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {lang === "ar" ? "جاري إنشاء السكربتات..." : "Generating scripts..."}
                  </>
                ) : scriptChosen ? (
                  lang === "ar" ? "✓ تم اختيار السكربت" : "✓ Script Generated"
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {lang === "ar" ? "اختر السكربت وزاوية التسويق" : "Choose Script & Marketing Angle"}
                  </>
                )}
              </Button>
             {generatingScript && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {lang === "ar" ? "جاري إنشاء السكربتات..." : "Generating scripts..."}
              </div>
            )}

            {/* Script Selection Cards */}
            {scripts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {scripts.map((s, i) => {
                  const isSelected = selectedAngle === s.angle && selectedScript === s.script;
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedScript(s.script);
                        setSelectedAngle(s.angle);
                      }}
                      className={cn(
                        "p-4 rounded-lg cursor-pointer transition-all border-2 bg-muted/50 hover:bg-muted",
                        isSelected ? "border-purple-500 shadow-[0_0_12px_rgba(139,92,246,0.3)]" : "border-transparent"
                      )}
                      style={{ direction: "auto" }}
                    >
                      <h4 className="font-bold text-sm mb-2 text-foreground">{s.angle}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{s.script}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Credit cost */}
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
                <Button variant="gradient" size="xl" className="w-full" onClick={handleGenerate} disabled={!imageUrl || uploading || generating || !scriptChosen}>
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
