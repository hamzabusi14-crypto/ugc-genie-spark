import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { videoId, videoUrl, status, taskId, parentVideoId, duration, cloudinaryPublicId } = await req.json();

    if (!videoId || !status) {
      return new Response(JSON.stringify({ error: "Missing videoId or status" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (taskId && parentVideoId) {
      // Extension callback: both taskId AND parentVideoId present — create a new record
      if (status === "done" && videoUrl) {
        const { data: original, error: fetchError } = await supabase
          .from("videos")
          .select("product_name, product_image_url, language, country, user_id, aspect_ratio, model, description, cloudinary_public_id")
          .eq("id", parentVideoId)
          .single();

        if (fetchError || !original) {
          return new Response(JSON.stringify({ error: fetchError?.message || "Original video not found" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { error: insertError } = await supabase
          .from("videos")
          .insert({
            user_id: original.user_id,
            product_name: original.product_name,
            product_image_url: original.product_image_url,
            language: original.language,
            country: original.country,
            aspect_ratio: original.aspect_ratio,
            model: original.model,
            description: original.description,
            cloudinary_public_id: original.cloudinary_public_id,
            video_url: videoUrl,
            status: "done",
            duration: duration || "16s",
            parent_video_id: parentVideoId,
            task_id: taskId,
          });

        if (insertError) {
          return new Response(JSON.stringify({ error: insertError.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } else {
        return new Response(JSON.stringify({ success: true, message: "Extension in progress, no update needed" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      // Normal callback: update existing record
      const updateData: Record<string, unknown> = { status };
      if (videoUrl) updateData.video_url = videoUrl;
      if (taskId) updateData.task_id = taskId;
      if (cloudinaryPublicId) updateData.cloudinary_public_id = cloudinaryPublicId;

      const { error } = await supabase
        .from("videos")
        .update(updateData)
        .eq("id", videoId);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
