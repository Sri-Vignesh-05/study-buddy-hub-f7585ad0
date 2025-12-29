import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StudyLog {
  id: string;
  student_id: string;
  study_date: string;
  hours: number;
  created_at: string;
}

export const useStudyLogs = (studentId: string | undefined) => {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('study_logs')
      .select('*')
      .eq('student_id', studentId)
      .order('study_date', { ascending: false });

    if (!error && data) {
      setLogs(data.map((log) => ({ ...log, hours: Number(log.hours) })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [studentId]);

  const logStudyTime = async (hours: number) => {
    if (!studentId) return;

    const today = new Date().toISOString().split('T')[0];

    // Check if entry exists for today
    const existing = logs.find(l => l.study_date === today);

    if (existing) {
      const { error } = await supabase
        .from('study_logs')
        .update({ hours })
        .eq('id', existing.id);

      if (!error) {
        setLogs(prev => prev.map(l =>
          l.id === existing.id ? { ...l, hours } : l
        ));
      }
    } else {
      const { data, error } = await supabase
        .from('study_logs')
        .insert({ student_id: studentId, hours, study_date: today })
        .select()
        .single();

      if (!error && data) {
        setLogs(prev => [{ ...data, hours: Number(data.hours) }, ...prev]);
      }
    }
  };

  const getTodaysHours = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = logs.find(l => l.study_date === today);
    return todayLog?.hours || 0;
  };

  const getWeeklyData = () => {
    const last7Days: { date: string; hours: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const log = logs.find(l => l.study_date === dateStr);
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: log?.hours || 0,
      });
    }

    return last7Days;
  };

  const getTotalHours = () => {
    return logs.reduce((sum, log) => sum + log.hours, 0);
  };

  return {
    logs,
    loading,
    logStudyTime,
    getTodaysHours,
    getWeeklyData,
    getTotalHours,
    refetch: fetchLogs
  };
};
