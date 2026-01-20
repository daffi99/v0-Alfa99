-- Create tasks table for kanban board
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  category TEXT NOT NULL DEFAULT 'Caption', -- Caption or No caption
  status TEXT NOT NULL DEFAULT 'Check VO', -- Check VO, Mixing, Mixing SRT
  stage TEXT NOT NULL DEFAULT 'Backlog', -- Backlog, In Progress, Finished, Revision, Customer Revision, Done
  episode_ranges TEXT NOT NULL, -- JSON array of ranges: "051-060,066-070"
  completed_episodes TEXT NOT NULL DEFAULT '[]', -- JSON array of completed episode indices
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tasks table
CREATE POLICY "Allow users to view their own tasks"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own tasks"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own tasks"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_stage ON public.tasks(stage);
