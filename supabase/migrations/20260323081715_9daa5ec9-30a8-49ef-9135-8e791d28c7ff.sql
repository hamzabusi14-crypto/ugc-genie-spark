
-- Add new columns to videos table for faceless video support
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS video_type text NOT NULL DEFAULT 'ugc';
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS niche text;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS seed_image_url text;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS narration_script text;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS cliffhanger text;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS story_summary text;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS context_for_continuation text;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS character_description text;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS part_number integer NOT NULL DEFAULT 1;
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS series_id uuid;

-- Create faceless_series table
CREATE TABLE IF NOT EXISTS public.faceless_series (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT '',
  niche text NOT NULL DEFAULT '',
  seed_image_url text,
  character_description text,
  total_parts integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on faceless_series
ALTER TABLE public.faceless_series ENABLE ROW LEVEL SECURITY;

-- RLS policies for faceless_series
CREATE POLICY "Users can view their own series" ON public.faceless_series FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own series" ON public.faceless_series FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own series" ON public.faceless_series FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own series" ON public.faceless_series FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Enable realtime for faceless_series
ALTER PUBLICATION supabase_realtime ADD TABLE public.faceless_series;
