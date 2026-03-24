
DROP POLICY IF EXISTS "Allow uploads to transcripts" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates to transcripts" ON storage.objects;

CREATE POLICY "Allow anonymous uploads to transcripts"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'transcripts');

CREATE POLICY "Allow anonymous updates to transcripts"
ON storage.objects FOR UPDATE
USING (bucket_id = 'transcripts');
