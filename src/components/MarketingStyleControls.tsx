import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const MARKETING_ANGLES = [
  { value: "Problem → Solution", icon: "🎯" },
  { value: "Before / After", icon: "✨" },
  { value: "Wow Factor", icon: "😱" },
  { value: "Unboxing", icon: "📦" },
  { value: "Review / Testimonial", icon: "⭐" },
  { value: "Tutorial / Demo", icon: "📱" },
];

const HOOK_STYLES = [
  { value: "Question Hook", example: '"Do you struggle with...?"' },
  { value: "Bold Claim", example: '"This changed everything"' },
  { value: "POV/Relatable", example: '"POV: When you finally..."' },
  { value: "Curiosity", example: '"I tried this viral product..."' },
  { value: "Call-out", example: '"If you have [problem], watch this"' },
  { value: "Shock", example: '"I can\'t believe this works"' },
];

const CTA_STYLES = [
  { value: "Soft/Casual", example: '"Link in bio if interested"' },
  { value: "Direct", example: '"Get yours now"' },
  { value: "Urgency", example: '"Selling out fast"' },
  { value: "Social/Engaging", example: '"Would you try this?"' },
  { value: "Teaser", example: '"Part 2 coming soon"' },
];

const TONES = [
  "Excited/Energetic",
  "Calm/Authentic",
  "Funny/Playful",
  "Serious/Professional",
  "Friendly/Conversational",
];

export interface MarketingStyleData {
  marketingAngle: string;
  hookStyle: string;
  ctaStyle: string;
  tone: string;
}

export const MARKETING_DEFAULTS: MarketingStyleData = {
  marketingAngle: "",
  hookStyle: "",
  ctaStyle: "",
  tone: "",
};

interface Props {
  value: MarketingStyleData;
  onChange: (data: MarketingStyleData) => void;
}

export default function MarketingStyleControls({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const update = (field: keyof MarketingStyleData, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
        <span className="font-display font-semibold text-sm">🎬 Marketing Style (Optional)</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3 space-y-5 rounded-lg border border-border bg-muted/30 p-5">
        <p className="text-xs text-muted-foreground">Choose how your video sells the product</p>

        {/* Marketing Angle Chips */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Marketing Angle</Label>
          <div className="grid grid-cols-3 gap-2">
            {MARKETING_ANGLES.map((angle) => {
              const active = value.marketingAngle === angle.value;
              return (
                <button
                  key={angle.value}
                  type="button"
                  onClick={() => update("marketingAngle", active ? "" : angle.value)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all border",
                    active
                      ? "border-primary bg-primary/10 text-primary shadow-[0_0_12px_hsl(var(--primary)/0.25)]"
                      : "border-border bg-muted/50 text-muted-foreground hover:border-primary/40 hover:bg-muted"
                  )}
                >
                  <span className="text-base">{angle.icon}</span>
                  <span>{angle.value}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* More Options sub-collapsible */}
        <Collapsible open={moreOpen} onOpenChange={setMoreOpen}>
          <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown className={cn("h-3 w-3 transition-transform", moreOpen && "rotate-180")} />
            <span>More options</span>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-3 space-y-4">
            {/* Hook Style */}
            <div className="space-y-1.5">
              <Label className="text-xs">🪝 Hook Style</Label>
              <Select value={value.hookStyle} onValueChange={(v) => update("hookStyle", v)}>
                <SelectTrigger className="bg-muted border-border text-sm">
                  <SelectValue placeholder="Select hook style" />
                </SelectTrigger>
                <SelectContent>
                  {HOOK_STYLES.map((h) => (
                    <SelectItem key={h.value} value={h.value}>
                      {h.value} — {h.example}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CTA Style */}
            <div className="space-y-1.5">
              <Label className="text-xs">📢 CTA Style</Label>
              <Select value={value.ctaStyle} onValueChange={(v) => update("ctaStyle", v)}>
                <SelectTrigger className="bg-muted border-border text-sm">
                  <SelectValue placeholder="Select CTA style" />
                </SelectTrigger>
                <SelectContent>
                  {CTA_STYLES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.value} — {c.example}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tone */}
            <div className="space-y-1.5">
              <Label className="text-xs">🎭 Tone</Label>
              <Select value={value.tone} onValueChange={(v) => update("tone", v)}>
                <SelectTrigger className="bg-muted border-border text-sm">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CollapsibleContent>
    </Collapsible>
  );
}
