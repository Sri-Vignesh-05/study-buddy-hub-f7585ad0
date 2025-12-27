import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Atom, Beaker, Leaf } from 'lucide-react';

interface ProgressChartsProps {
  weeklyData: { date: string; hours: number }[];
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

const ProgressCharts = ({ weeklyData, completionStats }: ProgressChartsProps) => {
  const getPercentage = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Study Hours Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <TrendingUp className="w-5 h-5 text-primary" />
            Weekly Study Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`${value} hrs`, 'Study Time']}
                />
                <Bar 
                  dataKey="hours" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display">Task Completion by Subject</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Overall Progress</span>
              <span className="text-muted-foreground">
                {completionStats.completed}/{completionStats.total} tasks ({completionStats.percentage}%)
              </span>
            </div>
            <Progress value={completionStats.percentage} className="h-3" />
          </div>

          {/* Physics */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Atom className="w-4 h-4 text-physics" />
                <span className="font-medium">Physics</span>
              </div>
              <span className="text-muted-foreground">
                {completionStats.bySubject.physics.completed}/{completionStats.bySubject.physics.total} (
                {getPercentage(completionStats.bySubject.physics.completed, completionStats.bySubject.physics.total)}%)
              </span>
            </div>
            <Progress 
              value={getPercentage(completionStats.bySubject.physics.completed, completionStats.bySubject.physics.total)} 
              className="h-2 [&>div]:bg-physics"
            />
          </div>

          {/* Chemistry */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Beaker className="w-4 h-4 text-chemistry" />
                <span className="font-medium">Chemistry</span>
              </div>
              <span className="text-muted-foreground">
                {completionStats.bySubject.chemistry.completed}/{completionStats.bySubject.chemistry.total} (
                {getPercentage(completionStats.bySubject.chemistry.completed, completionStats.bySubject.chemistry.total)}%)
              </span>
            </div>
            <Progress 
              value={getPercentage(completionStats.bySubject.chemistry.completed, completionStats.bySubject.chemistry.total)} 
              className="h-2 [&>div]:bg-chemistry"
            />
          </div>

          {/* Biology */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-biology" />
                <span className="font-medium">Biology</span>
              </div>
              <span className="text-muted-foreground">
                {completionStats.bySubject.biology.completed}/{completionStats.bySubject.biology.total} (
                {getPercentage(completionStats.bySubject.biology.completed, completionStats.bySubject.biology.total)}%)
              </span>
            </div>
            <Progress 
              value={getPercentage(completionStats.bySubject.biology.completed, completionStats.bySubject.biology.total)} 
              className="h-2 [&>div]:bg-biology"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressCharts;
