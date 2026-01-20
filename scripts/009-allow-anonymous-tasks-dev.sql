-- Development policy: Allow anonymous users to create tasks
-- WARNING: This is for development only! Remove or disable in production.

-- Allow anonymous inserts (for development)
CREATE POLICY "Allow anonymous task creation (dev only)"
  ON public.tasks FOR INSERT
  WITH CHECK (true);

-- Allow anonymous selects (for development)
CREATE POLICY "Allow anonymous task viewing (dev only)"
  ON public.tasks FOR SELECT
  USING (true);

-- Allow anonymous updates (for development)
CREATE POLICY "Allow anonymous task updates (dev only)"
  ON public.tasks FOR UPDATE
  USING (true);

-- Allow anonymous deletes (for development)
CREATE POLICY "Allow anonymous task deletes (dev only)"
  ON public.tasks FOR DELETE
  USING (true);

