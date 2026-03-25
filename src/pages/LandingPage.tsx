import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Upload, Sparkles, Download, ChevronDown, Globe, Video, Star,
  Play, Check, ShoppingBag, Smartphone, BarChart3, ArrowRight,
} from "lucide-react";
import { PLANS } from "@/lib/types";
import { useState } from "react";
import AppFooter from "@/components/AppFooter";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const videoExamples = [
  { category: "Beauty", title: "Glow Serum Ad", views: "12.4K", img: "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { category: "Fashion", title: "Summer Collection", views: "8.2K", img: "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { category: "Food", title: "Restaurant Promo", views: "15.1K", img: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { category: "Tech", title: "Gadget Review", views: "9.7K", img: "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { category: "Fitness", title: "Workout Gear", views: "6.8K", img: "https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg?auto=compress&cs=tinysrgb&w=400" },
];

const categories = ["All", "Beauty", "Fashion", "Food", "Tech", "Fitness"];

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

export default function LandingPage() {
  const { t, lang, setLang } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

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
                    Create Your First Video Free
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
                <span className="text-sm text-muted-foreground">Loved by 10,000+ creators</span>
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
                <img
                  src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="AI Video Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-sm font-medium text-white">Beauty Product Ad</div>
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
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
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
              See What <span className="gradient-text">OFA Creates</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">Real examples of AI-generated UGC videos across different industries.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "btn-primary-gradient"
                    : "glass-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredVideos.map((video, i) => (
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
                  <img src={video.img} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/80 text-primary-foreground">
                    {video.category}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium truncate">{video.title}</h4>
                  <p className="text-xs text-muted-foreground">{video.views} views</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 relative">
        <div className="bg-orb bg-orb-pink w-80 h-80 top-0 right-10" style={{ animationDelay: "1s" }} />
        <div className="container max-w-5xl relative z-10">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} custom={0}>
            <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Go Viral</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">A complete AI video production toolkit built for modern creators and brands.</p>
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
              Trusted by <span className="gradient-text">Thousands</span>
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
              Ready to Create <span className="gradient-text">Viral UGC Videos</span>?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Join 10,000+ creators and brands using OFA AI to produce professional video content.
            </p>
            <Button variant="gradient" size="xl" asChild>
              <Link to="/signup">
                {t("getStarted")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">No credit card required</p>
          </motion.div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
