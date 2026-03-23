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
    const webhookUrl = Deno.env.get("N8N_FACELESS_WEBHOOK_URL");

    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: "Webhook URL not configured" }), {
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
      niche,
      aspectRatio = "9:16",
      language = "English",
      country,
      customPrompt,
      seriesId,
      partNumber = 1,
      previousContext,
      previousCliffhanger,
      seedImageUrl,
    } = body;

    if (!niche || !country) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check credits
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (!profile || profile.credits < 10) {
      return new Response(JSON.stringify({ error: "Insufficient credits" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create video record
    const { data: video, error: insertError } = await supabase
      .from("videos")
      .insert({
        user_id: userId,
        product_name: `Faceless: ${niche}`,
        product_image_url: seedImageUrl || "",
        status: "generating",
        video_type: "faceless",
        niche,
        aspect_ratio: aspectRatio,
        language,
        country,
        description: customPrompt || null,
        series_id: seriesId || null,
        part_number: partNumber,
        seed_image_url: seedImageUrl || null,
        credits_used: 10,
        duration: "8s",
      })
      .select("id")
      .single();

    if (insertError || !video) {
      return new Response(JSON.stringify({ error: "Failed to create video record" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Deduct credits
    await supabase
      .from("profiles")
      .update({ credits: profile.credits - 10 })
      .eq("id", userId);

    // Log transaction
    await supabase.from("transactions").insert({
      user_id: userId,
      type: "debit",
      amount: 0,
      credits: 10,
      description: `Faceless video: ${niche} (Part ${partNumber})`,
    });

    // Fire n8n webhook (don't await response)
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoId: video.id,
        niche,
        aspectRatio,
        language,
        country,
        customPrompt: customPrompt || "",
        seriesId: seriesId || null,
        partNumber,
        previousContext: previousContext || "",
        previousCliffhanger: previousCliffhanger || "",
        seedImageUrl: seedImageUrl || "",
      }),
    }).catch(() => {});

    return new Response(
      JSON.stringify({ success: true, videoId: video.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
