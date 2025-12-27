import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Atom, Beaker, Leaf } from 'lucide-react';
import { toast } from 'sonner';

type SubjectType = 'physics' | 'chemistry' | 'biology';
type TaskType = 'daily' | 'weekly' | 'monthly';

interface Task {
  id: string;
  title: string;
  subject: SubjectType;
  task_type: TaskType;
  is_completed: boolean;
}

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (title: string, subject: SubjectType, taskType: TaskType) => void;
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
  const [selectedSubject, setSelectedSubject] = useState<SubjectType>('physics');
  const [selectedType, setSelectedType] = useState<TaskType>('daily');

  const handleAddTask = () => {
    if (!newTask.trim()) {
      toast.error('Please enter a task');
      return;
    }
    onAddTask(newTask.trim(), selectedSubject, selectedType);
    setNewTask('');
    toast.success('Task added! 📝');
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
            className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${config.bgClass} ${config.borderClass} transition-all`}
          >
            <Checkbox
              checked={task.is_completed}
              onCheckedChange={() => onToggleTask(task.id)}
            />
            <span className={`flex-1 ${task.is_completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteTask(task.id)}
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
    <Card>
      <CardHeader>
        <CardTitle className="font-display">Task Manager</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Task Section */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex gap-2">
            <Input
              placeholder="Enter a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              className="flex-1"
            />
            <Button onClick={handleAddTask} className="gradient-hero">
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1">
              {(Object.keys(subjectConfig) as SubjectType[]).map((subject) => {
                const config = subjectConfig[subject];
                const Icon = config.icon;
                return (
                  <Button
                    key={subject}
                    variant={selectedSubject === subject ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedSubject(subject)}
                    className={selectedSubject === subject ? '' : config.textClass}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {config.label}
                  </Button>
                );
              })}
            </div>
            <div className="flex gap-1">
              {(['daily', 'weekly', 'monthly'] as TaskType[]).map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="capitalize"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Task List by Subject */}
        <Tabs defaultValue="physics">
          <TabsList className="grid w-full grid-cols-3">
            {(Object.keys(subjectConfig) as SubjectType[]).map((subject) => {
              const config = subjectConfig[subject];
              const Icon = config.icon;
              return (
                <TabsTrigger key={subject} value={subject} className="gap-2">
                  <Icon className="w-4 h-4" />
                  {config.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {(Object.keys(subjectConfig) as SubjectType[]).map((subject) => (
            <TabsContent key={subject} value={subject} className="space-y-4 mt-4">
              <Tabs defaultValue="daily">
                <TabsList className="w-full">
                  <TabsTrigger value="daily" className="flex-1">Daily</TabsTrigger>
                  <TabsTrigger value="weekly" className="flex-1">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="daily" className="mt-4">
                  {renderTaskList(subject, 'daily')}
                </TabsContent>
                <TabsContent value="weekly" className="mt-4">
                  {renderTaskList(subject, 'weekly')}
                </TabsContent>
                <TabsContent value="monthly" className="mt-4">
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
