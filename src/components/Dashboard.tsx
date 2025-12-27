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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full gradient-hero flex items-center justify-center shrink-0">
              <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-lg sm:text-xl font-bold truncate">NEET Tracker</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                Welcome, {student?.name || 'Future Doctor'}!
              </p>
            </div>
          </div>
          <Link to="/admin">
            <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm shrink-0">
              <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Admin</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-8 max-w-full overflow-x-hidden">
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
        <section className="grid grid-cols-1 gap-4 sm:gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <StudyTimeLogger 
            currentHours={getTodaysHours()}
            onLogTime={logStudyTime}
            onStudyLogged={handleStudyLogged}
          />
          <ProgressCharts 
            completionStats={completionStats}
          />
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
