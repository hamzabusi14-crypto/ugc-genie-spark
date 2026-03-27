import { useState, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CountrySelector from "@/components/CountrySelector";
import { Coins, Loader2, Sparkles } from "lucide-react";
import { useGenerateFacelessVideo } from "@/hooks/useFacelessVideo";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NICHES = [
  { value: "scary", label: "😱 Scary", labelAr: "😱 رعب" },
  { value: "mythology", label: "⚡ Mythology", labelAr: "⚡ أساطير" },
  { value: "history", label: "📜 History", labelAr: "📜 تاريخ" },
  { value: "motivational", label: "💪 Motivational", labelAr: "💪 تحفيزي" },
  { value: "anime", label: "🎌 Anime", labelAr: "🎌 أنمي" },
  { value: "mystery", label: "🔍 Mystery", labelAr: "🔍 غموض" },
  { value: "biblical", label: "✝️ Biblical", labelAr: "✝️ ديني" },
  { value: "heists", label: "💰 Heists", labelAr: "💰 سرقات" },
  { value: "romance", label: "💕 Romance", labelAr: "💕 رومانسي" },
  { value: "scifi", label: "🚀 Sci-Fi", labelAr: "🚀 خيال علمي" },
];

const LANGUAGES = [
  { value: "Arabic", label: "Arabic", labelAr: "العربية" },
  { value: "English", label: "English", labelAr: "الإنجليزية" },
  { value: "French", label: "French", labelAr: "الفرنسية" },
  { value: "Spanish", label: "Spanish", labelAr: "الإسبانية" },
  { value: "Hindi", label: "Hindi", labelAr: "الهندية" },
];

export default function FacelessVideoForm() {
  const { profile, refreshProfile } = useAuth();
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const { generateFacelessVideo, loading } = useGenerateFacelessVideo();
  const isSubmitting = useRef(false);

  const [niche, setNiche] = useState("");
  const [language, setLanguage] = useState("Arabic");
  const [country, setCountry] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");

  const handleGenerate = async () => {
    if (isSubmitting.current || loading) return;
    if (!niche || !country) {
      toast.error(t("fillRequired"));
      return;
    }

    isSubmitting.current = true;
    try {
      const videoId = await generateFacelessVideo({
        niche,
        aspectRatio,
        language,
        country,
        customPrompt: customPrompt.trim() || undefined,
      });

      if (videoId) {
        await refreshProfile();
        navigate(`/video-progress/${videoId}?duration=8s`);
      }
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <div className="space-y-6">
      {/* Niche */}
      <div>
        <Label>{lang === "ar" ? "اختر النوع" : "Select Niche"} *</Label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-2">
          {NICHES.map((n) => (
            <button
              key={n.value}
              className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all text-center ${
                niche === n.value
                  ? "btn-primary-gradient"
                  : "glass-card hover:bg-[rgba(255,255,255,0.1)]"
              }`}
              onClick={() => setNiche(n.value)}
            >
              {lang === "ar" ? n.labelAr : n.label}
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
            {LANGUAGES.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {lang === "ar" ? l.labelAr : l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Country */}
      <div>
        <Label>{t("targetCountry")} *</Label>
        <div className="mt-1">
          <CountrySelector value={country} onChange={setCountry} lang={lang} />
        </div>
      </div>

      {/* Aspect Ratio */}
      <div>
        <Label>{t("aspectRatio")}</Label>
        <div className="flex gap-3 mt-1">
          {[
            { value: "9:16", label: "Portrait (9:16)" },
            { value: "16:9", label: "Landscape (16:9)" },
            { value: "1:1", label: "Square (1:1)" },
          ].map((ar) => (
            <button
              key={ar.value}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                aspectRatio === ar.value
                  ? "btn-primary-gradient"
                  : "glass-card hover:bg-[rgba(255,255,255,0.1)]"
              }`}
              onClick={() => setAspectRatio(ar.value)}
            >
              {ar.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt */}
      <div>
        <Label>{lang === "ar" ? "تعليمات إضافية (اختياري)" : "Custom Prompt (Optional)"}</Label>
        <Textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder={
            lang === "ar"
              ? "أضف تفاصيل إضافية للقصة..."
              : "Add extra details for the story..."
          }
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
        <span className="font-display font-bold text-lg">10 {t("credits")}</span>
      </div>

      {/* Generate button */}
      <Button
        variant="gradient"
        size="xl"
        className="w-full"
        onClick={handleGenerate}
        disabled={loading || !niche || !country}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {lang === "ar" ? "جارٍ الإنشاء..." : "Generating..."}
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            {lang === "ar" ? "إنشاء فيديو" : "Generate Faceless Video"}
          </>
        )}
      </Button>
    </div>
  );
}
