import { Flame, Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StreakCounterProps {
  streak: number;
  totalHours: number;
  completedTasks: number;
}

const StreakCounter = ({ streak, totalHours, completedTasks }: StreakCounterProps) => {
  const getStreakMessage = () => {
    if (streak === 0) return "Start studying to build your streak!";
    if (streak < 7) return "Great start! Keep it going!";
    if (streak < 30) return "Amazing consistency! You're on fire!";
    if (streak < 100) return "Incredible dedication! Future doctor in the making!";
    return "Legendary! Nothing can stop you!";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Streak Card */}
      <Card className={`relative overflow-hidden ${streak > 0 ? 'animate-streak-glow' : ''}`}>
        <div className="absolute inset-0 gradient-warm opacity-10" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Study Streak
              </p>
              <p className="text-4xl font-display font-bold text-accent mt-1">
                {streak}
                <span className="text-lg text-muted-foreground ml-1">days</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {getStreakMessage()}
              </p>
            </div>
            <div className="w-16 h-16 rounded-full gradient-warm flex items-center justify-center">
              <Flame className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Hours Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/10" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Total Study Hours
              </p>
              <p className="text-4xl font-display font-bold text-primary mt-1">
                {totalHours.toFixed(1)}
                <span className="text-lg text-muted-foreground ml-1">hrs</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Keep tracking your progress!
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Completed Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-success opacity-10" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Tasks Completed
              </p>
              <p className="text-4xl font-display font-bold text-secondary mt-1">
                {completedTasks}
                <span className="text-lg text-muted-foreground ml-1">tasks</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Every task counts!
              </p>
            </div>
            <div className="w-16 h-16 rounded-full gradient-success flex items-center justify-center">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreakCounter;
