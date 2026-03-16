
CREATE TABLE public.landing_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_name text NOT NULL,
  html text,
  hero_image_url text,
  features_image_url text,
  howto_image_url text,
  pricing_image_url text,
  status text NOT NULL DEFAULT 'generating',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own landing pages"
  ON public.landing_pages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own landing pages"
  ON public.landing_pages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own landing pages"
  ON public.landing_pages FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own landing pages"
  ON public.landing_pages FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
