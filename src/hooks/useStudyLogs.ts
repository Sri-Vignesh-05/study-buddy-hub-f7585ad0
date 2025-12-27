import { useState, useEffect } from 'react';

interface StudyLog {
  id: string;
  student_id: string;
  study_date: string;
  hours: number;
  created_at: string;
}

const API_URL = 'http://localhost:5000/api';

export const useStudyLogs = (studentId: string | undefined) => {
  const [logs, setLogs] = useState<StudyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/study_logs?student_id=${studentId}`);
      const { data, error } = await response.json();

      if (!error && data) {
        setLogs(data.map((log: any) => ({ ...log, hours: Number(log.hours) })));
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
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

    try {
      if (existing) {
        const response = await fetch(`${API_URL}/study_logs/${existing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hours })
        });
        const { data, error } = await response.json();

        if (!error) {
          setLogs(prev => prev.map(l =>
            l.id === existing.id ? { ...l, hours } : l
          ));
        }
      } else {
        const response = await fetch(`${API_URL}/study_logs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_id: studentId, hours, study_date: today })
        });
        const { data, error } = await response.json();

        if (!error && data) {
          setLogs(prev => [{ ...data, hours: Number(data.hours) }, ...prev]);
        }
      }
    } catch (err) {
      console.error("Failed to log study time", err);
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
