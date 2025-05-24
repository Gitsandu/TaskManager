import { FC } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  CardActions, 
  IconButton, 
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string, title: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'success';
    default:
      return 'default';
  }
};

const TaskCard: FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const handleStatusChange = (event: SelectChangeEvent) => {
    onStatusChange(task.id, event.target.value as TaskStatus);
  };

  return (
    <Card sx={{ mb: 2, width: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {task.title}
        </Typography>
        
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {task.description}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip 
            label={task.priority} 
            color={getPriorityColor(task.priority) as any}
            size="small"
          />
          
          {task.dueDate && (
            <Typography variant="caption" color="text.secondary">
              Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </Typography>
          )}
        </Box>
        
        {task.assignee && (
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Assigned to: {task.assignee}
          </Typography>
        )}
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id={`status-select-${task.id}`}>Status</InputLabel>
          <Select
            labelId={`status-select-${task.id}`}
            value={task.status}
            label="Status"
            onChange={handleStatusChange}
            size="small"
          >
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>
        
        <Box>
          <IconButton 
            size="small" 
            onClick={() => onEdit(task)}
            aria-label="edit task"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            size="small" 
            onClick={() => onDelete(task.id, task.title)}
            aria-label="delete task"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default TaskCard;
