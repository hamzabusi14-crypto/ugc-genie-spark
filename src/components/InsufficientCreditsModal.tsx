import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Coins } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  required: number;
  current: number;
}

export default function InsufficientCreditsModal({ open, onClose, required, current }: Props) {
  if (!open) return null;
  const needed = required - current;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative glass-card p-8 max-w-sm w-full text-center z-10"
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
            <Coins className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="font-display text-xl font-bold mb-2">Not Enough Credits</h2>
          <p className="text-muted-foreground text-sm mb-6">
            You need <span className="text-foreground font-semibold">{needed} more credits</span> for this action.
            <br />
            Current balance: <span className="text-primary font-semibold">{current}</span> credits.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="gradient" className="flex-1" asChild>
              <Link to="/pricing">Buy Credits</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
