
-- Add missing fields to platform_settings table for full functionality
ALTER TABLE public.platform_settings 
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS enable_chat BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_booking BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_stories BOOLEAN DEFAULT true;

-- Update the existing record with default values if needed
UPDATE public.platform_settings 
SET 
  contact_email = COALESCE(contact_email, 'support@example.com'),
  enable_chat = COALESCE(enable_chat, true),
  enable_booking = COALESCE(enable_booking, true),
  enable_stories = COALESCE(enable_stories, true)
WHERE contact_email IS NULL OR enable_chat IS NULL OR enable_booking IS NULL OR enable_stories IS NULL;
