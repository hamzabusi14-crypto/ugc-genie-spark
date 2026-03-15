import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Sparkles, Download, ChevronDown, Globe } from "lucide-react";
import { PLANS } from "@/lib/types";
import { useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

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

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <h1 className="font-display text-xl font-bold gradient-text">OFA AI</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setLang(lang === "en" ? "ar" : "en")}>
              <Globe className="h-4 w-4" />
            </Button>
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
      <section className="pt-32 pb-20 px-4">
        <div className="container text-center max-w-4xl">
          <motion.h2
            className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gradient-text">{t("heroTitle")}</span>
          </motion.h2>
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t("heroSubtitle")}
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button variant="gradient" size="xl" asChild>
              <Link to="/signup">{t("getStarted")}</Link>
            </Button>
            <Button variant="glass" size="xl">
              {t("watchDemo")}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="container max-w-5xl">
          <h3 className="font-display text-3xl font-bold text-center mb-16">{t("howItWorks")}</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="glass-card p-8 text-center"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <div className="w-16 h-16 rounded-2xl btn-primary-gradient flex items-center justify-center mx-auto mb-6">
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="font-display text-xl font-semibold mb-3">{step.title}</h4>
                <p className="text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="container max-w-5xl">
          <h3 className="font-display text-3xl font-bold text-center mb-4">{t("pricing")}</h3>
          <p className="text-muted-foreground text-center mb-16">{t("pricingSubtitle")}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan, i) => {
              const name = t(plan.key as any);
              const popular = plan.key === "pro";
              return (
                <motion.div
                  key={plan.key}
                  className={`glass-card p-6 flex flex-col ${popular ? "gradient-border" : ""}`}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                >
                  {popular && (
                    <span className="text-xs font-semibold text-primary mb-2">MOST POPULAR</span>
                  )}
                  <h4 className="font-display text-xl font-semibold mb-1">{name}</h4>
                  <div className="mb-4">
                    <span className="font-display text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">{t("month")}</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.credits} {t("credits")}</p>
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
          <h3 className="font-display text-3xl font-bold text-center mb-16">{t("faq")}</h3>
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
                  <div className="px-5 pb-5 text-muted-foreground">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold gradient-text">OFA AI</span>
          <p className="text-sm text-muted-foreground">© 2026 OFA AI. {t("allRightsReserved")}</p>
        </div>
      </footer>
    </div>
  );
}
