import DashboardLayout from "@/components/DashboardLayout";
import SubtitleGenerator from "@/components/SubtitleGenerator";
import { useI18n } from "@/lib/i18n";

export default function SubtitlesPage() {
  const { lang } = useI18n();

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold">
            {lang === "ar" ? "مولّد الترجمة" : "Subtitle Generator"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {lang === "ar"
              ? "أضف ترجمات كاريوكي تلقائية لفيديوهاتك"
              : "Add automatic karaoke-style captions to your videos"}
          </p>
        </div>
        <SubtitleGenerator />
      </div>
    </DashboardLayout>
  );
}
