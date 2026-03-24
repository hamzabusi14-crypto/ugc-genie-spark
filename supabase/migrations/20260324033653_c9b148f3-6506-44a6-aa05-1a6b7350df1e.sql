
CREATE TABLE IF NOT EXISTS public.subtitle_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_id UUID REFERENCES public.videos(id) ON DELETE SET NULL,
  original_video_url TEXT NOT NULL,
  subtitled_video_url TEXT,
  transcript_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  replicate_prediction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subtitle_jobs_user_id ON public.subtitle_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_subtitle_jobs_status ON public.subtitle_jobs(status);

ALTER TABLE public.subtitle_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subtitle jobs" ON public.subtitle_jobs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own subtitle jobs" ON public.subtitle_jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subtitle jobs" ON public.subtitle_jobs FOR UPDATE TO authenticated USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.subtitle_jobs;
