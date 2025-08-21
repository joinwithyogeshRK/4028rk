import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Check, Plus, Trash2, Sun, Moon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from './ThemeProvider';
import TaskItem from './TaskItem';
import { useToast } from '@/components/ui/use-toast';

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  category: 'work' | 'personal' | 'urgent' | 'none';
  createdAt: Date;
};

type FilterType = 'all' | 'active' | 'completed';

const TodoApp = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [newTaskCategory, setNewTaskCategory] = useState<Task['category']>('none');
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTaskText.trim() === '') {
      toast({
        title: "Task cannot be empty",
        description: "Please enter a task description",
        variant: "destructive"
      });
      return;
    }

    const newTask: Task = {
      id: uuidv4(),
      text: newTaskText,
      completed: false,
      category: newTaskCategory,
      createdAt: new Date()
    };

    setTasks([...tasks, newTask]);
    setNewTaskText('');
    setNewTaskCategory('none');
    
    toast({
      title: "Task added",
      description: "Your new task has been added successfully"
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Task deleted",
      description: "The task has been removed"
    });
  };

  const updateTaskCategory = (id: string, category: Task['category']) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, category } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-3xl">
        <Card className="shadow-md border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-2xl font-bold text-primary">Simple Todo</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </CardHeader>
          
          <CardContent>
            <div className="flex space-x-2 mb-6">
              <Input
                type="text"
                placeholder="Add a new task..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
                className="task-input"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setNewTaskCategory('none')}>
                    None
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewTaskCategory('work')}>
                    <Badge variant="outline" className="category-tag category-tag-work mr-2">Work</Badge>
                    Work
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewTaskCategory('personal')}>
                    <Badge variant="outline" className="category-tag category-tag-personal mr-2">Personal</Badge>
                    Personal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setNewTaskCategory('urgent')}>
                    <Badge variant="outline" className="category-tag category-tag-urgent mr-2">Urgent</Badge>
                    Urgent
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={addTask} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex space-x-2 mb-4">
              <Button 
                onClick={() => setFilter('all')} 
                className={filter === 'all' ? 'filter-button filter-button-active' : 'filter-button filter-button-inactive'}
                variant={filter === 'all' ? 'default' : 'outline'}
              >
                All
              </Button>
              <Button 
                onClick={() => setFilter('active')} 
                className={filter === 'active' ? 'filter-button filter-button-active' : 'filter-button filter-button-inactive'}
                variant={filter === 'active' ? 'default' : 'outline'}
              >
                Active
              </Button>
              <Button 
                onClick={() => setFilter('completed')} 
                className={filter === 'completed' ? 'filter-button filter-button-active' : 'filter-button filter-button-inactive'}
                variant={filter === 'completed' ? 'default' : 'outline'}
              >
                Completed
              </Button>
            </div>
            
            <div className="space-y-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleTaskCompletion}
                    onDelete={deleteTask}
                    onCategoryChange={updateTaskCategory}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {filter === 'all' ? 'No tasks yet. Add one above!' : 
                   filter === 'active' ? 'No active tasks.' : 'No completed tasks.'}
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="border-t pt-4">
            <div className="stats-card w-full">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Progress</h3>
                <p className="text-2xl font-bold">{completionPercentage}%</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {completedCount}/{totalCount} tasks completed
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TodoApp;
