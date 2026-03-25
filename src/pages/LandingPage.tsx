import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload, Sparkles, Download, ChevronDown, Globe, Video, Star,
  Play, Check, ShoppingBag, Smartphone, BarChart3, ArrowRight, Zap,
  MousePointer2, TrendingUp,
} from "lucide-react";
import { PLANS } from "@/lib/types";
import { useState, useRef, useCallback, useEffect } from "react";
import AppFooter from "@/components/AppFooter";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const videoExamples = [
  { category: "Beauty", title: "Beauty Essentials", views: "144.2K views", video: "https://res.cloudinary.com/da2zkmtcn/video/upload/v1774437677/0624_68_npbycv.mov", thumbnail: "https://res.cloudinary.com/da2zkmtcn/video/upload/so_0,f_jpg/v1774437677/0624_68_npbycv.jpg" },
  { category: "Health", title: "Health Products", views: "111.5K views", video: "https://res.cloudinary.com/da2zkmtcn/video/upload/v1774437677/0624_66_ps8okk.mov", thumbnail: "https://res.cloudinary.com/da2zkmtcn/video/upload/so_0,f_jpg/v1774437677/0624_66_ps8okk.jpg" },
  { category: "Skincare", title: "Skincare Routine", views: "181.3K views", video: "https://res.cloudinary.com/da2zkmtcn/video/upload/v1774437677/0624_70_x2cdhd.mov", thumbnail: "https://res.cloudinary.com/da2zkmtcn/video/upload/so_0,f_jpg/v1774437677/0624_70_x2cdhd.jpg" },
  { category: "Cosmetics", title: "Cosmetics Review", views: "9.8K views", video: "https://res.cloudinary.com/da2zkmtcn/video/upload/v1774437677/0624_67_kj0uwk.mov", thumbnail: "https://res.cloudinary.com/da2zkmtcn/video/upload/so_0,f_jpg/v1774437677/0624_67_kj0uwk.jpg" },
  { category: "Tech", title: "Tech Gadgets", views: "700.6K views", video: "https://res.cloudinary.com/da2zkmtcn/video/upload/v1774437677/0624_69_jcekqo.mov", thumbnail: "https://res.cloudinary.com/da2zkmtcn/video/upload/so_0,f_jpg/v1774437677/0624_69_jcekqo.jpg" },
];

const landingPageExamples = [
  {
    title: "VIP Vital Honey",
    titleAr: "عسل VIP الحيوي",
    category: "Health",
    categoryAr: "صحة",
    conversion: "+14.2%",
    sections: [
      "https://res.cloudinary.com/da2zkmtcn/image/upload/v1774435512/lp/20af9617-515c-41a6-b6c3-219eb27f264d/hero_1774435511405.jpg",
      "https://res.cloudinary.com/da2zkmtcn/image/upload/v1774435513/lp/20af9617-515c-41a6-b6c3-219eb27f264d/features_1774435513088.jpg",
      "https://res.cloudinary.com/da2zkmtcn/image/upload/v1774435514/lp/20af9617-515c-41a6-b6c3-219eb27f264d/howto_1774435514232.jpg",
      "https://res.cloudinary.com/da2zkmtcn/image/upload/v1774435515/lp/20af9617-515c-41a6-b6c3-219eb27f264d/pricing_1774435515433.jpg",
    ],
  },
  {
    title: "Beauty Skincare",
    titleAr: "العناية بالبشرة",
    category: "Beauty",
    categoryAr: "جمال",
    conversion: "+12.3%",
    sections: [
      "https://res.cloudinary.com/da2zkmtcn/image/upload/v1774434639/lp/75481cb5-eb93-4d89-8179-bb6ff0f07cd9/hero_1774434638507.jpg",
      "https://res.cloudinary.com/da2zkmtcn/image/upload/v1774434640/lp/75481cb5-eb93-4d89-8179-bb6ff0f07cd9/features_1774434640022.jpg",
      "https://res.cloudinary.com/da2zkmtcn/image/upload/v1774434642/lp/75481cb5-eb93-4d89-8179-bb6ff0f07cd9/howto_1774434641115.jpg",
      "https://res.cloudinary.com/da2zkmtcn/image/upload/v1774434644/lp/75481cb5-eb93-4d89-8179-bb6ff0f07cd9/pricing_1774434643145.jpg",
    ],
  },
  {
    title: "Electronic Safe",
    titleAr: "خزنة إلكترونية",
    category: "Lifestyle",
    categoryAr: "لايف ستايل",
    conversion: "+11.8%",
    sections: [
      "https://res.cloudinary.com/da2zkmtcn/image/upload/v1774438445/WhatsApp_Image_2569-03-17_at_04.26.52_bluzny.jpg",
      "https://res.cloudinary.com/da2zkmtcn/image/upload/v1774438445/WhatsApp_Image_2569-03-17_at_04.26.59_fq6fc9.jpg",
      "https://res.cloudinary.com/da2zkmtcn/image/upload/v1774438445/WhatsApp_Image_2569-03-17_at_04.27.05_bpld7p.jpg",
      "https://res.cloudinary.com/da2zkmtcn/image/upload/v1774438445/WhatsApp_Image_2569-03-17_at_04.32.59_ror4va.jpg",
    ],
  },
];



