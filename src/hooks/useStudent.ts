import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  age: number;
  current_streak: number;
  last_study_date: string | null;
  created_at: string;
}

const STUDENT_ID_KEY = 'neet_student_id';
const API_URL = 'http://localhost:5000/api';

export const useStudent = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      const storedId = localStorage.getItem(STUDENT_ID_KEY);

      if (storedId) {
        try {
          const response = await fetch(`${API_URL}/students/${storedId}`);
          const { data, error } = await response.json();

          if (data && !error) {
            setStudent(data);
          } else {
            localStorage.removeItem(STUDENT_ID_KEY);
          }
        } catch (err) {
          console.error("Failed to load student", err);
          // Don't remove ID immediately on network error, but maybe here we assume invalid ID
        }
      }

      setLoading(false);
    };

    loadStudent();
  }, []);

  const registerStudent = async (name: string, age: number) => {
    try {
      const response = await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age })
      });

      const { data, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      localStorage.setItem(STUDENT_ID_KEY, data.id);
      setStudent(data);
      return data;
    } catch (err) {
      console.error("Registration failed", err);
      throw err;
    }
  };

  const updateStreak = async () => {
    if (!student) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let newStreak = 1;

    if (student.last_study_date === today) {
      return; // Already studied today
    } else if (student.last_study_date === yesterday) {
      newStreak = student.current_streak + 1;
    }

    try {
      const response = await fetch(`${API_URL}/students/${student.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_streak: newStreak,
          last_study_date: today
        })
      });

      const { data, error } = await response.json();

      if (!error && data) {
        setStudent(data);
      }
    } catch (err) {
      console.error("Failed to update streak", err);
    }
  };

  return { student, loading, registerStudent, updateStreak };
};
