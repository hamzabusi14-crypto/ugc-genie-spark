import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, Clock, Loader2, Sparkles, Film, Wand2, Clapperboard } from "lucide-react";
import confetti from "canvas-confetti";

const STEPS = [
  { target: 15, duration: 10000, key: "progressAnalyzing", icon: Sparkles },
  { target: 35, duration: 20000, key: "progressCharacter", icon: Wand2 },
  { target: 60, duration: 30000, key: "progressScene", icon: Clapperboard },
  { target: 80, duration: 40000, key: "progressTouches", icon: Film },
  { target: 90, duration: 60000, key: "progressAlmost", icon: Clock },
] as const;

const MARQUEE_TEXT =
  "🌍 Supporting all languages and countries · Arabic · English · French · Spanish · Turkish · and more · Available worldwide · ";

function Particles() {
  const count = 30;
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 15,
        delay: Math.random() * 10,
        opacity: Math.random() * 0.3 + 0.05,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `hsl(var(--primary) / ${p.opacity})`,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function VideoProgressPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const videoDuration = searchParams.get("duration") || "8s";

  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [productName, setProductName] = useState("");
  const rafRef = useRef<number>();
  const doneHandled = useRef(false);

  const estimatedMinutes = videoDuration === "24s" ? 9 : videoDuration === "16s" ? 6 : 3;

  // Fetch product name
  useEffect(() => {
    if (!id) return;
    supabase
      .from("videos")
      .select("product_name, status")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProductName(data.product_name);
          if (data.status === "done") setDone(true);
        }
      });
  }, [id]);

  // Realtime subscription
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`video-progress-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "videos", filter: `id=eq.${id}` },
        (payload) => {
          if (payload.new.status === "done") setDone(true);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // Animated timed progress
  useEffect(() => {
    if (done) return;
    let currentStep = 0;
    let stepStart = performance.now();
    let prevTarget = 0;

    const animate = (now: number) => {
      if (currentStep >= STEPS.length) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      const step = STEPS[currentStep];
      const elapsed = now - stepStart;
      const fraction = Math.min(elapsed / step.duration, 1);
      const currentProgress = prevTarget + (step.target - prevTarget) * easeOutCubic(fraction);
      setProgress(currentProgress);
      setStepIndex(currentStep);

      if (fraction >= 1 && currentStep < STEPS.length - 1) {
        prevTarget = step.target;
        currentStep++;
        stepStart = now;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [done]);

  // Handle done
  useEffect(() => {
    if (!done || doneHandled.current) return;
    doneHandled.current = true;
    setProgress(100);
    setStepIndex(-1);

    // Fire confetti
    const end = Date.now() + 2000;
    const fire = () => {
      confetti({
        particleCount: 3,
        angle: 60 + Math.random() * 60,
        spread: 55,
        origin: { x: Math.random(), y: Math.random() * 0.6 },
        colors: ["#00d4ff", "#7c3aed", "#22c55e"],
      });
      if (Date.now() < end) requestAnimationFrame(fire);
    };
    fire();

    const timer = setTimeout(() => navigate("/videos"), 3000);
    return () => clearTimeout(timer);
  }, [done, navigate]);

  const currentMessage = done
    ? t("progressDone")
    : t(STEPS[stepIndex]?.key as any);

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, hsl(222 47% 5%) 0%, hsl(260 40% 12%) 50%, hsl(222 47% 7%) 100%)",
      }}
    >
      <Particles />

      {/* Ambient glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ background: "hsl(var(--primary) / 0.08)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
        style={{ background: "hsl(var(--secondary) / 0.06)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-xl relative z-10"
      >
        {/* Main card */}
        <div className="glass-card p-8 md:p-10 space-y-8 relative overflow-hidden">
          {/* Top glow */}
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full blur-[80px] pointer-events-none"
            style={{ background: "hsl(var(--primary) / 0.15)" }}
          />

          {/* AI Brain Icon */}
          <div className="flex justify-center relative z-10">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done-icon"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <div className="relative">
                    <CheckCircle2 className="h-20 w-20 text-[hsl(var(--success))]" />
                    <div
                      className="absolute inset-0 rounded-full blur-xl"
                      style={{ background: "hsl(var(--success) / 0.3)" }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="brain-icon"
                  className="relative"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                >
                  <Brain className="h-20 w-20 text-primary" />
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ boxShadow: "0 0 40px hsl(var(--primary) / 0.4), 0 0 80px hsl(var(--secondary) / 0.2)" }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title */}
          <div className="text-center relative z-10 space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display">
              {done ? t("progressDone") : "Crafting Your Video Magic ✨"}
            </h1>
            {productName && (
              <p className="text-lg font-semibold gradient-text">{productName}</p>
            )}
          </div>

          {/* Progress bar */}
          <div className="relative z-10 space-y-2">
            <div className="relative h-4 w-full rounded-full bg-muted/50 overflow-hidden border border-border/50">
              <motion.div
                className="h-full rounded-full relative overflow-hidden"
                style={{
                  background: done
                    ? "hsl(var(--success))"
                    : "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))",
                  boxShadow: done
                    ? "0 0 20px hsl(var(--success) / 0.5)"
                    : "0 0 20px hsl(var(--primary) / 0.4)",
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Shimmer effect */}
                {!done && (
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                    }}
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                )}
              </motion.div>
            </div>
            <div className="flex justify-between items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentMessage}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`text-sm font-medium ${done ? "text-[hsl(var(--success))]" : "text-muted-foreground"}`}
                >
                  {currentMessage}
                </motion.p>
              </AnimatePresence>
              <span className="text-sm font-mono text-muted-foreground">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Steps indicator */}
          <div className="relative z-10 space-y-3">
            {STEPS.map((step, i) => {
              const StepIcon = step.icon;
              const isCompleted = done || stepIndex > i;
              const isCurrent = !done && stepIndex === i;
              const isPending = !done && stepIndex < i;

              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isCurrent ? "bg-primary/10 border border-primary/20" : ""
                  }`}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))] flex-shrink-0" />
                    </motion.div>
                  ) : isCurrent ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    >
                      <Loader2 className="h-5 w-5 text-primary flex-shrink-0" />
                    </motion.div>
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground/40 flex-shrink-0" />
                  )}
                  <div className="flex items-center gap-2">
                    <StepIcon
                      className={`h-4 w-4 flex-shrink-0 ${
                        isCompleted
                          ? "text-[hsl(var(--success))]"
                          : isCurrent
                          ? "text-primary"
                          : "text-muted-foreground/40"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        isCompleted
                          ? "text-muted-foreground line-through"
                          : isCurrent
                          ? "text-foreground font-medium"
                          : "text-muted-foreground/40"
                      }`}
                    >
                      {t(step.key as any)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Marquee */}
          <div className="relative z-10 overflow-hidden py-3 border-t border-b border-border/30">
            <motion.div
              className="whitespace-nowrap text-sm text-muted-foreground/50"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              {MARQUEE_TEXT}
              {MARQUEE_TEXT}
            </motion.div>
          </div>

          {/* Estimated time card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 glass-card p-4 text-center space-y-1"
          >
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">{t("progressEstimatedTime")}</span>
            </div>
            <p className="text-lg font-bold text-foreground">
              ~{estimatedMinutes} {t("progressMinutes")}
            </p>
            <p className="text-xs text-muted-foreground/60">
              {videoDuration} {t("progressVideoDuration")}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
