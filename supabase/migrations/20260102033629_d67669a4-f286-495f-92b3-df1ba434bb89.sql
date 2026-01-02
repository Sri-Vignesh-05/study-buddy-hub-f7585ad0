-- Add user_id column to students table to link with Supabase Auth
ALTER TABLE public.students ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create unique constraint on user_id (one student per auth user)
ALTER TABLE public.students ADD CONSTRAINT students_user_id_unique UNIQUE (user_id);

-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create security definer function to get current student id
CREATE OR REPLACE FUNCTION public.get_current_student_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.students WHERE user_id = auth.uid()
$$;

-- Policy for user_roles: users can read their own roles
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy for user_roles: only admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Drop existing public policies on students
DROP POLICY IF EXISTS "Anyone can insert students" ON public.students;
DROP POLICY IF EXISTS "Anyone can read students" ON public.students;
DROP POLICY IF EXISTS "Anyone can update students" ON public.students;

-- Create secure policies for students
CREATE POLICY "Users can insert their own student profile"
ON public.students
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read their own student profile"
ON public.students
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own student profile"
ON public.students
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can read all students"
ON public.students
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing public policies on tasks
DROP POLICY IF EXISTS "Anyone can insert tasks" ON public.tasks;
DROP POLICY IF EXISTS "Anyone can read tasks" ON public.tasks;
DROP POLICY IF EXISTS "Anyone can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Anyone can delete tasks" ON public.tasks;

-- Create secure policies for tasks
CREATE POLICY "Users can insert their own tasks"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (student_id = public.get_current_student_id());

CREATE POLICY "Users can read their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (student_id = public.get_current_student_id());

CREATE POLICY "Users can update their own tasks"
ON public.tasks
FOR UPDATE
TO authenticated
USING (student_id = public.get_current_student_id());

CREATE POLICY "Users can delete their own tasks"
ON public.tasks
FOR DELETE
TO authenticated
USING (student_id = public.get_current_student_id());

CREATE POLICY "Admins can read all tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing public policies on study_logs
DROP POLICY IF EXISTS "Anyone can insert study logs" ON public.study_logs;
DROP POLICY IF EXISTS "Anyone can read study logs" ON public.study_logs;
DROP POLICY IF EXISTS "Anyone can update study logs" ON public.study_logs;

-- Create secure policies for study_logs
CREATE POLICY "Users can insert their own study logs"
ON public.study_logs
FOR INSERT
TO authenticated
WITH CHECK (student_id = public.get_current_student_id());

CREATE POLICY "Users can read their own study logs"
ON public.study_logs
FOR SELECT
TO authenticated
USING (student_id = public.get_current_student_id());

CREATE POLICY "Users can update their own study logs"
ON public.study_logs
FOR UPDATE
TO authenticated
USING (student_id = public.get_current_student_id());

CREATE POLICY "Admins can read all study logs"
ON public.study_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));