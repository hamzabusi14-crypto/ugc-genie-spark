import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, X } from "lucide-react";

const LANGUAGES = [
  { code: "AR", name: "Arabic", flag: "🇸🇦" },
  { code: "EN", name: "English", flag: "🇬🇧" },
  { code: "FR", name: "French", flag: "🇫🇷" },
  { code: "ES", name: "Spanish", flag: "🇪🇸" },
  { code: "PT", name: "Portuguese", flag: "🇵🇹" },
  { code: "DE", name: "German", flag: "🇩🇪" },
  { code: "IT", name: "Italian", flag: "🇮🇹" },
  { code: "TR", name: "Turkish", flag: "🇹🇷" },
  { code: "HI", name: "Hindi", flag: "🇮🇳" },
  { code: "ID", name: "Indonesian", flag: "🇮🇩" },
  { code: "MS", name: "Malay", flag: "🇲🇾" },
  { code: "NL", name: "Dutch", flag: "🇳🇱" },
  { code: "RU", name: "Russian", flag: "🇷🇺" },
  { code: "ZH", name: "Chinese", flag: "🇨🇳" },
  { code: "JA", name: "Japanese", flag: "🇯🇵" },
  { code: "KO", name: "Korean", flag: "🇰🇷" },
  { code: "FA", name: "Persian", flag: "🇮🇷" },
  { code: "UR", name: "Urdu", flag: "🇵🇰" },
  { code: "SW", name: "Swahili", flag: "🇰🇪" },
  { code: "PL", name: "Polish", flag: "🇵🇱" },
];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  placeholderAr?: string;
  lang?: string;
}

export default function LanguageSelector({
  value,
  onChange,
  placeholder = "Select language",
  placeholderAr = "اختر اللغة",
  lang = "en",
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => LANGUAGES.find((l) => l.name === value),
    [value]
  );

  const filtered = useMemo(() => {
    if (!search) return LANGUAGES;
    const q = search.toLowerCase();
    return LANGUAGES.filter((l) => l.name.toLowerCase().includes(q));
  }, [search]);

  useEffect(() => {
    if (open) {
      setSearch("");
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-border bg-muted px-3 py-2 text-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
          !value && "text-muted-foreground"
        )}
      >
        <span className="truncate">
          {selected ? `${selected.flag} ${selected.name}` : lang === "ar" ? placeholderAr : placeholder}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {value && (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setOpen(false);
              }}
              className="rounded-sm p-0.5 hover:bg-accent/50 transition-colors"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </span>
          )}
          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </div>
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg",
            "animate-fade-in"
          )}
        >
          <div className="flex items-center border-b border-border px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "ar" ? "ابحث عن لغة..." : "Search language..."}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="max-h-[240px] overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <div className="py-4 text-center text-sm text-muted-foreground">
                {lang === "ar" ? "لا توجد نتائج" : "No languages found"}
              </div>
            ) : (
              filtered.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    onChange(l.name);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    value === l.name && "bg-accent text-accent-foreground"
                  )}
                >
                  <span className="text-base">{l.flag}</span>
                  <span>{l.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
