DROP POLICY IF EXISTS "Allow anonymous uploads to transcripts" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous updates to transcripts" ON storage.objects;

CREATE POLICY "Allow all uploads to transcripts"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'transcripts');

CREATE POLICY "Allow all updates to transcripts"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'transcripts');