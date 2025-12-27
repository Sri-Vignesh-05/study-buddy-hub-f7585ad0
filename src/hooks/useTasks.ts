import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

export const useTasks = (studentId: string | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTasks(data as Task[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, [studentId]);

  const addTask = async (title: string, subject: SubjectType, taskType: TaskType) => {
    if (!studentId) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({ 
        student_id: studentId, 
        title, 
        subject, 
        task_type: taskType 
      })
      .select()
      .single();

    if (!error && data) {
      setTasks(prev => [data as Task, ...prev]);
    }
    return { data, error };
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const { error } = await supabase
      .from('tasks')
      .update({ 
        is_completed: !task.is_completed,
        completed_at: !task.is_completed ? new Date().toISOString() : null
      })
      .eq('id', taskId);

    if (!error) {
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, is_completed: !t.is_completed, completed_at: !t.is_completed ? new Date().toISOString() : null }
          : t
      ));
    }
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (!error) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
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
