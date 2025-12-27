-- Add estimated_time column to tasks table (in minutes)
ALTER TABLE public.tasks ADD COLUMN estimated_minutes integer DEFAULT NULL;