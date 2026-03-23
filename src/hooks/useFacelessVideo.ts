import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GenerateFacelessParams {
  niche: string;
  aspectRatio: string;
  language: string;
  country: string;
  customPrompt?: string;
  seriesId?: string;
  partNumber?: number;
  previousContext?: string;
  previousCliffhanger?: string;
  seedImageUrl?: string;
  testMode?: boolean;
}
  partNumber?: number;
  previousContext?: string;
  previousCliffhanger?: string;
  seedImageUrl?: string;
}

export function useGenerateFacelessVideo() {
  const [loading, setLoading] = useState(false);

  const generateFacelessVideo = async (params: GenerateFacelessParams): Promise<string | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-faceless-video", {
        body: params,
      });

      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || "Generation failed");

      toast.success("Faceless video generation started!");
      return data.videoId;
    } catch (err: any) {
      toast.error(err.message || "Failed to generate faceless video");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateFacelessVideo, loading };
}

export function useGenerateFacelessPart2() {
  const [loading, setLoading] = useState(false);

  const generatePart2 = async (seriesId: string, videoId: string): Promise<string | null> => {
    setLoading(true);
    try {
      // Fetch the original video data for context
      const { data: video } = await supabase
        .from("videos")
        .select("*")
        .eq("id", videoId)
        .single();

      if (!video) throw new Error("Video not found");

      // Fetch series data
      const { data: series } = await supabase
        .from("faceless_series")
        .select("*")
        .eq("id", seriesId)
        .single();

      const { data, error } = await supabase.functions.invoke("generate-faceless-video", {
        body: {
          niche: (video as any).niche || series?.niche || "",
          aspectRatio: video.aspect_ratio,
          language: video.language,
          country: video.country,
          seriesId,
          partNumber: ((video as any).part_number || 1) + 1,
          previousContext: (video as any).context_for_continuation || "",
          previousCliffhanger: (video as any).cliffhanger || "",
          seedImageUrl: series?.seed_image_url || (video as any).seed_image_url || "",
        },
      });

      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error || "Generation failed");

      toast.success("Part 2 generation started!");
      return data.videoId;
    } catch (err: any) {
      toast.error(err.message || "Failed to generate next part");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generatePart2, loading };
}
