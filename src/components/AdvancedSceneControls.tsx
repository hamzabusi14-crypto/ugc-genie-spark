import { useState } from "react";
import { ChevronDown, User, Users, Camera, Home, Sun, Shirt } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface SceneControlsData {
  mainCharacterGender: string;
  mainCharacterAge: string;
  clothingStyle: string;
  addSecondCharacter: boolean;
  secondCharacterGender: string;
  secondCharacterAge: string;
  secondCharacterRole: string;
  environment: string;
  cameraStyle: string;
  lightingMood: string;
}

const DEFAULTS: SceneControlsData = {
  mainCharacterGender: "",
  mainCharacterAge: "",
  clothingStyle: "",
  addSecondCharacter: false,
  secondCharacterGender: "",
  secondCharacterAge: "",
  secondCharacterRole: "",
  environment: "",
  cameraStyle: "",
  lightingMood: "",
};

interface Props {
  value: SceneControlsData;
  onChange: (data: SceneControlsData) => void;
  selectedCountry?: string;
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-4">
      <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground/90">
        {icon}
        {title}
      </h4>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export default function AdvancedSceneControls({ value, onChange, selectedCountry }: Props) {
  const [open, setOpen] = useState(false);

  const update = (patch: Partial<SceneControlsData>) => onChange({ ...value, ...patch });

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-muted/40 transition-colors"
      >
        <span>🎬 Advanced Scene Controls (Optional)</span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-5 pb-5 space-y-5 animate-fade-in">
          <p className="text-xs text-muted-foreground italic">
            💡 Pro tip: Use these controls to create consistent scenes across all your videos
          </p>

          {/* SECTION 1: Main Character */}
          <SectionCard icon={<User className="h-4 w-4 text-primary" />} title="🧑 Main Character">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Gender">
                <Select value={value.mainCharacterGender} onValueChange={(v) => update({ mainCharacterGender: v })}>
                  <SelectTrigger className="bg-muted border-border text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Age Range">
                <Select value={value.mainCharacterAge} onValueChange={(v) => update({ mainCharacterAge: v })}>
                  <SelectTrigger className="bg-muted border-border text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {["18-25", "26-35", "36-45", "46-55", "55+"].map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Clothing Style">
                <Select value={value.clothingStyle} onValueChange={(v) => update({ clothingStyle: v })}>
                  <SelectTrigger className="bg-muted border-border text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual-modern">Casual Modern</SelectItem>
                    <SelectItem value="traditional">Traditional / Cultural</SelectItem>
                    <SelectItem value="business">Business / Professional</SelectItem>
                    <SelectItem value="sporty">Sporty / Athletic</SelectItem>
                    <SelectItem value="streetwear">Streetwear</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            {value.clothingStyle === "traditional" && selectedCountry && (
              <p className="text-xs text-primary/80 mt-1">
                ✨ Traditional clothing will match the targeted country: {selectedCountry}
              </p>
            )}
          </SectionCard>

          {/* SECTION 2: Second Character */}
          <SectionCard icon={<Users className="h-4 w-4 text-primary" />} title="👥 Second Character (Optional)">
            <div className="flex items-center gap-3">
              <Switch
                checked={value.addSecondCharacter}
                onCheckedChange={(v) => update({ addSecondCharacter: v })}
              />
              <Label className="text-sm">Add Second Character</Label>
            </div>
            {value.addSecondCharacter && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 animate-fade-in">
                <Field label="Gender">
                  <Select value={value.secondCharacterGender} onValueChange={(v) => update({ secondCharacterGender: v })}>
                    <SelectTrigger className="bg-muted border-border text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Age Range">
                  <Select value={value.secondCharacterAge} onValueChange={(v) => update({ secondCharacterAge: v })}>
                    <SelectTrigger className="bg-muted border-border text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["18-25", "26-35", "36-45", "46-55", "55+"].map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Role / Action">
                  <Select value={value.secondCharacterRole} onValueChange={(v) => update({ secondCharacterRole: v })}>
                    <SelectTrigger className="bg-muted border-border text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="watching">Watching / Reacting</SelectItem>
                      <SelectItem value="holding">Holding the Product</SelectItem>
                      <SelectItem value="using-together">Using Product Together</SelectItem>
                      <SelectItem value="background">Just in Background</SelectItem>
                      <SelectItem value="talking">Talking to Main Character</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            )}
          </SectionCard>

          {/* SECTION 3: Scene Settings */}
          <SectionCard icon={<Camera className="h-4 w-4 text-primary" />} title="🎥 Scene Settings">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="🏠 Environment">
                <Select value={value.environment} onValueChange={(v) => update({ environment: v })}>
                  <SelectTrigger className="bg-muted border-border text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="living-room">Living Room</SelectItem>
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="bathroom">Bathroom</SelectItem>
                    <SelectItem value="bedroom">Bedroom</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="outdoor">Outdoor / Garden</SelectItem>
                    <SelectItem value="gym">Gym</SelectItem>
                    <SelectItem value="studio">Studio / Plain Background</SelectItem>
                    <SelectItem value="car">Car Interior</SelectItem>
                    <SelectItem value="cafe">Coffee Shop / Cafe</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="🎥 Camera Style">
                <Select value={value.cameraStyle} onValueChange={(v) => update({ cameraStyle: v })}>
                  <SelectTrigger className="bg-muted border-border text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="selfie">Selfie / Front-Facing</SelectItem>
                    <SelectItem value="normal">Normal / Tripod</SelectItem>
                    <SelectItem value="dynamic">Dynamic / Moving</SelectItem>
                    <SelectItem value="closeup">Close-up Product Focus</SelectItem>
                    <SelectItem value="wide">Wide Shot</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="☀️ Lighting Mood">
                <Select value={value.lightingMood} onValueChange={(v) => update({ lightingMood: v })}>
                  <SelectTrigger className="bg-muted border-border text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Natural Daylight</SelectItem>
                    <SelectItem value="warm">Warm / Cozy</SelectItem>
                    <SelectItem value="bright">Bright Studio</SelectItem>
                    <SelectItem value="soft">Soft / Aesthetic</SelectItem>
                    <SelectItem value="golden">Golden Hour</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </SectionCard>
        </div>
      )}
    </div>
  );
}

export { DEFAULTS as SCENE_CONTROLS_DEFAULTS };
