import { useStudent } from '@/hooks/useStudent';
import { useTasks } from '@/hooks/useTasks';
import { useStudyLogs } from '@/hooks/useStudyLogs';
import MotivationalBanner from '@/components/MotivationalBanner';
import StreakCounter from '@/components/StreakCounter';
import StudyTimeLogger from '@/components/StudyTimeLogger';
import TaskManager from '@/components/TaskManager';
import ProgressCharts from '@/components/ProgressCharts';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Settings, Stethoscope } from 'lucide-react';

const Dashboard = () => {
  const { student, updateStreak } = useStudent();
  const { tasks, addTask, toggleTask, deleteTask, getCompletionStats } = useTasks(student?.id);
  const { logStudyTime, getTodaysHours, getWeeklyData, getTotalHours } = useStudyLogs(student?.id);

  const handleStudyLogged = () => {
    updateStreak();
  };

  const completionStats = getCompletionStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">NEET Tracker</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {student?.name || 'Future Doctor'}!
              </p>
            </div>
          </div>
          <Link to="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Motivational Quote */}
        <section className="animate-fade-in">
          <MotivationalBanner />
        </section>

        {/* Stats */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <StreakCounter 
            streak={student?.current_streak || 0}
            totalHours={getTotalHours()}
            completedTasks={completionStats.completed}
          />
        </section>

        {/* Study Time & Progress */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="lg:col-span-1">
            <StudyTimeLogger 
              currentHours={getTodaysHours()}
              onLogTime={logStudyTime}
              onStudyLogged={handleStudyLogged}
            />
          </div>
          <div className="lg:col-span-2">
            <ProgressCharts 
              weeklyData={getWeeklyData()}
              completionStats={completionStats}
            />
          </div>
        </section>

        {/* Task Manager */}
        <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <TaskManager 
            tasks={tasks}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
