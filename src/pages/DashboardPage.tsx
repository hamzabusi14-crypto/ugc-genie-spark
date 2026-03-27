import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useCredits } from "@/hooks/useCredits";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Film, FileText, Coins, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import React, { useRef, useState } from "react";

const VIDEO_PREVIEWS = [
  "https://res.cloudinary.com/da2zkmtcn/video/upload/v1774618664/0624_76_t7mya1.mov",
  "https://res.cloudinary.com/da2zkmtcn/video/upload/v1774618664/0624_72_pswpf5.mov",
  "https://res.cloudinary.com/da2zkmtcn/video/upload/v1774618663/0624_75_q0cnes.mov",
  "https://res.cloudinary.com/da2zkmtcn/video/upload/v1774618663/0624_73_xsubos.mov",
  "https://res.cloudinary.com/da2zkmtcn/video/upload/v1774618662/0624_74_wgukyc.mov",
  "https://res.cloudinary.com/da2zkmtcn/video/upload/v1774618662/0624_77_nyqku3.mov",
] as const;

function getThumbnail(url: string) {
  return url.replace("/video/upload/", "/video/upload/so_0,f_jpg/").replace(/\.\w+$/, ".jpg");
}

function HorizontalSlider({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (ref.current?.offsetLeft ?? 0));
    setScrollLeft(ref.current?.scrollLeft ?? 0);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault();
    ref.current.scrollLeft = scrollLeft - (e.pageX - ref.current.offsetLeft - startX);
  };
  const onMouseUp = () => setIsDragging(false);

  return (
    <div className="relative">
      <div
        ref={ref}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-1 scrollbar-hide"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {children}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

export default function DashboardPage() {
  const { profile } = useAuth();
  const { t } = useI18n();
  const { credits: balance } = useCredits();
  const navigate = useNavigate();

  const creditBalance = balance ?? profile?.credits ?? 0;

  const { data: videoCount } = useQuery({
    queryKey: ["video-count"],
    queryFn: async () => {
      const { count } = await supabase.from("videos").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: landingPageCount } = useQuery({
    queryKey: ["landing-page-count"],
    queryFn: async () => {
      const { count } = await supabase.from("landing_pages").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: landingPages } = useQuery({
    queryKey: ["landing-pages-slider"],
    queryFn: async () => {
      const { data } = await supabase.from("landing_pages").select("*").order("created_at", { ascending: false }).limit(10);
      return data ?? [];
    },
  });

  const statCards = [
    { label: t("videosCreated"), value: videoCount ?? 0, emoji: "🎬" },
    { label: "Landing Pages", value: landingPageCount ?? 0, emoji: "📄" },
    { label: t("creditBalance"), value: creditBalance, emoji: "💎" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 overflow-x-hidden">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold">{t("welcome")}, {profile?.name ?? "User"} 👋</h2>
            <p className="text-muted-foreground">{t("tagline")}</p>
          </div>
          <Button variant="gradient" size="lg" asChild>
            <Link to="/create">
              <Video className="h-5 w-5" />
              {t("createNewVideo")}
            </Link>
          </Button>
        </div>

        {/* Stats - 3 cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          {statCards.map((stat) => (
            <div key={stat.label} className="glass-card p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{stat.emoji}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="font-display text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Video Ideas */}
        <div>
          <h3 className="font-display text-lg font-semibold">Video Ideas</h3>
          <p className="text-xs text-muted-foreground mb-3">Get inspired</p>
          <HorizontalSlider>
            {VIDEO_PREVIEWS.map((url, i) => (
              <button
                key={i}
                onClick={() => navigate("/create-video/product-demo")}
                className="flex-shrink-0 w-[140px] h-[200px] rounded-lg overflow-hidden relative transition-transform hover:scale-[1.04] bg-black group/vid"
                onMouseEnter={(e) => {
                  const vid = e.currentTarget.querySelector("video");
                  vid?.play();
                }}
                onMouseLeave={(e) => {
                  const vid = e.currentTarget.querySelector("video");
                  if (vid) { vid.pause(); vid.currentTime = 0; }
                }}
              >
                <img src={getThumbnail(url)} alt="" className="absolute inset-0 w-full h-full object-cover group-hover/vid:opacity-0 transition-opacity" />
                <video src={url} muted loop playsInline preload="none" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover/vid:opacity-100 transition-opacity" />
              </button>
            ))}
          </HorizontalSlider>
        </div>

        {/* Landing Pages */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 className="font-display text-lg font-semibold">Landing Pages</h3>
              <p className="text-xs text-muted-foreground">Your published pages</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/my-landing-pages">View All →</Link>
            </Button>
          </div>
          {!landingPages?.length ? (
            <div className="glass-card p-10 text-center">
              <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No landing pages yet.</p>
              <Button variant="gradient" size="sm" className="mt-3" asChild>
                <Link to="/create-landing-page">Create your first landing page →</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-3">
              <HorizontalSlider>
                {landingPages.map((page) => (
                  <Link
                    key={page.id}
                    to={`/preview-landing-page/${page.id}`}
                    className="flex-shrink-0 w-[140px] h-[200px] rounded-lg overflow-hidden relative group/card transition-transform hover:scale-[1.04] bg-muted"
                  >
                    {page.hero_image_url ? (
                      <img src={page.hero_image_url} alt={page.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-2 right-2 text-white text-xs font-medium truncate">{page.product_name}</span>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="flex items-center gap-1 text-white text-xs font-medium"><ExternalLink className="h-3 w-3" /> View</span>
                    </div>
                  </Link>
                ))}
              </HorizontalSlider>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
