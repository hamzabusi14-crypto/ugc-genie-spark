import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Download, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function MyLandingPagesPage() {
  const { t } = useI18n();

  const { data: pages, refetch } = useQuery({
    queryKey: ["landing-pages"],
    queryFn: async () => {
      const { data } = await supabase
        .from("landing_pages")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    refetchInterval: 15000,
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("landing_pages").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success(t("delete"));
      refetch();
    }
  };

  const handleDownload = (html: string, name: string) => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">{t("myLandingPages")}</h2>
          <Button variant="gradient" asChild>
            <Link to="/create-landing-page">{t("createLandingPage")}</Link>
          </Button>
        </div>

        {!pages?.length ? (
          <div className="glass-card p-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t("noLandingPages")}</p>
            <Button variant="gradient" className="mt-4" asChild>
              <Link to="/create-landing-page">{t("createLandingPage")}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => (
              <div key={page.id} className={`glass-card overflow-hidden ${page.status === "generating" ? "generating-border" : ""}`}>
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {page.hero_image_url ? (
                    <img src={page.hero_image_url} alt={page.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-medium truncate">{page.product_name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{new Date(page.created_at).toLocaleDateString()}</span>
                    <StatusBadge status={page.status} />
                  </div>
                  <div className="flex gap-2 mt-3">
                    {page.status === "done" && page.html && (
                      <>
                        <Button variant="glass" size="sm" asChild>
                          <Link to={`/preview-landing/${page.id}`}>
                            <Eye className="h-3.5 w-3.5" />
                            {t("preview")}
                          </Link>
                        </Button>
                        <Button variant="glass" size="sm" onClick={() => handleDownload(page.html!, page.product_name)}>
                          <Download className="h-3.5 w-3.5" />
                          {t("download")}
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" className="text-destructive ms-auto" onClick={() => handleDelete(page.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
