import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

/* ── step definitions ── */
const stepsAr = [
  { percent: 8,  delay: 0,      message: "جاري تحليل المنتج... 🔍",          timeLeft: "~6 دقائق",      step: 1 },
  { percent: 15, delay: 15000,  message: "جاري تحميل صورة المنتج... 📸",      timeLeft: "~5 دقائق",      step: 2 },
  { percent: 28, delay: 45000,  message: "جاري إنشاء التصميم الرئيسي... 🎨",   timeLeft: "~5 دقائق",      step: 3 },
  { percent: 42, delay: 100000, message: "جاري كتابة المميزات... 🧠",          timeLeft: "~4 دقائق",      step: 4 },
  { percent: 55, delay: 160000, message: "جاري إنشاء طريقة الاستخدام... 📋",   timeLeft: "~3 دقائق",      step: 5 },
  { percent: 68, delay: 220000, message: "جاري إنشاء عرض الأسعار... 💰",       timeLeft: "~2 دقائق",      step: 6 },
  { percent: 82, delay: 280000, message: "جاري توليد الصور النهائية... ✨",     timeLeft: "~1 دقيقة",      step: 7 },
  { percent: 90, delay: 330000, message: "اللمسات الأخيرة... تقريباً جاهز 🔥", timeLeft: "أقل من دقيقة", step: 8 },
];

const stepsEn = [
  { percent: 8,  delay: 0,      message: "Analyzing your product... 🔍",        timeLeft: "~6 minutes",     step: 1 },
  { percent: 15, delay: 15000,  message: "Uploading product image... 📸",        timeLeft: "~5 minutes",     step: 2 },
  { percent: 28, delay: 45000,  message: "Creating hero design... 🎨",           timeLeft: "~5 minutes",     step: 3 },
  { percent: 42, delay: 100000, message: "Writing features section... 🧠",       timeLeft: "~4 minutes",     step: 4 },
  { percent: 55, delay: 160000, message: "Building how-to section... 📋",        timeLeft: "~3 minutes",     step: 5 },
  { percent: 68, delay: 220000, message: "Creating pricing section... 💰",       timeLeft: "~2 minutes",     step: 6 },
  { percent: 82, delay: 280000, message: "Generating final images... ✨",        timeLeft: "~1 minute",      step: 7 },
  { percent: 90, delay: 330000, message: "Final touches... almost ready 🔥",     timeLeft: "Less than a min", step: 8 },
];

const dotLabelsAr = ["تحليل", "تحميل", "رئيسية", "مميزات", "استخدام", "أسعار", "توليد", "جاهز"];
const dotLabelsEn = ["Analyze", "Upload", "Hero", "Features", "How-to", "Pricing", "Generate", "Ready"];

const tipsAr = [
  "💡 الذكاء الاصطناعي يحلل منتجك ويكتب نصوص تسويقية بلهجتك المحلية",
  "🎯 كل صفحة مصممة للجوال أولاً — لأن 80% من زوارك على الهاتف",
  "🔥 الصفحات المولّدة تتضمن عناصر إقناع مثبتة علمياً",
  "📱 صفحتك ستكون جاهزة للنشر فوراً بدون أي تعديل",
  "💰 الدفع عند الاستلام + توصيل مجاني = أعلى نسبة تحويل",
  "⚡ كل التصاميم تستخدم خطوط عربية احترافية مثل Cairo",
  "🌍 يدعم جميع الأسواق العربية: السعودية، المغرب، مصر، الإمارات...",
  "✨ أكثر من 1,000 صفحة تم إنشاؤها بنجاح",
];

const tipsEn = [
  "💡 AI analyzes your product and writes copy in your local dialect",
  "🎯 Every page is mobile-first — because 80% of your visitors are on phones",
  "🔥 Generated pages include scientifically proven persuasion elements",
  "📱 Your page will be ready to publish immediately — no edits needed",
  "💰 Cash on delivery + free shipping = highest conversion rate",
  "⚡ All designs use professional Arabic fonts like Cairo",
  "🌍 Supports all Arab markets: Saudi, Morocco, Egypt, UAE...",
  "✨ Over 1,000 pages successfully created",
];

const waitingMessagesAr = [
  "صفحتك تستاهل الانتظار... ✨",
  "نضمن لك نتيجة احترافية 💎",
  "باقي شوي... الذكاء الاصطناعي يشتغل 🤖",
];
const waitingMessagesEn = [
  "Your page is worth the wait... ✨",
  "We guarantee professional results 💎",
  "Almost there... AI is working 🤖",
];

