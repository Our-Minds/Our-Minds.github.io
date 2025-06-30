
-- Add approval_status column to consultants table
ALTER TABLE public.consultants 
ADD COLUMN approval_status text NOT NULL DEFAULT 'pending'
CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Update existing consultants to have proper status
UPDATE public.consultants 
SET approval_status = CASE 
  WHEN available = true THEN 'approved'
  ELSE 'pending'
END;

-- Add index for better query performance
CREATE INDEX idx_consultants_approval_status ON public.consultants(approval_status);
