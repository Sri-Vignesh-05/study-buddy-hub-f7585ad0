import { useStudent } from '@/hooks/useStudent';
import RegistrationForm from '@/components/RegistrationForm';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { student, loading } = useStudent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your journey...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return <RegistrationForm onSuccess={() => window.location.reload()} />;
  }

  return <Dashboard />;
};

export default Index;
