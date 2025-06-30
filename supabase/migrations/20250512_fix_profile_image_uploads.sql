
-- Create profile_images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'profile_images', 'profile_images', true
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'profile_images'
);

-- Create proper RLS policies for the profile_images bucket
-- First, drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view profile images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload profile images" ON storage.objects;

-- Create policy for viewing profile images (public)
CREATE POLICY "Anyone can view profile images"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile_images');

-- Create policy for uploading profile images (authenticated users only)
CREATE POLICY "Authenticated users can upload profile images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile_images' AND
  auth.role() = 'authenticated'
);

-- Create policy for updating profile images (only owner)
CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy for deleting profile images (only owner)
CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile_images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
