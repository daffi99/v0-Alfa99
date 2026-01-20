-- Seed all finished tasks with all 5 progress steps checked
UPDATE public.tasks 
SET progress = '{
  "checkVO": true,
  "pitchShift": true,
  "mixing": true,
  "mixingSRT": true,
  "completed": true
}'::jsonb
WHERE status = 'Finished';

