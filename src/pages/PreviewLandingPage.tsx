import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { Download, ExternalLink, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function PreviewLandingPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useI18n();

  const { data: page, isLoading } = useQuery({
    queryKey: ["landing-page", id],
    queryFn: async () => {
      const { data } = await supabase
        .from("landing_pages")
        .select("*")
        .eq("id", id!)
        .single();
      return data;
    },
    enabled: !!id,
  });

  const handleDownload = () => {
    if (!page?.html) return;
    const blob = new Blob([page.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${page.product_name}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    if (!page?.html) return;
    const blob = new Blob([page.html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!page) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Landing page not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/landing-pages">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h2 className="font-display text-xl font-bold">{page.product_name}</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="glass" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              {t("download")}
            </Button>
            <Button variant="glass" size="sm" onClick={handleOpenNewTab}>
              <ExternalLink className="h-4 w-4" />
              {t("openInNewTab")}
            </Button>
          </div>
        </div>

        {page.html ? (
          <div className="glass-card overflow-hidden rounded-lg" style={{ height: "calc(100vh - 200px)" }}>
            <iframe
              srcDoc={page.html}
              className="w-full h-full border-0"
              title={page.product_name}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : (
          <div className="glass-card p-16 text-center">
            <p className="text-muted-foreground">{t("generating")}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
