-- Update default status value in tasks table
-- Change default from 'Check VO' to 'Not started'

ALTER TABLE public.tasks 
ALTER COLUMN status SET DEFAULT 'Not started';

-- Update any NULL statuses to 'Not started'
UPDATE public.tasks 
SET status = 'Not started'
WHERE status IS NULL;

