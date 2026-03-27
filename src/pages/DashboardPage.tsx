import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useCredits } from "@/hooks/useCredits";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Video, Film, FileText, Coins, ExternalLink } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRef, useState } from "react";

const VIDEO_IDEAS = [
  { id: 1, emoji: "🧴", label: "Skincare Demo", gradient: "from-pink-400/80 to-rose-300/80" },
  { id: 2, emoji: "☕", label: "Coffee Pour", gradient: "from-amber-700/80 to-amber-400/80" },
  { id: 3, emoji: "📱", label: "Tech Unboxing", gradient: "from-blue-900/80 to-blue-500/80" },
  { id: 4, emoji: "🍹", label: "Blender Action", gradient: "from-green-500/80 to-lime-400/80" },
  { id: 5, emoji: "✨", label: "Perfume Spray", gradient: "from-yellow-500/80 to-amber-300/80" },
  { id: 6, emoji: "🕯️", label: "Candle Lighting", gradient: "from-orange-500/80 to-orange-300/80" },
  { id: 7, emoji: "🧹", label: "Cleaning Spray", gradient: "from-cyan-500/80 to-sky-300/80" },
  { id: 8, emoji: "💄", label: "Makeup Apply", gradient: "from-pink-500/80 to-fuchsia-400/80" },
] as const;

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
    const x = e.pageX - ref.current.offsetLeft;
    ref.current.scrollLeft = scrollLeft - (x - startX);
  };
  const onMouseUp = () => setIsDragging(false);

  return (
    <div className="relative group">
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-2 cursor-grab active:cursor-grabbing"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {children}
      </div>
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent" />
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
      const { count } = await supabase
        .from("videos")
        .select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: landingPageCount } = useQuery({
    queryKey: ["landing-page-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("landing_pages")
        .select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: landingPages } = useQuery({
    queryKey: ["landing-pages-slider"],
    queryFn: async () => {
      const { data } = await supabase
        .from("landing_pages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
  });

  const statCards = [
    { label: t("videosCreated"), value: String(videoCount ?? 0), icon: Film, emoji: "🎬" },
    { label: "Landing Pages", value: String(landingPageCount ?? 0), icon: FileText, emoji: "📄" },
    { label: t("creditBalance"), value: String(creditBalance), icon: Coins, emoji: "💎" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
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
        <div className="grid grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{stat.emoji}</span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="font-display text-4xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Video Ideas slider */}
        <div>
          <div className="mb-4">
            <h3 className="font-display text-xl font-semibold">Video Ideas</h3>
            <p className="text-sm text-muted-foreground">Get inspired for your next video</p>
          </div>
          <HorizontalSlider>
            {VIDEO_IDEAS.map((idea) => (
              <button
                key={idea.id}
                onClick={() => navigate("/create-video/product-demo")}
                className="flex-shrink-0 w-[200px] h-[300px] rounded-xl overflow-hidden relative group/card transition-transform hover:scale-[1.03] hover:shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-b ${idea.gradient}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl">
                  {idea.emoji}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-sm">{idea.label}</p>
                </div>
              </button>
            ))}
          </HorizontalSlider>
        </div>

        {/* Landing Pages slider */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-xl font-semibold">Landing Pages</h3>
              <p className="text-sm text-muted-foreground">Your published pages</p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/my-landing-pages">View All →</Link>
            </Button>
          </div>
          {!landingPages?.length ? (
            <div className="glass-card p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No landing pages yet.</p>
              <Button variant="gradient" className="mt-4" asChild>
                <Link to="/create-landing-page">Create your first landing page →</Link>
              </Button>
            </div>
          ) : (
            <HorizontalSlider>
              {landingPages.map((page) => (
                <Link
                  key={page.id}
                  to={`/preview-landing-page/${page.id}`}
                  className="flex-shrink-0 w-[200px] h-[300px] rounded-xl overflow-hidden relative group/card transition-transform hover:scale-[1.03] hover:shadow-xl glass-card"
                >
                  {page.hero_image_url ? (
                    <img src={page.hero_image_url} alt={page.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-b from-primary/20 to-primary/5 flex items-center justify-center">
                      <FileText className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm truncate">{page.product_name}</p>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="flex items-center gap-1 text-white text-sm font-medium">
                      <ExternalLink className="h-4 w-4" /> View
                    </span>
                  </div>
                </Link>
              ))}
            </HorizontalSlider>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
