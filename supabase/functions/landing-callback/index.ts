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
    const { landingPageId, html, heroImageUrl, featuresImageUrl, howToUseImageUrl, pricingImageUrl, status } = await req.json();

    if (!landingPageId) {
      return new Response(JSON.stringify({ error: "Missing landingPageId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const updateData: Record<string, unknown> = {
      status: status || "done",
    };
    if (html) updateData.html = html;
    if (heroImageUrl) updateData.hero_image_url = heroImageUrl;
    if (featuresImageUrl) updateData.features_image_url = featuresImageUrl;
    if (howToUseImageUrl) updateData.howto_image_url = howToUseImageUrl;
    if (pricingImageUrl) updateData.pricing_image_url = pricingImageUrl;

    const { error } = await supabase
      .from("landing_pages")
      .update(updateData)
      .eq("id", landingPageId);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
