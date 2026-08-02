-- Add script_data JSONB column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS script_data JSONB DEFAULT NULL;
