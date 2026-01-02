import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Student {
  id: string;
  name: string;
  age: number;
  current_streak: number | null;
  last_study_date: string | null;
  created_at: string;
}

const STUDENT_ID_KEY = 'neet_student_id';

export const useStudent = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      const storedId = localStorage.getItem(STUDENT_ID_KEY);

      if (storedId) {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('id', storedId)
          .maybeSingle();

        if (data && !error) {
          setStudent(data);
        } else {
          localStorage.removeItem(STUDENT_ID_KEY);
        }
      }

      setLoading(false);
    };

    loadStudent();
  }, []);

  const registerStudent = async (name: string, age: number) => {
    // Check if student with same name and age already exists
    const { data: existingStudent } = await supabase
      .from('students')
      .select('*')
      .eq('name', name.trim())
      .eq('age', age)
      .maybeSingle();

    if (existingStudent) {
      // Return existing student
      localStorage.setItem(STUDENT_ID_KEY, existingStudent.id);
      setStudent(existingStudent);
      return existingStudent;
    }

    // Create new student if not found
    const { data, error } = await supabase
      .from('students')
      .insert({ name: name.trim(), age })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    localStorage.setItem(STUDENT_ID_KEY, data.id);
    setStudent(data);
    return data;
  };

  const updateStreak = async () => {
    if (!student) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = 1;

    if (student.last_study_date === today) {
      return; // Already studied today
    } else if (student.last_study_date === yesterday) {
      newStreak = (student.current_streak || 0) + 1;
    }

    const { data, error } = await supabase
      .from('students')
      .update({
        current_streak: newStreak,
        last_study_date: today
      })
      .eq('id', student.id)
      .select()
      .single();

    if (!error && data) {
      setStudent(data);
    }
  };

  const logout = () => {
    localStorage.removeItem(STUDENT_ID_KEY);
    setStudent(null);
  };

  return { student, loading, registerStudent, updateStreak, logout };
};
