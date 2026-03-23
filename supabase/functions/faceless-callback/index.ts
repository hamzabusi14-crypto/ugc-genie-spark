import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const {
      videoId,
      status = "done",
      videoUrl,
      cloudinaryPublicId,
      seedImageUrl,
      title,
      narration_script,
      story_summary,
      cliffhanger,
      context_for_continuation,
      character_description,
      partNumber,
      niche,
    } = body;

    if (!videoId) {
      return new Response(JSON.stringify({ error: "Missing videoId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update the video record
    const updateData: Record<string, any> = {
      status: status === "failed" ? "failed" : "done",
    };

    if (videoUrl) updateData.video_url = videoUrl;
    if (cloudinaryPublicId) updateData.cloudinary_public_id = cloudinaryPublicId;
    if (seedImageUrl) updateData.seed_image_url = seedImageUrl;
    if (title) updateData.product_name = title;
    if (narration_script) updateData.narration_script = narration_script;
    if (story_summary) updateData.story_summary = story_summary;
    if (cliffhanger) updateData.cliffhanger = cliffhanger;
    if (context_for_continuation) updateData.context_for_continuation = context_for_continuation;
    if (character_description) updateData.character_description = character_description;
    if (partNumber) updateData.part_number = partNumber;

    const { error: updateError } = await supabase
      .from("videos")
      .update(updateData)
      .eq("id", videoId);

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If part 1 and we have series data, create/update faceless_series
    if (partNumber === 1 || !partNumber) {
      const { data: video } = await supabase
        .from("videos")
        .select("user_id, series_id, niche")
        .eq("id", videoId)
        .single();

      if (video && video.series_id) {
        await supabase
          .from("faceless_series")
          .update({
            seed_image_url: seedImageUrl || null,
            character_description: character_description || null,
            title: title || "",
            niche: niche || video.niche || "",
          })
          .eq("id", video.series_id);
      } else if (video) {
        // Create a new series
        const { data: series } = await supabase
          .from("faceless_series")
          .insert({
            user_id: video.user_id,
            title: title || `Faceless: ${niche || video.niche || ""}`,
            niche: niche || video.niche || "",
            seed_image_url: seedImageUrl || null,
            character_description: character_description || null,
          })
          .select("id")
          .single();

        if (series) {
          await supabase
            .from("videos")
            .update({ series_id: series.id })
            .eq("id", videoId);
        }
      }
    } else if (partNumber > 1) {
      // Update total_parts on the series
      const { data: video } = await supabase
        .from("videos")
        .select("series_id")
        .eq("id", videoId)
        .single();

      if (video?.series_id) {
        await supabase
          .from("faceless_series")
          .update({ total_parts: partNumber })
          .eq("id", video.series_id);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
