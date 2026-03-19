import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2 } from "lucide-react";

const STEPS = [
  { target: 15, duration: 10000, key: "progressAnalyzing" },
  { target: 35, duration: 20000, key: "progressCharacter" },
  { target: 60, duration: 30000, key: "progressScene" },
  { target: 80, duration: 40000, key: "progressTouches" },
  { target: 90, duration: 60000, key: "progressAlmost" },
] as const;

export default function VideoProgressPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [productName, setProductName] = useState("");
  const rafRef = useRef<number>();
  const doneHandled = useRef(false);

  // Fetch product name
  useEffect(() => {
    if (!id) return;
    supabase.from("videos").select("product_name, status").eq("id", id).single().then(({ data }) => {
      if (data) {
        setProductName(data.product_name);
        if (data.status === "done") {
          setDone(true);
        }
      }
    });
  }, [id]);

  // Realtime subscription
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`video-progress-${id}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "videos",
        filter: `id=eq.${id}`,
      }, (payload) => {
        if (payload.new.status === "done") {
          setDone(true);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
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
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [done]);

  // Handle done
  useEffect(() => {
    if (!done || doneHandled.current) return;
    doneHandled.current = true;
    setProgress(100);
    setStepIndex(-1); // success state
    const timer = setTimeout(() => navigate("/videos"), 2500);
    return () => clearTimeout(timer);
  }, [done, navigate]);

  const currentMessage = done
    ? t("progressDone")
    : t(STEPS[stepIndex]?.key as any);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card p-8 md:p-10 space-y-8 text-center relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle at 50% 0%, hsl(193 100% 50%), transparent 70%)" }}
          />

          {/* Icon */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 className="h-16 w-16 mx-auto text-[hsl(var(--success))]" />
                </motion.div>
              ) : (
                <motion.div
                  key="loading"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                >
                  <Sparkles className="h-16 w-16 mx-auto text-primary" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Product name */}
          {productName && (
            <h2 className="relative z-10 font-display text-xl md:text-2xl font-bold text-foreground">
              {productName}
            </h2>
          )}

          {/* Progress bar */}
          <div className="relative z-10 space-y-3">
            <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: done
                    ? "hsl(var(--success))"
                    : "var(--gradient-accent)",
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
              {/* Pulse overlay */}
              {!done && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "var(--gradient-accent)" }}
                  animate={{ opacity: [0.4, 0, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </div>
            <p className="text-sm font-mono text-muted-foreground">
              {Math.round(progress)}%
            </p>
          </div>

          {/* Status message */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`relative z-10 text-base font-medium ${
                done ? "text-[hsl(var(--success))]" : "text-muted-foreground"
              }`}
            >
              {currentMessage}
            </motion.p>
          </AnimatePresence>

          {/* Dots animation */}
          {!done && (
            <div className="flex justify-center gap-1.5 relative z-10">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
