-- Migrate old status values to new status values
-- Map old statuses to new statuses:
-- "Check VO" -> "Not started"
-- "Mixing" -> "In progress"
-- "Mixing SRT" -> "In progress"
-- "Wait VO" -> "Wait VO" (unchanged)
-- "Finished" -> "Finished" (unchanged)

UPDATE public.tasks 
SET status = 'Not started'
WHERE status = 'Check VO';

UPDATE public.tasks 
SET status = 'In progress'
WHERE status IN ('Mixing', 'Mixing SRT');

-- Wait VO and Finished remain unchanged
-- No action needed for these

