-- Development: Make user_id nullable to allow anonymous tasks
-- WARNING: This is for development only! In production, user_id should be required.

-- Drop the NOT NULL constraint on user_id
ALTER TABLE public.tasks ALTER COLUMN user_id DROP NOT NULL;

-- Drop the foreign key constraint (we'll add it back conditionally)
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;

-- Add a new foreign key that allows NULL
ALTER TABLE public.tasks 
  ADD CONSTRAINT tasks_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow users to view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow users to insert their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow users to update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow users to delete their own tasks" ON public.tasks;

-- Development policies: Allow all operations (for development only)
CREATE POLICY "Allow all task operations (dev only)"
  ON public.tasks FOR ALL
  USING (true)
  WITH CHECK (true);

