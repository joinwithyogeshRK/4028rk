import { useState } from 'react';
import { Check, Trash2, MoreVertical } from 'lucide-react';
import { Task } from './TodoApp';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: Task['category']) => void;
};

const TaskItem = ({ task, onToggle, onDelete, onCategoryChange }: TaskItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryBadge = () => {
    if (task.category === 'none') return null;
    
    const categoryClasses = {
      work: 'category-tag-work',
      personal: 'category-tag-personal',
      urgent: 'category-tag-urgent'
    };
    
    return (
      <Badge variant="outline" className={`category-tag ${categoryClasses[task.category]} ml-2`}>
        {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
      </Badge>
    );
  };

  return (
    <div 
      className="task-card group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-3 flex-1">
        <button 
          onClick={() => onToggle(task.id)}
          className={`task-checkbox ${task.completed ? 'task-checkbox-checked' : ''}`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <div className="task-checkbox-icon">
            <Check className="h-3 w-3" />
          </div>
        </button>
        
        <span className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          {task.text}
          {getCategoryBadge()}
        </span>
      </div>
      
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`opacity-0 group-hover:opacity-100 transition-opacity ${isHovered ? 'opacity-100' : ''}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onCategoryChange(task.id, 'none')}>No Category</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCategoryChange(task.id, 'work')}>Work</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCategoryChange(task.id, 'personal')}>Personal</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCategoryChange(task.id, 'urgent')}>Urgent</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(task.id)} 
          className={`delete-button opacity-0 group-hover:opacity-100 transition-opacity ${isHovered ? 'opacity-100' : ''}`}
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
