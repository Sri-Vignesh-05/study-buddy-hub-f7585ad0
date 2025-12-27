import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface StudyTimeLoggerProps {
  currentHours: number;
  onLogTime: (hours: number) => void;
  onStudyLogged: () => void;
}

const StudyTimeLogger = ({ currentHours, onLogTime, onStudyLogged }: StudyTimeLoggerProps) => {
  const [hours, setHours] = useState(currentHours.toString());

  const handleQuickAdd = (amount: number) => {
    const newHours = Math.max(0, Math.min(24, parseFloat(hours || '0') + amount));
    setHours(newHours.toString());
  };

  const handleSave = () => {
    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum < 0 || hoursNum > 24) {
      toast.error('Please enter valid hours (0-24)');
      return;
    }
    onLogTime(hoursNum);
    onStudyLogged();
    toast.success(`Logged ${hoursNum} hours of study! 📚`);
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 gradient-hero" />
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-base sm:text-lg">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          Today's Study Time
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleQuickAdd(-0.5)}
            className="shrink-0 w-8 h-8 sm:w-10 sm:h-10"
          >
            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <div className="relative flex-1 min-w-0">
            <Input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="text-center text-lg sm:text-2xl font-bold h-10 sm:h-14 pr-12 sm:pr-16"
            />
            <span className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm text-muted-foreground">
              hours
            </span>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => handleQuickAdd(0.5)}
            className="shrink-0 w-8 h-8 sm:w-10 sm:h-10"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {[1, 2, 4, 6, 8].map((h) => (
            <Button
              key={h}
              variant="secondary"
              size="sm"
              className="text-xs sm:text-sm px-1 sm:px-3"
              onClick={() => setHours(h.toString())}
            >
              {h}h
            </Button>
          ))}
        </div>

        <Button onClick={handleSave} className="w-full gradient-hero hover:opacity-90 text-sm sm:text-base">
          Log Study Time
        </Button>
      </CardContent>
    </Card>
  );
};

export default StudyTimeLogger;
