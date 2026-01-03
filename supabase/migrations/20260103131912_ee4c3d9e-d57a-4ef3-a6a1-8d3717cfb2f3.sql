-- Drop existing restrictive RLS policies on students
DROP POLICY IF EXISTS "Admins can read all students" ON public.students;
DROP POLICY IF EXISTS "Users can insert their own student profile" ON public.students;
DROP POLICY IF EXISTS "Users can read their own student profile" ON public.students;
DROP POLICY IF EXISTS "Users can update their own student profile" ON public.students;

-- Create permissive policies for students (no auth required)
CREATE POLICY "Anyone can insert students" 
ON public.students 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can read students" 
ON public.students 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update students" 
ON public.students 
FOR UPDATE 
USING (true);

-- Drop existing restrictive RLS policies on study_logs
DROP POLICY IF EXISTS "Admins can read all study logs" ON public.study_logs;
DROP POLICY IF EXISTS "Users can insert their own study logs" ON public.study_logs;
DROP POLICY IF EXISTS "Users can read their own study logs" ON public.study_logs;
DROP POLICY IF EXISTS "Users can update their own study logs" ON public.study_logs;

-- Create permissive policies for study_logs
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

-- Drop existing restrictive RLS policies on tasks
DROP POLICY IF EXISTS "Admins can read all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can read their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;

-- Create permissive policies for tasks
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