import { useState, useCallback } from "react";
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
import { Upload, Loader2, FileText } from "lucide-react";

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
      // Create record first
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

      // POST to n8n
      const res = await fetch("https://snap-automation1.app.n8n.cloud/webhook/generate-landing-page", {
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
      navigate("/landing-pages");
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
            <Input id="lpProductName" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder={t("productNamePlaceholder")} className="mt-1 bg-muted border-border" required />
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

          {/* Target Location */}
          <div>
            <Label>{t("targetLocation")} *</Label>
            <Input value={targetLocation} onChange={(e) => setTargetLocation(e.target.value)} placeholder={t("targetLocationPlaceholder")} className="mt-1 bg-muted border-border" required />
          </div>

          {/* Price & Offers */}
          <div>
            <Label>{t("priceOffers")} *</Label>
            <Textarea value={priceOffers} onChange={(e) => setPriceOffers(e.target.value)} placeholder="2 tins = 199 SAR, 5 tins = 299 SAR" className="mt-1 bg-muted border-border" rows={3} required />
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
