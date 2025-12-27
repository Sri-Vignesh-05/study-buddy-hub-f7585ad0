import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Atom, Beaker, Leaf } from 'lucide-react';

interface ProgressChartsProps {
  completionStats: {
    total: number;
    completed: number;
    percentage: number;
    bySubject: {
      physics: { total: number; completed: number };
      chemistry: { total: number; completed: number };
      biology: { total: number; completed: number };
    };
  };
}

const ProgressCharts = ({ completionStats }: ProgressChartsProps) => {
  const getPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="font-display text-base sm:text-lg">Task Completion by Subject</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm gap-2">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground shrink-0">
                {completionStats.completed}/{completionStats.total} ({completionStats.percentage}%)
              </span>
            </div>
            <Progress value={completionStats.percentage} className="h-2 sm:h-3" />
          </div>

          {/* Physics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <Atom className="w-3 h-3 sm:w-4 sm:h-4 text-physics shrink-0" />
                <span className="font-medium">Physics</span>
              </div>
              <span className="text-muted-foreground shrink-0">
                {completionStats.bySubject.physics.completed}/{completionStats.bySubject.physics.total} (
                {getPercentage(completionStats.bySubject.physics.completed, completionStats.bySubject.physics.total)}%)
              </span>
            </div>
            <Progress 
              value={getPercentage(completionStats.bySubject.physics.completed, completionStats.bySubject.physics.total)} 
              className="h-1.5 sm:h-2 [&>div]:bg-physics"
            />
          </div>

          {/* Chemistry */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <Beaker className="w-3 h-3 sm:w-4 sm:h-4 text-chemistry shrink-0" />
                <span className="font-medium">Chemistry</span>
              </div>
              <span className="text-muted-foreground shrink-0">
                {completionStats.bySubject.chemistry.completed}/{completionStats.bySubject.chemistry.total} (
                {getPercentage(completionStats.bySubject.chemistry.completed, completionStats.bySubject.chemistry.total)}%)
              </span>
            </div>
            <Progress 
              value={getPercentage(completionStats.bySubject.chemistry.completed, completionStats.bySubject.chemistry.total)} 
              className="h-1.5 sm:h-2 [&>div]:bg-chemistry"
            />
          </div>

          {/* Biology */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
              <div className="flex items-center gap-1 sm:gap-2">
                <Leaf className="w-3 h-3 sm:w-4 sm:h-4 text-biology shrink-0" />
                <span className="font-medium">Biology</span>
              </div>
              <span className="text-muted-foreground shrink-0">
                {completionStats.bySubject.biology.completed}/{completionStats.bySubject.biology.total} (
                {getPercentage(completionStats.bySubject.biology.completed, completionStats.bySubject.biology.total)}%)
              </span>
            </div>
            <Progress 
              value={getPercentage(completionStats.bySubject.biology.completed, completionStats.bySubject.biology.total)} 
              className="h-1.5 sm:h-2 [&>div]:bg-biology"
            />
          </div>
        </CardContent>
    </Card>
  );
};

export default ProgressCharts;
