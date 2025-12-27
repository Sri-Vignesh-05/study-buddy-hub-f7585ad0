import { useState, useEffect } from 'react';

type SubjectType = 'physics' | 'chemistry' | 'biology';
type TaskType = 'daily' | 'weekly' | 'monthly';

interface Task {
  id: string;
  student_id: string;
  title: string;
  subject: SubjectType;
  task_type: TaskType;
  is_completed: boolean;
  created_at: string;
  completed_at: string | null;
  estimated_minutes: number | null;
}

const API_URL = 'http://localhost:5000/api';

export const useTasks = (studentId: string | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks?student_id=${studentId}`);
      const { data, error } = await response.json();

      if (!error && data) {
        setTasks(data as Task[]);
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [studentId]);

  const addTask = async (title: string, subject: SubjectType, taskType: TaskType, estimatedMinutes?: number) => {
    if (!studentId) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          title,
          subject,
          task_type: taskType,
          estimated_minutes: estimatedMinutes || null
        })
      });

      const { data, error } = await response.json();

      if (!error && data) {
        setTasks(prev => [data as Task, ...prev]);
      }
      return { data, error };
    } catch (err) {
      console.error("Failed to add task", err);
      return { data: null, error: err };
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_completed: !task.is_completed,
          completed_at: !task.is_completed ? new Date().toISOString() : null
        })
      });

      const { data, error } = await response.json();

      if (!error) {
        setTasks(prev => prev.map(t =>
          t.id === taskId
            ? { ...t, is_completed: !t.is_completed, completed_at: !t.is_completed ? new Date().toISOString() : null }
            : t
        ));
      }
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      const { error } = await response.json();

      if (!error) {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const getTasksBySubjectAndType = (subject: SubjectType, taskType: TaskType) => {
    return tasks.filter(t => t.subject === subject && t.task_type === taskType);
  };

  const getCompletionStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.is_completed).length;
    const bySubject = {
      physics: tasks.filter(t => t.subject === 'physics'),
      chemistry: tasks.filter(t => t.subject === 'chemistry'),
      biology: tasks.filter(t => t.subject === 'biology'),
    };

    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      bySubject: {
        physics: {
          total: bySubject.physics.length,
          completed: bySubject.physics.filter(t => t.is_completed).length,
        },
        chemistry: {
          total: bySubject.chemistry.length,
          completed: bySubject.chemistry.filter(t => t.is_completed).length,
        },
        biology: {
          total: bySubject.biology.length,
          completed: bySubject.biology.filter(t => t.is_completed).length,
        },
      },
    };
  };

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    getTasksBySubjectAndType,
    getCompletionStats,
    refetch: fetchTasks
  };
};
