INSERT INTO storage.buckets (id, name, public)
VALUES ('transcripts', 'transcripts', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access for transcripts"
ON storage.objects FOR SELECT
USING (bucket_id = 'transcripts');

CREATE POLICY "Allow uploads to transcripts"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'transcripts');

CREATE POLICY "Allow updates to transcripts"
ON storage.objects FOR UPDATE
USING (bucket_id = 'transcripts');

CREATE POLICY "Allow deletes from transcripts"
ON storage.objects FOR DELETE
USING (bucket_id = 'transcripts');