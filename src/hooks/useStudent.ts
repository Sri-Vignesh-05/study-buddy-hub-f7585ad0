import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Student {
  id: string;
  name: string;
  age: number;
  current_streak: number | null;
  last_study_date: string | null;
  created_at: string;
  user_id: string | null;
}

export const useStudent = () => {
  const { user, session, loading: authLoading } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      if (authLoading) return;
      
      if (!user) {
        setStudent(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data && !error) {
        setStudent(data);
      } else {
        setStudent(null);
      }

      setLoading(false);
    };

    loadStudent();
  }, [user, authLoading]);

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

  return { 
    student, 
    loading: authLoading || loading, 
    updateStreak,
    isAuthenticated: !!session
  };
};
