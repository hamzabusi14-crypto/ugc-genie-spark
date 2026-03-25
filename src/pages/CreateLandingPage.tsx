import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2, FileText, Check, ChevronDown, Search } from "lucide-react";

const PRODUCT_EXAMPLES = [
  "e.g. AirPods Pro",
  "e.g. Samsung Galaxy Cover",
  "e.g. Nike Sneakers",
  "e.g. Dyson Hair Dryer",
  "e.g. Apple Watch Band",
  "e.g. PlayStation Controller",
  "e.g. Bose Headphones",
  "e.g. Ray-Ban Sunglasses",
  "e.g. iPhone Case",
  "e.g. Wireless Earbuds",
  "e.g. Smart Watch",
];

const COUNTRIES = [
  { flag: "🇦🇫", name: "Afghanistan" },
  { flag: "🇦🇱", name: "Albania" },
  { flag: "🇩🇿", name: "Algeria" },
  { flag: "🇦🇷", name: "Argentina" },
  { flag: "🇦🇺", name: "Australia" },
  { flag: "🇦🇹", name: "Austria" },
  { flag: "🇧🇭", name: "Bahrain" },
  { flag: "🇧🇩", name: "Bangladesh" },
  { flag: "🇧🇪", name: "Belgium" },
  { flag: "🇧🇷", name: "Brazil" },
  { flag: "🇧🇳", name: "Brunei" },
  { flag: "🇧🇬", name: "Bulgaria" },
  { flag: "🇨🇦", name: "Canada" },
  { flag: "🇨🇱", name: "Chile" },
  { flag: "🇨🇳", name: "China" },
  { flag: "🇨🇴", name: "Colombia" },
  { flag: "🇭🇷", name: "Croatia" },
  { flag: "🇨🇾", name: "Cyprus" },
  { flag: "🇨🇿", name: "Czech Republic" },
  { flag: "🇩🇰", name: "Denmark" },
  { flag: "🇪🇬", name: "Egypt" },
  { flag: "🇪🇹", name: "Ethiopia" },
  { flag: "🇫🇮", name: "Finland" },
  { flag: "🇫🇷", name: "France" },
  { flag: "🇩🇪", name: "Germany" },
  { flag: "🇬🇭", name: "Ghana" },
  { flag: "🇬🇷", name: "Greece" },
  { flag: "🇭🇰", name: "Hong Kong" },
  { flag: "🇭🇺", name: "Hungary" },
  { flag: "🇮🇳", name: "India" },
  { flag: "🇮🇩", name: "Indonesia" },
  { flag: "🇮🇶", name: "Iraq" },
  { flag: "🇮🇪", name: "Ireland" },
  { flag: "🇮🇹", name: "Italy" },
  { flag: "🇯🇵", name: "Japan" },
  { flag: "🇯🇴", name: "Jordan" },
  { flag: "🇰🇿", name: "Kazakhstan" },
  { flag: "🇰🇪", name: "Kenya" },
  { flag: "🇰🇼", name: "Kuwait" },
  { flag: "🇱🇧", name: "Lebanon" },
  { flag: "🇱🇾", name: "Libya" },
  { flag: "🇲🇾", name: "Malaysia" },
  { flag: "🇲🇽", name: "Mexico" },
  { flag: "🇲🇦", name: "Morocco" },
  { flag: "🇳🇱", name: "Netherlands" },
  { flag: "🇳🇿", name: "New Zealand" },
  { flag: "🇳🇬", name: "Nigeria" },
  { flag: "🇳🇴", name: "Norway" },
  { flag: "🇴🇲", name: "Oman" },
  { flag: "🇵🇰", name: "Pakistan" },
  { flag: "🇵🇸", name: "Palestine" },
  { flag: "🇵🇪", name: "Peru" },
  { flag: "🇵🇭", name: "Philippines" },
  { flag: "🇵🇱", name: "Poland" },
  { flag: "🇵🇹", name: "Portugal" },
  { flag: "🇶🇦", name: "Qatar" },
  { flag: "🇷🇴", name: "Romania" },
  { flag: "🇷🇺", name: "Russia" },
  { flag: "🇸🇦", name: "Saudi Arabia" },
  { flag: "🇸🇳", name: "Senegal" },
  { flag: "🇸🇬", name: "Singapore" },
  { flag: "🇿🇦", name: "South Africa" },
  { flag: "🇰🇷", name: "South Korea" },
  { flag: "🇪🇸", name: "Spain" },
  { flag: "🇸🇩", name: "Sudan" },
  { flag: "🇸🇪", name: "Sweden" },
  { flag: "🇨🇭", name: "Switzerland" },
  { flag: "🇸🇾", name: "Syria" },
  { flag: "🇹🇼", name: "Taiwan" },
  { flag: "🇹🇭", name: "Thailand" },
  { flag: "🇹🇳", name: "Tunisia" },
  { flag: "🇹🇷", name: "Turkey" },
  { flag: "🇦🇪", name: "UAE" },
  { flag: "🇬🇧", name: "United Kingdom" },
  { flag: "🇺🇸", name: "United States" },
  { flag: "🇻🇳", name: "Vietnam" },
  { flag: "🇾🇪", name: "Yemen" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function CreateLandingPage() {
  const { profile } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [targetLocation, setTargetLocation] = useState("");
  const [priceOffers, setPriceOffers] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Country dropdown state
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryRef = useRef<HTMLDivElement>(null);

  // Rotating placeholder
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PRODUCT_EXAMPLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close country dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredCountries = useMemo(
    () => COUNTRIES.filter((c) => c.name.toLowerCase().includes(countrySearch.toLowerCase())),
    [countrySearch]
  );

  const selectedCountry = COUNTRIES.find((c) => c.name === targetLocation);

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

  const handleGenerate = async () => {
    if (!productName.trim() || !imageUrl || !targetLocation.trim() || !priceOffers.trim()) {
      toast.error(t("fillRequired"));
      return;
    }

    setGenerating(true);
    try {
      const { data: record, error: dbError } = await supabase
        .from("landing_pages")
        .insert({
          user_id: profile!.id,
          product_name: productName.trim(),
          status: "generating",
        })
        .select("id")
        .single();

      if (dbError || !record) throw dbError || new Error("Failed to create record");

      const res = await fetch("https://snap-automation1.app.n8n.cloud/webhook/67a9c4a5-ceec-470d-9313-bf407b093522", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landingPageId: record.id,
          productName: productName.trim(),
          productImage: imageUrl,
          targetLocation: targetLocation.trim(),
          priceOffers: priceOffers.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Webhook failed");

      toast.success(t("landingPageStarted"));
      navigate(`/landing-progress/${record.id}`);
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">{t("createLandingPage")}</h2>
          <p className="text-muted-foreground mt-1">{t("createLandingPageDesc")}</p>
        </div>

        <div className="glass-card p-6 space-y-6">
          {/* Product Name */}
          <div>
            <Label htmlFor="lpProductName">{t("productName")} *</Label>
            <Input
              id="lpProductName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder={PRODUCT_EXAMPLES[placeholderIdx]}
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
              onClick={() => document.getElementById("lpFileInput")?.click()}
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
              <input id="lpFileInput" type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }} />
            </div>
          </div>

          {/* Target Location - Country Dropdown */}
          <div>
            <Label>{t("targetLocation")} *</Label>
            <div className="relative mt-1" ref={countryRef}>
              <button
                type="button"
                onClick={() => setCountryOpen(!countryOpen)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-muted px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <span className={targetLocation ? "text-foreground" : "text-muted-foreground"}>
                  {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : (t("targetLocationPlaceholder") || "Select country")}
                </span>
                <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${countryOpen ? "rotate-180" : ""}`} />
              </button>

              {countryOpen && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
                  <div className="flex items-center border-b border-border px-3 py-2">
                    <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                    <input
                      autoFocus
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Search countries..."
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto p-1">
                    {filteredCountries.length === 0 ? (
                      <p className="py-4 text-center text-sm text-muted-foreground">No country found</p>
                    ) : (
                      filteredCountries.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            setTargetLocation(c.name);
                            setCountryOpen(false);
                            setCountrySearch("");
                          }}
                          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          <span className="text-base">{c.flag}</span>
                          <span className="flex-1 text-start">{c.name}</span>
                          {targetLocation === c.name && <Check className="h-4 w-4 text-primary" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Price & Offers */}
          <div>
            <Label>{t("priceOffers")} *</Label>
            <Textarea
              value={priceOffers}
              onChange={(e) => setPriceOffers(e.target.value)}
              placeholder="1pcs = 199, 2pcs = 299, 4pcs = 499"
              className="mt-1 bg-muted border-border"
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Format: quantity = price (e.g., 1pcs = 199, 2pcs = 299)
            </p>
          </div>

          {/* Description */}
          <div>
            <Label>{t("additionalDesc")}</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("additionalDescPlaceholder")} className="mt-1 bg-muted border-border" rows={3} />
          </div>

          {/* Generate button */}
          <Button variant="gradient" size="xl" className="w-full" onClick={handleGenerate} disabled={!imageUrl || uploading || generating}>
            {generating ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> {t("generating")}</>
            ) : (
              <><FileText className="h-5 w-5" /> {t("generateLandingPage")}</>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
