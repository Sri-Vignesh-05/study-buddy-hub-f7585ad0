-- Create students table
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  current_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access (no login required)
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert new students
CREATE POLICY "Anyone can insert students"
ON public.students
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read students
CREATE POLICY "Anyone can read students"
ON public.students
FOR SELECT
USING (true);

-- Allow anyone to update students
CREATE POLICY "Anyone can update students"
ON public.students
FOR UPDATE
USING (true);

-- Create subjects enum
CREATE TYPE public.subject_type AS ENUM ('physics', 'chemistry', 'biology');

-- Create task type enum
CREATE TYPE public.task_type AS ENUM ('daily', 'weekly', 'monthly');

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject subject_type NOT NULL,
  task_type task_type NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to manage tasks
CREATE POLICY "Anyone can insert tasks"
ON public.tasks
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read tasks"
ON public.tasks
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update tasks"
ON public.tasks
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete tasks"
ON public.tasks
FOR DELETE
USING (true);

-- Create study logs table
CREATE TABLE public.study_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  study_date DATE NOT NULL DEFAULT CURRENT_DATE,
  hours DECIMAL(4,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, study_date)
);

-- Enable RLS for study logs
ALTER TABLE public.study_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to manage study logs
CREATE POLICY "Anyone can insert study logs"
ON public.study_logs
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can read study logs"
ON public.study_logs
FOR SELECT
USING (true);

CREATE POLICY "Anyone can update study logs"
ON public.study_logs
FOR UPDATE
USING (true);