const features = [
  { icon: Video, title: "AI UGC Videos", desc: "Generate professional UGC video ads with AI actors and scripts." },
  { icon: Globe, title: "40+ Languages", desc: "Create content in Arabic, English, French, and 40+ more languages." },
  { icon: Sparkles, title: "Animated Captions", desc: "Auto-generated karaoke-style subtitles with perfect timing." },
  { icon: ShoppingBag, title: "Landing Pages", desc: "AI-generated product landing pages optimized for conversion." },
  { icon: Smartphone, title: "Auto-Post", desc: "Schedule and auto-publish to TikTok, Instagram, and YouTube." },
  { icon: BarChart3, title: "Analytics", desc: "Track views, engagement, and conversion metrics in real-time." },
];

const testimonials = [
  { name: "Sarah M.", role: "E-commerce Owner", quote: "OFA AI completely transformed our ad strategy. We went from spending $5K on agencies to creating better content ourselves.", metric: "+340% Sales", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100" },
  { name: "Ahmed K.", role: "Digital Marketer", quote: "The Arabic support is incredible. Finally an AI tool that understands RTL languages and Middle Eastern markets.", metric: "10x Faster", avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100" },
  { name: "Lisa T.", role: "Brand Manager", quote: "We produce 50+ videos per month now. The quality rivals professional production at a fraction of the cost.", metric: "-80% Cost", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100" },
];

const stats = [
  { value: "10,000+", label: "Videos Created" },
  { value: "500+", label: "Brands" },
  { value: "4.9★", label: "Rating" },
  { value: "3x", label: "Engagement" },
];

const planFeatures: Record<string, string[]> = {
  starter: ["50 credits/month", "8s & 16s videos", "3 languages", "Email support"],
  pro: ["200 credits/month", "All durations", "All languages", "Priority support", "Landing pages"],
  premium: ["600 credits/month", "All features", "API access", "Dedicated support", "Auto-posting"],
  ultimate: ["1,500 credits/month", "Everything in Premium", "White-label", "Custom integrations", "Account manager"],
};

function LandingPageCard({ page, lang }: { page: typeof landingPageExamples[0]; lang: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleMouseEnter = useCallback(() => {
    setCurrentIndex(1);
    let idx = 1;
    intervalRef.current = setInterval(() => {
      idx = (idx + 1) % page.sections.length;
      setCurrentIndex(idx);
    }, 1500);
  }, [page.sections.length]);

  const handleMouseLeave = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <div
      className="glass-card overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Phone mockup frame */}
      <div className="relative aspect-[9/16] overflow-hidden bg-black rounded-t-lg border-x-[6px] border-t-[6px] border-border/50">
        {page.sections.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: idx === currentIndex ? 1 : 0 }}
            loading="lazy"
          />
        ))}

        {/* Category badge */}
        <span className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-lg">
          {lang === "ar" ? page.categoryAr : page.category}
        </span>

        {/* Conversion badge */}
        <div className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-lg text-xs font-semibold bg-success text-success-foreground backdrop-blur-sm shadow-lg flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          {page.conversion}
        </div>

        {/* Hover to preview hint */}
        <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md text-white text-xs flex items-center gap-2 shadow-lg transition-opacity duration-300 ${currentIndex === 0 ? 'opacity-100' : 'opacity-0'}`}>
          <MousePointer2 className="h-3.5 w-3.5" />
          {lang === "ar" ? "مرر للمعاينة" : "Hover to preview"}
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {page.sections.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-primary scale-125' : 'bg-white/40'}`}
            />
          ))}
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent z-[5] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent z-[5] pointer-events-none" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="font-display font-semibold text-foreground mb-0.5">
          {lang === "ar" ? page.titleAr : page.title}
        </h4>
        <p className="text-sm text-muted-foreground">
          {lang === "ar" ? "صفحة هبوط بالذكاء الاصطناعي" : "AI-Generated Landing Page"}
        </p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { t, lang, setLang } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  

  const steps = [
    { icon: Upload, title: t("step1Title"), desc: t("step1Desc") },
    { icon: Sparkles, title: t("step2Title"), desc: t("step2Desc") },
    { icon: Download, title: t("step3Title"), desc: t("step3Desc") },
  ];

  const faqs = [
    { q: t("faqQ1"), a: t("faqA1") },
    { q: t("faqQ2"), a: t("faqA2") },
    { q: t("faqQ3"), a: t("faqA3") },
    { q: t("faqQ4"), a: t("faqA4") },
  ];

  const filteredVideos = activeCategory === "All"
    ? videoExamples
    : videoExamples.filter((v) => v.category === activeCategory);

  return (
    <div className={`min-h-screen bg-background overflow-hidden ${lang === 'ar' ? 'rtl' : ''}`}>
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-white">OFA AI</span>
              <span className="hidden sm:block text-[10px] text-muted-foreground -mt-1">One For All AI</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-sm hover:bg-white/10 transition"
            >
              <Globe className="h-4 w-4" />
              <span>{lang === "en" ? "العربية" : "English"}</span>
            </button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">{t("login")}</Link>
            </Button>
            <Button variant="gradient" size="sm" asChild>
              <Link to="/signup">{t("signup")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Orbs */}
        <div className="bg-orb bg-orb-purple w-72 h-72 top-20 -left-20" />
        <div className="bg-orb bg-orb-pink w-96 h-96 top-40 right-0" style={{ animationDelay: "2s" }} />
        <div className="bg-orb bg-orb-purple w-64 h-64 bottom-0 left-1/3" style={{ animationDelay: "4s" }} />

        <div className="container max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary mb-6"
              >
                <Sparkles className="h-4 w-4" />
                {t("heroTagline" as any)}
              </motion.div>

              <motion.h2
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {t("heroHeadline1" as any)} <span className="gradient-text">{t("heroHeadline2" as any)}</span> {t("heroHeadline3" as any)}
              </motion.h2>

              <motion.p
                className="text-lg text-muted-foreground mb-8 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {t("heroSubtitle")}
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button variant="gradient" size="xl" asChild>
                  <Link to="/signup">
                    {t("createFirstVideo" as any)}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="glass" size="xl">
                  <Play className="h-5 w-5" />
                  {t("watchDemo")}
                </Button>
              </motion.div>

              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex -space-x-2">
                  {[
                    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50",
                    "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50",
                    "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50",
                    "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=50",
                    "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50",
                  ].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
                  ))}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{t("lovedBy" as any)}</span>
              </motion.div>
            </div>

            {/* Phone mockup */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <div className="relative mx-auto w-[280px] aspect-[9/16] rounded-3xl overflow-hidden border-2 border-border bg-card shadow-2xl">
                <video
                  src="https://res.cloudinary.com/da2zkmtcn/video/upload/v1774438831/0624_71_resrdx.mov"
                  poster="https://res.cloudinary.com/da2zkmtcn/video/upload/so_0,f_jpg/v1774438831/0624_71_resrdx.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-sm font-medium text-white">UGC Product Ad</div>
                  <div className="text-xs text-white/70">Generated with OFA AI</div>
                </div>
              </div>
              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-lg bg-success/20 border border-success/30 text-success text-sm font-semibold"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                +340% Sales
              </motion.div>
              <motion.div
                className="absolute bottom-20 -left-6 px-3 py-1.5 rounded-lg btn-primary-gradient text-sm font-semibold"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, delay: 1 }}
              >
                AI Generated ✨
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-border bg-card/50">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <div className="font-display text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{t((`stats${stat.label.replace(/\s/g, '')}`) as any) || stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Examples */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t("seeWhatOfa" as any)} <span className="gradient-text">{t("ofaCreates" as any)}</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("videoExamplesDesc" as any)}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {videoExamples.map((video, i) => (
              <motion.div
                key={video.title}
                className="glass-card overflow-hidden group cursor-pointer"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <div className="relative aspect-[9/16]">
                  <video
                    src={video.video}
                    poster={video.thumbnail}
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                    <Play className="h-12 w-12 text-white opacity-70 group-hover:opacity-0 transition-opacity" />
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/80 text-primary-foreground">
                    {video.category}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium truncate">{video.title}</h4>
                  <p className="text-xs text-muted-foreground">{video.views}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Landing Pages Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-6xl">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-success/30 bg-success/10 text-sm text-success mb-4">
              <ShoppingBag className="h-4 w-4" />
              {lang === "ar" ? "ميزة جديدة" : "New Feature"}
            </div>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {lang === "ar" ? (
                <>صفحات هبوط <span className="gradient-text">تحقق مبيعات</span></>
              ) : (
                <>Landing Pages That <span className="gradient-text">Convert</span></>
              )}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {lang === "ar"
                ? "صفحات منتجات احترافية مع فيديو UGC مدمج - جاهزة للبيع مباشرة"
                : "AI-generated product pages with embedded UGC video — ready to sell instantly"
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {landingPageExamples.map((page, i) => (
              <motion.div
                key={page.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <LandingPageCard page={page} lang={lang} />
              </motion.div>
            ))}
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
            {[
              { icon: Zap, label: lang === "ar" ? "إنشاء فوري" : "Instant Creation" },
              { icon: Smartphone, label: lang === "ar" ? "متوافق مع الجوال" : "Mobile Optimized" },
              { icon: BarChart3, label: lang === "ar" ? "تتبع التحويلات" : "Conversion Tracking" },
              { icon: Globe, label: lang === "ar" ? "نطاق مخصص" : "Custom Domain" }
            ].map((feat) => (
              <div key={feat.label} className="glass-card p-4 text-center">
                <feat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <span className="text-xs text-muted-foreground">{feat.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button variant="gradient" size="lg" asChild>
              <Link to="/signup">
                {lang === "ar" ? "أنشئ صفحة منتجك" : "Create Your Landing Page"}
                <ArrowRight className="h-5 w-5 ms-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 relative">
        <div className="container max-w-5xl relative z-10">
          <motion.div className="text-center mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {lang === "ar" ? (
                <>كيف <span className="gradient-text">يعمل</span></>
              ) : (
                <>How It <span className="gradient-text">Works</span></>
              )}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {lang === "ar"
                ? "من المنتج إلى فيديو احترافي في 3 خطوات بسيطة"
                : "From product to viral video in 3 simple steps"}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0" />

            {[
              {
                icon: Upload,
                num: "1",
                title: lang === "ar" ? "ارفع منتجك" : "Upload Your Product",
                desc: lang === "ar" ? "أضف صورة وتفاصيل أساسية عن منتجك" : "Add a photo and basic details about your product",
              },
              {
                icon: Sparkles,
                num: "2",
                title: lang === "ar" ? "الذكاء الاصطناعي يصنع فيديوك" : "AI Creates Your Video",
                desc: lang === "ar"
                  ? "الذكاء الاصطناعي يكتب السيناريو ويختار المقدم المثالي وينتج الفيديو"
                  : "Our AI writes the script, selects the perfect creator, and generates your video",
              },
              {
                icon: Download,
                num: "3",
                title: lang === "ar" ? "حمّل وانشر" : "Download & Post",
                desc: lang === "ar" ? "احصل على فيديوك فوراً وانشره في أي مكان" : "Get your video instantly and post it anywhere",
              },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                className="relative z-10 glass-card p-6 text-center hover:border-primary/20 transition-colors"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full btn-primary-gradient flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg">
                  {step.num}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mt-2 mb-4">
                  <step.icon className="h-7 w-7 text-primary" />
                </div>
                <h4 className="font-display text-lg font-semibold mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center mt-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={3}>
            <Button variant="gradient" size="lg" asChild>
              <Link to="/signup">
                {lang === "ar" ? "ابدأ الإنشاء الآن" : "Start Creating Now"}
                <ArrowRight className="h-5 w-5 ms-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 relative">
        <div className="bg-orb bg-orb-pink w-80 h-80 top-0 right-10" style={{ animationDelay: "1s" }} />
        <div className="container max-w-5xl relative z-10">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t("everythingYouNeed" as any)} <span className="gradient-text">{t("goViral" as any)}</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("featuresDesc" as any)}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass-card p-6 hover:border-primary/20 transition-colors"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <div className="w-12 h-12 rounded-xl btn-primary-gradient flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h4 className="font-display text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4">
        <div className="container max-w-5xl">
          <motion.h3 className="font-display text-3xl md:text-4xl font-bold text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
            {t("howItWorks")}
          </motion.h3>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector lines */}
            <div className="hidden md:block absolute top-10 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-0.5 bg-gradient-to-r from-primary to-secondary" />
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="text-center relative"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <div className="w-20 h-20 rounded-full btn-primary-gradient flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="font-display text-2xl font-bold text-primary-foreground">{i + 1}</span>
                </div>
                <h4 className="font-display text-xl font-semibold mb-3">{step.title}</h4>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 relative">
        <div className="bg-orb bg-orb-purple w-72 h-72 top-10 left-0" style={{ animationDelay: "3s" }} />
        <div className="container max-w-5xl relative z-10">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t("trustedBy" as any)} <span className="gradient-text">{t("thousands" as any)}</span>
            </h3>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="glass-card p-6"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">"{t.quote}"</p>
                <span className="inline-block px-3 py-1 rounded-full bg-success/20 text-success text-xs font-semibold">
                  {t.metric}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container max-w-5xl">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">{t("pricing")}</h3>
            <p className="text-muted-foreground">{t("pricingSubtitle")}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan, i) => {
              const name = t(plan.key as any);
              const popular = plan.key === "pro";
              return (
                <motion.div
                  key={plan.key}
                  className={`glass-card p-6 flex flex-col ${popular ? "gradient-border ring-1 ring-primary/20" : ""}`}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  {popular && (
                    <span className="text-xs font-semibold gradient-text mb-2">MOST POPULAR</span>
                  )}
                  <h4 className="font-display text-xl font-semibold mb-1">{name}</h4>
                  <div className="mb-4">
                    <span className="font-display text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">{t("month")}</span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {(planFeatures[plan.key] || []).map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Button variant={popular ? "gradient" : "glass"} className="mt-auto" asChild>
                    <Link to="/signup">{t("getStarted")}</Link>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container max-w-3xl">
          <motion.h3 className="font-display text-3xl font-bold text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
            {t("faq")}
          </motion.h3>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card">
                <button
                  className="w-full flex items-center justify-between p-5 text-start"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-muted-foreground">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 relative">
        <div className="bg-orb bg-orb-purple w-96 h-96 top-0 left-1/4" />
        <div className="bg-orb bg-orb-pink w-72 h-72 bottom-0 right-1/4" style={{ animationDelay: "2s" }} />
        <div className="container max-w-3xl relative z-10">
          <motion.div
            className="glass-card p-12 text-center gradient-border"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
          >
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t("readyToCreate" as any)}
            </h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              {t("joinCreators" as any)}
            </p>
            <Button variant="gradient" size="xl" asChild>
              <Link to="/signup">
                {t("getStarted")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">{t("noCreditCard" as any)}</p>
          </motion.div>
        </div>
      </section>

      {/* About OFA */}
      <section className="py-12 px-4 border-t border-border/50">
        <div className="container max-w-4xl text-center">
          <h3 className="text-2xl font-bold mb-4">
            {t("aboutOfaTitle" as any)} <span className="gradient-text">OFA AI</span>?
          </h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("aboutOfaDesc" as any)}
          </p>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
