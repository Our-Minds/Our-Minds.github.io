
-- Check the current constraint definition for consultant_availability
SELECT conname, pg_get_constraintdef(oid) as constraint_def
FROM pg_constraint 
WHERE conrelid = 'public.consultant_availability'::regclass 
AND contype = 'c';

-- Update the check constraint to accept 1-7 range (Monday=1, Sunday=7)
ALTER TABLE public.consultant_availability 
DROP CONSTRAINT IF EXISTS consultant_availability_day_of_week_check;

ALTER TABLE public.consultant_availability 
ADD CONSTRAINT consultant_availability_day_of_week_check 
CHECK (day_of_week >= 1 AND day_of_week <= 7);
