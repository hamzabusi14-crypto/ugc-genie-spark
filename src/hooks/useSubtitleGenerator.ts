import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SubtitleSettings {
  font?: string;
  color?: string;
  highlightColor?: string;
  fontsize?: number;
  maxChars?: number;
  subsPosition?: string;
  opacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  rightToLeft?: boolean;
  translate?: boolean;
}

export interface SubtitleJob {
  id: string;
  user_id: string;
  video_id: string | null;
  original_video_url: string;
  subtitled_video_url: string | null;
  transcript_url: string | null;
  status: string;
  error_message: string | null;
  settings: SubtitleSettings;
  replicate_prediction_id: string | null;
  created_at: string;
  completed_at: string | null;
  updated_at: string;
}

export function useSubtitleGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSubtitles = useCallback(
    async (
      videoUrl: string,
      settings?: SubtitleSettings,
      videoId?: string
    ): Promise<string | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          "generate-subtitle",
          {
            body: {
              videoUrl,
              videoId: videoId || null,
              ...settings,
            },
          }
        );

        if (fnError) throw new Error(fnError.message);
        if (!data?.success) throw new Error(data?.error || "Generation failed");

        toast.success("Subtitle generation started!");
        return data.jobId as string;
      } catch (err: any) {
        const msg = err.message || "Failed to generate subtitles";
        setError(msg);
        toast.error(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getJobStatus = useCallback(async (jobId: string): Promise<SubtitleJob | null> => {
    const { data, error: queryError } = await supabase
      .from("subtitle_jobs")
      .select("*")
      .eq("id", jobId)
      .single();

    if (queryError) {
      console.error("Failed to fetch job:", queryError);
      return null;
    }
    return data as unknown as SubtitleJob;
  }, []);

  const getUserJobs = useCallback(async (): Promise<SubtitleJob[]> => {
    const { data, error: queryError } = await supabase
      .from("subtitle_jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (queryError) {
      console.error("Failed to fetch jobs:", queryError);
      return [];
    }
    return (data ?? []) as unknown as SubtitleJob[];
  }, []);

  return { isLoading, error, generateSubtitles, getJobStatus, getUserJobs };
}
