import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const webhookUrl = Deno.env.get("N8N_SUBTITLE_WEBHOOK_URL");

    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: "Subtitle webhook URL not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const body = await req.json();
    const {
      videoUrl,
      videoId,
      font = "Poppins/Poppins-ExtraBold.ttf",
      color = "white",
      highlightColor = "yellow",
      fontsize = 7,
      maxChars = 20,
      subsPosition = "bottom75",
      opacity = 0,
      strokeColor = "black",
      strokeWidth = 2.6,
      rightToLeft = false,
      translate = false,
    } = body;

    if (!videoUrl) {
      return new Response(JSON.stringify({ error: "videoUrl is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create subtitle job record
    const { data: job, error: insertError } = await supabase
      .from("subtitle_jobs")
      .insert({
        user_id: userId,
        video_id: videoId || null,
        original_video_url: videoUrl,
        status: "processing",
        settings: {
          font,
          color,
          highlightColor,
          fontsize,
          maxChars,
          subsPosition,
          opacity,
          strokeColor,
          strokeWidth,
          rightToLeft,
          translate,
        },
      })
      .select("id")
      .single();

    if (insertError || !job) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create subtitle job" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build callback URL
    const callbackUrl = `${supabaseUrl}/functions/v1/subtitle-callback`;

    // Fire n8n webhook
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: job.id,
        videoUrl,
        font,
        color,
        highlightColor,
        fontsize,
        maxChars,
        subsPosition,
        opacity,
        strokeColor,
        strokeWidth,
        rightToLeft,
        translate,
        callbackUrl,
      }),
    }).catch((err) => console.error("Webhook fire error:", err));

    return new Response(
      JSON.stringify({ success: true, jobId: job.id, status: "processing" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
