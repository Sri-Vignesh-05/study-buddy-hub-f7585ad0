import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '@/hooks/useStudent';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const { student, loading: studentLoading } = useStudent();

  useEffect(() => {
    if (!authLoading && !session) {
      navigate('/auth');
    }
  }, [session, authLoading, navigate]);

  if (authLoading || studentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to /auth
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