export default function LandingPageProgressPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const steps = isAr ? stepsAr : stepsEn;
  const dotLabels = isAr ? dotLabelsAr : dotLabelsEn;
  const tips = isAr ? tipsAr : tipsEn;
  const waitingMessages = isAr ? waitingMessagesAr : waitingMessagesEn;

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState(steps[0].message);
  const [timeLeft, setTimeLeft] = useState(steps[0].timeLeft);
  const [completed, setCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [tipVisible, setTipVisible] = useState(true);
  const [msgVisible, setMsgVisible] = useState(true);
  const startTimeRef = useRef(Date.now());
  const confettiFiredRef = useRef(false);

  // Timed progress steps
  useEffect(() => {
    if (completed || failed) return;
    const timers = steps.map((s) =>
      setTimeout(() => {
        setMsgVisible(false);
        setTimeout(() => {
          setProgress(s.percent);
          setCurrentStep(s.step);
          setStatusMessage(s.message);
          setTimeLeft(s.timeLeft);
          setMsgVisible(true);
        }, 300);
      }, s.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [completed, failed, steps]);

  // Rotate tips
  useEffect(() => {
    if (completed || failed) return;
    const iv = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIndex((i) => (i + 1) % tips.length);
        setTipVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(iv);
  }, [completed, failed, tips.length]);

  // Waiting reassurance messages after 90%
  useEffect(() => {
    if (completed || failed || progress < 90) return;
    let idx = 0;
    const iv = setInterval(() => {
      setMsgVisible(false);
      setTimeout(() => {
        setStatusMessage(waitingMessages[idx % waitingMessages.length]);
        idx++;
        setMsgVisible(true);
      }, 300);
    }, 15000);
    return () => clearInterval(iv);
  }, [progress >= 90, completed, failed]);

  // Poll Supabase for completion
  useEffect(() => {
    if (!id || completed || failed) return;
    const iv = setInterval(async () => {
      const { data } = await supabase
        .from("landing_pages")
        .select("status")
        .eq("id", id)
        .single();

      if (data?.status === "completed" || data?.status === "done") {
        clearInterval(iv);
        setProgress(100);
        setCurrentStep(8);
        setCompleted(true);
        setStatusMessage(isAr ? "تم بناء صفحتك الاحترافية بنجاح" : "Your professional page was built successfully");
      }
    }, 5000);
    return () => clearInterval(iv);
  }, [id, completed, failed, isAr]);

  // Timeout error at 10 minutes
  useEffect(() => {
    if (completed || failed) return;
    const t = setTimeout(() => {
      if (!completed) {
        setFailed(true);
        setStatusMessage(isAr ? "حصل خطأ — يرجى المحاولة مرة أخرى" : "An error occurred — please try again");
      }
    }, 600000);
    return () => clearTimeout(t);
  }, [completed, failed, isAr]);

  // Confetti on completion
  useEffect(() => {
    if (completed && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      const end = Date.now() + 2500;
      const frame = () => {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#D4AF37", "#7B2D8E", "#ffffff"] });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#D4AF37", "#7B2D8E", "#ffffff"] });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [completed]);

  const elapsedMin = Math.floor((Date.now() - startTimeRef.current) / 60000);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "#0A0A0A", fontFamily: isAr ? "'Cairo', 'Tajawal', sans-serif" : "'Montserrat', 'Inter', sans-serif" }}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-[600px] px-6 flex flex-col items-center gap-6">

        {/* 1 — Animated Icon */}
        <div className="animate-icon-breathe">
          <Sparkles size={48} style={{ color: "#D4AF37" }} strokeWidth={1.8} />
        </div>

        {/* 2 — Headline */}
        <h1
          className="text-center font-extrabold leading-tight"
          style={{ color: "#fff", fontSize: "clamp(26px, 5vw, 36px)", fontFamily: isAr ? "'Cairo', sans-serif" : "'Montserrat', sans-serif" }}
        >
          {completed
            ? (isAr ? "صفحتك جاهزة! 🎉" : "Your page is ready! 🎉")
            : failed
              ? (isAr ? "حصل خطأ ❌" : "Something went wrong ❌")
              : (isAr ? "جاري بناء صفحتك الاحترافية... ✨" : "Building your landing page... ✨")}
        </h1>

        {/* 3 — Progress Bar */}
        <div className="w-[85%] sm:w-[80%] relative mt-2">
          <div className="flex justify-end mb-1" style={{ paddingInlineEnd: `${100 - progress}%`, transition: "padding 1s ease-in-out" }}>
            <span style={{ color: "#D4AF37", fontWeight: 700, fontSize: 22, fontFamily: isAr ? "'Cairo'" : "'Montserrat'" }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "#1A1A1A" }}>
            <div
              className="h-full rounded-full relative overflow-hidden"
              style={{
                width: `${progress}%`,
                background: completed ? "#D4AF37" : "linear-gradient(90deg, #7B2D8E, #D4AF37)",
                transition: "width 1s ease-in-out",
                boxShadow: completed ? "0 0 20px rgba(212,175,55,0.5)" : "none",
              }}
            >
              {/* shine sweep */}
              <div className="progress-shine" />
            </div>
          </div>
        </div>

        {/* 4 — Status Message */}
        <p
          className="text-center font-bold"
          style={{
            color: "#fff",
            fontSize: 16,
            fontFamily: isAr ? "'Cairo'" : "'Montserrat'",
            opacity: msgVisible ? 1 : 0,
            transition: "opacity 0.4s ease",
            minHeight: 24,
          }}
        >
          {statusMessage}
        </p>

        {/* 5 — Step Dots */}
        <div className="flex items-start gap-4 sm:gap-5 mt-1">
          {dotLabels.map((label, i) => {
            const stepNum = i + 1;
            const isDone = completed ? true : currentStep > stepNum;
            const isCurrent = !completed && currentStep === stepNum;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`rounded-full flex items-center justify-center ${isCurrent ? "animate-pulse" : ""}`}
                  style={{
                    width: 10,
                    height: 10,
                    background: isDone ? "#D4AF37" : isCurrent ? "#7B2D8E" : "transparent",
                    border: isDone || isCurrent ? "none" : "1.5px solid #333",
                  }}
                >
                  {isDone && <Check size={7} color="#0A0A0A" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: 10, color: isDone ? "#D4AF37" : isCurrent ? "#9b59b6" : "#555", fontFamily: isAr ? "'Cairo'" : "'Montserrat'" }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 6 — Estimated Time */}
        <p style={{ color: "#888", fontSize: 13, fontFamily: isAr ? "'Cairo'" : "'Montserrat'" }}>
          {completed
            ? (isAr ? `تم الإنشاء في ${elapsedMin || 1} دقائق` : `Created in ${elapsedMin || 1} minutes`)
            : failed
              ? ""
              : (isAr ? `الوقت المقدّر: ${timeLeft}` : `Estimated: ${timeLeft}`)}
        </p>

        {/* 7 — Tips */}
        {!completed && !failed && (
          <p
            className="text-center"
            style={{
              color: "#999",
              fontSize: 14,
              fontFamily: isAr ? "'Cairo'" : "'Montserrat'",
              opacity: tipVisible ? 1 : 0,
              transition: "opacity 0.5s ease",
              minHeight: 42,
              maxWidth: 440,
            }}
          >
            {tips[tipIndex]}
          </p>
        )}

        {/* 8 — Completion / Error buttons */}
        {completed && (
          <Button
            className="mt-4 animate-bounce-in"
            style={{
              background: "#D4AF37",
              color: "#0A0A0A",
              fontWeight: 700,
              fontSize: 18,
              padding: "14px 36px",
              borderRadius: 12,
              fontFamily: isAr ? "'Cairo'" : "'Montserrat'",
            }}
            onClick={() => navigate(`/preview-landing/${id}`)}
          >
            {isAr ? "شاهد صفحتك →" : "View Your Page →"}
          </Button>
        )}

        {failed && (
          <Button
            className="mt-4"
            style={{
              background: "#7B2D8E",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              padding: "12px 32px",
              borderRadius: 12,
              fontFamily: isAr ? "'Cairo'" : "'Montserrat'",
            }}
            onClick={() => navigate("/create-landing-page")}
          >
            <RotateCcw size={18} className="me-2" />
            {isAr ? "حاول مرة أخرى" : "Try Again"}
          </Button>
        )}
      </div>

      {/* inline styles for animations */}
      <style>{`
        .animate-icon-breathe {
          animation: breathe 2s ease-in-out infinite;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .progress-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          animation: shine-sweep 3s ease-in-out infinite;
        }
        @keyframes shine-sweep {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-bounce-in {
          animation: bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes bounceIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
