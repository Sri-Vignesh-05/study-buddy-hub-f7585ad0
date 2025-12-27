import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Atom, Beaker, Leaf, Clock, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';

type SubjectType = 'physics' | 'chemistry' | 'biology';
type TaskType = 'daily' | 'weekly' | 'monthly';

interface Task {
  id: string;
  title: string;
  subject: SubjectType;
  task_type: TaskType;
  is_completed: boolean;
  estimated_minutes?: number | null;
}

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (title: string, subject: SubjectType, taskType: TaskType, estimatedMinutes?: number) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const subjectConfig = {
  physics: {
    icon: Atom,
    label: 'Physics',
    bgClass: 'bg-physics-light',
    borderClass: 'border-physics',
    textClass: 'text-physics',
  },
  chemistry: {
    icon: Beaker,
    label: 'Chemistry',
    bgClass: 'bg-chemistry-light',
    borderClass: 'border-chemistry',
    textClass: 'text-chemistry',
  },
  biology: {
    icon: Leaf,
    label: 'Biology',
    bgClass: 'bg-biology-light',
    borderClass: 'border-biology',
    textClass: 'text-biology',
  },
};

const TaskManager = ({ tasks, onAddTask, onToggleTask, onDeleteTask }: TaskManagerProps) => {
  const [newTask, setNewTask] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('physics');
  const [selectedType, setSelectedType] = useState<TaskType>('daily');

  const handleAddTask = () => {
    if (!newTask.trim()) {
      toast.error('Please enter a task');
      return;
    }
    const minutes = estimatedTime ? parseInt(estimatedTime) : undefined;
    onAddTask(newTask.trim(), selectedSubject, selectedType, minutes);
    setNewTask('');
    setEstimatedTime('');
    toast.success('Task added! 📝');
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const filteredTasks = (subject: SubjectType, type: TaskType) => {
    return tasks.filter(t => t.subject === subject && t.task_type === type);
  };

  const renderTaskList = (subject: SubjectType, type: TaskType) => {
    const subjectTasks = filteredTasks(subject, type);
    const config = subjectConfig[subject];

    if (subjectTasks.length === 0) {
      return (
        <p className="text-center text-muted-foreground py-4">
          No {type} tasks yet. Add one above!
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {subjectTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${config.bgClass} ${config.borderClass} transition-all cursor-pointer ${task.is_completed ? 'opacity-60' : ''}`}
            onClick={() => onToggleTask(task.id)}
          >
            <div className="flex items-center justify-center">
              {task.is_completed ? (
                <CheckCircle2 className={`w-5 h-5 ${config.textClass}`} />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <span className={`${task.is_completed ? 'text-muted-foreground' : ''}`}>
                {task.title}
              </span>
              {task.estimated_minutes && (
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(task.estimated_minutes)}</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTask(task.id);
              }}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 sm:pb-4">
        <CardTitle className="font-display text-base sm:text-lg">Task Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
        {/* Add Task Section */}
        <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              className="flex-1 text-sm"
            />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 sm:gap-2 flex-1 sm:flex-none">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                <Input
                  type="number"
                  placeholder="mins"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(e.target.value)}
                  className="w-16 sm:w-20 text-sm"
                  min="1"
                />
              </div>
              <Button onClick={handleAddTask} className="gradient-hero shrink-0 text-sm">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="grid grid-cols-3 gap-1 sm:flex sm:gap-1">
              {(Object.keys(subjectConfig) as SubjectType[]).map((subject) => {
                const config = subjectConfig[subject];
                const Icon = config.icon;
                return (
                  <Button
                    key={subject}
                    variant={selectedSubject === subject ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSubject(subject)}
                    className={`text-xs sm:text-sm px-2 sm:px-3 ${selectedSubject === subject ? '' : config.textClass}`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                    <span className="hidden xs:inline">{config.label}</span>
                    <span className="xs:hidden">{config.label.slice(0, 3)}</span>
                  </Button>
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-1 sm:flex sm:gap-1">
              {(['daily', 'weekly', 'monthly'] as TaskType[]).map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="capitalize text-xs sm:text-sm px-2 sm:px-3"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Task List by Subject */}
        <Tabs defaultValue="physics" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            {(Object.keys(subjectConfig) as SubjectType[]).map((subject) => {
              const config = subjectConfig[subject];
              const Icon = config.icon;
              return (
                <TabsTrigger key={subject} value={subject} className="gap-1 sm:gap-2 text-xs sm:text-sm py-2">
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">{config.label}</span>
                  <span className="xs:hidden">{config.label.slice(0, 3)}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {(Object.keys(subjectConfig) as SubjectType[]).map((subject) => (
            <TabsContent key={subject} value={subject} className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              <Tabs defaultValue="daily" className="w-full">
                <TabsList className="w-full h-auto">
                  <TabsTrigger value="daily" className="flex-1 text-xs sm:text-sm py-1.5">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="flex-1 text-xs sm:text-sm py-1.5">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="flex-1 text-xs sm:text-sm py-1.5">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="daily" className="mt-3 sm:mt-4">
                  {renderTaskList(subject, 'daily')}
                </TabsContent>
                <TabsContent value="weekly" className="mt-3 sm:mt-4">
                  {renderTaskList(subject, 'weekly')}
                </TabsContent>
                <TabsContent value="monthly" className="mt-3 sm:mt-4">
                  {renderTaskList(subject, 'monthly')}
                </TabsContent>
              </Tabs>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskManager;
