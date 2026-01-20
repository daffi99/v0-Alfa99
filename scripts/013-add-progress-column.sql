-- Add progress column to tasks table to store checklist progress
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS progress JSONB DEFAULT '{}'::jsonb;

-- Update existing rows to have empty progress object
UPDATE public.tasks 
SET progress = '{}'::jsonb
WHERE progress IS NULL;

