-- Add billing_month column to tasks table and seed default values
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS billing_month TEXT;

-- Seed default duration and billing_month for existing rows
UPDATE public.tasks 
SET duration = '00:10:00'
WHERE duration IS NULL OR duration = '';

UPDATE public.tasks 
SET billing_month = 'December'
WHERE billing_month IS NULL OR billing_month = '';


