import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Sparkles, Globe, ArrowRight, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import AppFooter from "@/components/AppFooter";

const creditPacks = [
  {
    name: "Starter",
    price: 9,
    credits: 100,
    tagline: "Perfect for testing",
    features: ["3x 8s videos OR 2x 16s videos", "4x Landing Pages", "Free subtitles", "30-day expiration"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    price: 19,
    credits: 300,
    tagline: "For regular creators",
    features: ["10x 8s videos OR 6x 16s videos", "12x Landing Pages", "Free subtitles", "30-day expiration"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: 39,
    credits: 750,
    tagline: "For power users",
    features: ["25x 8s videos OR 15x 16s videos", "30x Landing Pages", "Free subtitles", "30-day expiration"],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Scale",
    price: 79,
    credits: 2000,
    tagline: "For growing teams",
    features: ["66x 8s videos OR 40x 16s videos", "80x Landing Pages", "Free subtitles", "Priority support", "30-day expiration"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Agency",
    price: 149,
    credits: 5000,
    tagline: "For agencies & resellers",
    features: ["166x 8s videos OR 100x 16s videos", "200x Landing Pages", "Free subtitles", "Priority support", "White label option", "30-day expiration"],
    cta: "Contact Sales",
    popular: false,
  },
];

const bundles = [
  {
    name: "Starter",
    price: 15,
    tagline: "Test your first products",
    items: [
      { emoji: "🎬", text: "5x 16s UGC Videos" },
      { emoji: "📄", text: "5x AI Landing Pages" },
      { emoji: "💬", text: "FREE Subtitles" },
      { emoji: "⏰", text: "30-day validity" },
    ],
    bestFor: "Testing 5 products",
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    price: 35,
    tagline: "Scale your winners",
    items: [
      { emoji: "🎬", text: "15x 16s UGC Videos" },
      { emoji: "📄", text: "10x AI Landing Pages" },
      { emoji: "💬", text: "FREE Subtitles" },
      { emoji: "⏰", text: "30-day validity" },
    ],
    bestFor: "Active dropshippers",
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Scale",
    price: 79,
    tagline: "For serious sellers",
    items: [
      { emoji: "🎬", text: "40x 16s UGC Videos" },
      { emoji: "📄", text: "25x AI Landing Pages" },
      { emoji: "💬", text: "FREE Subtitles" },
      { emoji: "⚡", text: "Priority Support" },
      { emoji: "⏰", text: "30-day validity" },
    ],
    bestFor: "Multi-product stores",
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Agency",
    price: 169,
    tagline: "For agencies & teams",
    items: [
      { emoji: "🎬", text: "100x 16s UGC Videos" },
      { emoji: "📄", text: "50x AI Landing Pages" },
      { emoji: "💬", text: "FREE Subtitles" },
      { emoji: "⚡", text: "Priority Support" },
      { emoji: "🏷️", text: "White Label" },
      { emoji: "⏰", text: "30-day validity" },
    ],
    bestFor: "Marketing agencies",
    cta: "Contact Sales",
    popular: false,
  },
];

const creditTable = [
  { product: "🎬 8s UGC Video", credits: "30 credits" },
  { product: "🎬 16s UGC Video", credits: "50 credits" },
  { product: "🎬 24s UGC Video", credits: "75 credits" },
  { product: "📄 AI Landing Page", credits: "25 credits" },
  { product: "💬 Subtitles", credits: "FREE ✨" },
];

const faqs = [
  { q: "Do credits expire?", a: "Yes, all credits and bundles expire 30 days after purchase. This helps us keep prices low!" },
  { q: "What's the difference between Credit Packs and Bundles?", a: "Credit Packs give you flexibility to use credits for any product. E-commerce Bundles are pre-packaged deals with videos + landing pages at a better price - perfect for dropshippers." },
  { q: "Are subtitles really free?", a: "Yes! Subtitles are always free with any video you create." },
  { q: "Can I upgrade my plan?", a: "Yes, you can purchase additional credits or bundles anytime. They stack with your existing balance." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards, Apple Pay, Google Pay, and PayPal." },
];

const SAR_RATE = 3.75;

export default function PricingPage() {
  const { t, lang, setLang } = useI18n();
  const [currency, setCurrency] = useState<"USD" | "SAR">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("pricing_currency") as "USD" | "SAR") || "USD";
    }
    return "USD";
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("pricing_currency", currency);
  }, [currency]);

  const formatPrice = (usd: number) => {
    if (currency === "SAR") return `${Math.round(usd * SAR_RATE)} ر.س`;
    return `$${usd}`;
  };

  return (
    <div className={`min-h-screen bg-background overflow-hidden ${lang === "ar" ? "rtl" : ""}`}>
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-display text-xl font-bold text-foreground">OFA AI</span>
              <span className="hidden sm:block text-[10px] text-muted-foreground -mt-1">One For All AI</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-sm hover:bg-accent/10 transition"
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
      <section className="relative pt-32 pb-12 px-4">
        <div className="bg-orb bg-orb-purple w-72 h-72 top-20 -left-20" />
        <div className="bg-orb bg-orb-pink w-96 h-96 top-40 right-0" style={{ animationDelay: "2s" }} />

        <div className="container max-w-4xl relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg mb-8"
          >
            Choose the plan that fits your needs. Cancel anytime.
          </motion.p>

          {/* Currency toggle */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1 p-1 rounded-full glass-card text-sm">
              <button
                onClick={() => setCurrency("USD")}
                className={`px-3 py-1 rounded-full transition-all ${currency === "USD" ? "btn-primary-gradient text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                $ USD
              </button>
              <button
                onClick={() => setCurrency("SAR")}
                className={`px-3 py-1 rounded-full transition-all ${currency === "SAR" ? "btn-primary-gradient text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                ر.س SAR
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Credit Packs */}
      <section className="py-12 px-4">
        <div className="container max-w-7xl">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary mb-4">
              FLEXIBLE
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              💳 Credit Packs
            </h2>
            <p className="text-muted-foreground text-lg">Pay for what you need, use credits for any product</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {creditPacks.map((pack, i) => (
              <motion.div
                key={pack.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative glass-card p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 ${pack.popular ? "gradient-border ring-1 ring-primary/30" : ""}`}
              >
                {pack.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold btn-primary-gradient">
                    ⭐ POPULAR
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-foreground">{pack.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pack.tagline}</p>
                <div className="mb-1">
                  <span className="font-display text-4xl font-bold text-foreground">{formatPrice(pack.price)}</span>
                </div>
                <p className="text-sm text-primary font-semibold mb-5">{pack.credits.toLocaleString()} credits</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {pack.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button variant={pack.popular ? "gradient" : "outline"} className="w-full" asChild>
                  <Link to="/signup">{pack.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Credit Conversion Table */}
      <section className="py-12 px-4">
        <div className="container max-w-4xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-2">How Credits Work</h2>
          <p className="text-center text-muted-foreground mb-8">Use your credits for any product</p>
          <div className="glass-card overflow-hidden">
            {creditTable.map((row, i) => (
              <div
                key={row.product}
                className={`flex items-center justify-between px-6 py-4 ${i < creditTable.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="text-foreground font-medium">{row.product}</span>
                <span className={`font-bold ${row.credits.includes("FREE") ? "text-primary" : "text-foreground"}`}>
                  {row.credits}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Divider */}
      <div className="container max-w-5xl py-10">
        <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      {/* Section 4: E-commerce Bundles */}
      <section className="relative py-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-secondary/[0.05] to-transparent pointer-events-none" />
        <div className="container max-w-5xl relative z-10">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold btn-primary-gradient mb-4">
              BEST VALUE
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              🛒 E-commerce Bundles
            </h2>
            <p className="text-muted-foreground text-lg">Pre-packaged deals with videos + landing pages included</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bundles.map((bundle, i) => (
              <motion.div
                key={bundle.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`relative glass-card p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 ${bundle.popular ? "gradient-border ring-1 ring-primary/30" : ""}`}
              >
                {bundle.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold btn-primary-gradient">
                    ⭐ MOST POPULAR
                  </span>
                )}
                <h3 className="font-display text-lg font-bold text-foreground">{bundle.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{bundle.tagline}</p>
                <div className="mb-5">
                  <span className="font-display text-4xl font-bold text-foreground">{formatPrice(bundle.price)}</span>
                </div>
                <ul className="space-y-2.5 mb-4 flex-1">
                  {bundle.items.map((item) => (
                    <li key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{item.emoji}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground mb-4">Best for: <span className="text-foreground">{bundle.bestFor}</span></p>
                <Button variant={bundle.popular ? "gradient" : "outline"} className="w-full" asChild>
                  <Link to="/signup">{bundle.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Comparison */}
      <section className="py-12 px-4">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { emoji: "💰", title: "Save up to 40%", desc: "Bundles cost less than credits" },
              { emoji: "📦", title: "All-in-One", desc: "Videos + Landing Pages together" },
              { emoji: "🚀", title: "Built for E-com", desc: "Perfect for COD & dropshipping" },
            ].map((card) => (
              <div key={card.title} className="glass-card p-6 text-center hover:-translate-y-1 transition-all duration-300">
                <span className="text-3xl mb-3 block">{card.emoji}</span>
                <h3 className="font-display font-bold text-foreground mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <p className="px-6 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container max-w-3xl text-center">
          <div className="glass-card p-10 md:p-14 gradient-border">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Create <span className="gradient-text">Viral Content</span>?
            </h2>
            <p className="text-muted-foreground mb-8">Start with 1 free video — no credit card required</p>
            <Button variant="gradient" size="xl" asChild>
              <Link to="/signup" className="gap-2">
                Create Your First Video Free <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
