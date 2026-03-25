import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const shown = sessionStorage.getItem("welcome_shown");
    const isNew = sessionStorage.getItem("just_signed_up");
    if (isNew && !shown) {
      setOpen(true);
      sessionStorage.setItem("welcome_shown", "1");
      sessionStorage.removeItem("just_signed_up");
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  }, []);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative glass-card gradient-border p-8 md:p-10 max-w-md w-full text-center z-10"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">🎉 Welcome to OFA AI!</h2>
          <p className="text-muted-foreground mb-6">
            You've received <span className="text-primary font-bold">50 FREE credits</span> to get started!
          </p>
          <Button
            variant="gradient"
            size="lg"
            className="w-full gap-2"
            onClick={() => { setOpen(false); navigate("/create"); }}
          >
            Start Creating <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
