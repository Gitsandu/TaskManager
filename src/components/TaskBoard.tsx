'use client';

import { FC, useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Alert, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add as AddIcon } from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { fetchTasks, addTask, updateTask, deleteTask } from '@/redux/taskSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Task, TaskStatus } from '@/types/task';
import TaskCard from './TaskCard';
import TaskDialog from './TaskDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const TaskBoard: FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, isLoading, error } = useAppSelector((state) => state.tasks);
  
  // State for task dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [dialogTitle, setDialogTitle] = useState('');
  
  // State for filtering
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  
  // State for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [taskToDeleteTitle, setTaskToDeleteTitle] = useState<string>('');

  // Fetch tasks on component mount
  useEffect(() => {
    // @ts-ignore - Ignoring TypeScript errors for Redux async thunks
    dispatch(fetchTasks());
  }, [dispatch]);

  // Handle opening the create task dialog
  const handleOpenCreateDialog = () => {
    setCurrentTask(undefined);
    setDialogTitle('Create New Task');
    setIsDialogOpen(true);
  };

  // Handle opening the edit task dialog
  const handleOpenEditDialog = (task: Task) => {
    setCurrentTask(task);
    setDialogTitle('Edit Task');
    setIsDialogOpen(true);
  };

  // Handle task submission (create or update)
  const handleTaskSubmit = (data: any) => {
    if (currentTask) {
      // Update existing task
      // @ts-ignore - Ignoring TypeScript errors for Redux async thunks
      dispatch(updateTask({ id: currentTask.id, task: data }));
      setIsDialogOpen(false);
    } else {
      // Create new task
      // @ts-ignore - Ignoring TypeScript errors for Redux async thunks
      dispatch(addTask(data));
      setIsDialogOpen(false);
    }
  };

  // Handle opening the delete confirmation dialog
  const handleOpenDeleteDialog = (id: string, title: string) => {
    setTaskToDelete(id);
    setTaskToDeleteTitle(title);
    setIsDeleteDialogOpen(true);
  };

  // Handle task deletion after confirmation
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      // @ts-ignore - Ignoring TypeScript errors for Redux async thunks
      dispatch(deleteTask(taskToDelete));
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  // Handle task status change
  const handleStatusChange = (id: string, status: TaskStatus) => {
    // @ts-ignore - Ignoring TypeScript errors for Redux async thunks
    dispatch(updateTask({ id, task: { status } }));
  };

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination or the item was dropped back to its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    // Get the new status based on the destination droppableId
    const newStatus = destination.droppableId as TaskStatus;
    
    // Find the task that was dragged
    const draggedTask = tasks.find(task => task.id === draggableId);
    
    if (draggedTask && source.droppableId !== destination.droppableId) {
      // Send the update to Redux
      // @ts-ignore - Ignoring TypeScript errors for Redux async thunks
      dispatch(updateTask({ 
        id: draggableId, 
        task: { status: newStatus } 
      }));
    }
  };

  // Handle filter changes
  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
  };

  const handlePriorityFilterChange = (event: SelectChangeEvent) => {
    setPriorityFilter(event.target.value);
  };

  // Filter tasks based on selected filters
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  // Group tasks by status
  const todoTasks = filteredTasks.filter(task => task.status === 'To Do');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'In Progress');
  const doneTasks = filteredTasks.filter(task => task.status === 'Done');

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">Error loading tasks: {String(error)}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Task Board
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Add Task
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="status-filter-label">Filter by Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Filter by Status"
            onChange={handleStatusFilterChange}
            size="small"
          >
            <MenuItem value="All">All Statuses</MenuItem>
            <MenuItem value="To Do">To Do</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="priority-filter-label">Filter by Priority</InputLabel>
          <Select
            labelId="priority-filter-label"
            value={priorityFilter}
            label="Filter by Priority"
            onChange={handlePriorityFilterChange}
            size="small"
          >
            <MenuItem value="All">All Priorities</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Task Board with Drag and Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={3}>
          {/* To Do Column */}
          <Grid size={{ xs: 6, md: 4 }}>
            <Droppable droppableId="To Do">
              {(provided) => (
                <Paper 
                  sx={{ 
                    p: 2, 
                    bgcolor: '#f5f5f5', 
                    height: 'calc(100vh - 200px)', 
                    overflow: 'auto',
                    borderTop: '4px solid #1976d2'
                  }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    To Do ({todoTasks.length})
                  </Typography>
                  {todoTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onEdit={handleOpenEditDialog}
                            onDelete={handleOpenDeleteDialog}
                            onStatusChange={handleStatusChange}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {todoTasks.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                      No tasks to do
                    </Typography>
                  )}
                </Paper>
              )}
            </Droppable>
          </Grid>

          {/* In Progress Column */}
          <Grid size={{ xs: 6, md: 4 }}>
            <Droppable droppableId="In Progress">
              {(provided) => (
                <Paper 
                  sx={{ 
                    p: 2, 
                    bgcolor: '#f5f5f5', 
                    height: 'calc(100vh - 200px)', 
                    overflow: 'auto',
                    borderTop: '4px solid #ff9800'
                  }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    In Progress ({inProgressTasks.length})
                  </Typography>
                  {inProgressTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task} 
                            onEdit={handleOpenEditDialog}
                            onDelete={handleOpenDeleteDialog}
                            onStatusChange={handleStatusChange}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {inProgressTasks.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                      No tasks in progress
                    </Typography>
                  )}
                </Paper>
              )}
            </Droppable>
          </Grid>

          {/* Done Column */}
          <Grid size={{ xs: 6, md: 4 }}>
            <Droppable droppableId="Done">
              {(provided) => (
                <Paper 
                  sx={{ 
                    p: 2, 
                    bgcolor: '#f5f5f5', 
                    height: 'calc(100vh - 200px)', 
                    overflow: 'auto',
                    borderTop: '4px solid #4caf50'
                  }}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Done ({doneTasks.length})
                  </Typography>
                  {doneTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard
                            task={task}
                            onEdit={handleOpenEditDialog}
                            onDelete={handleOpenDeleteDialog}
                            onStatusChange={handleStatusChange}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {doneTasks.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                      No completed tasks
                    </Typography>
                  )}
                </Paper>
              )}
            </Droppable>
          </Grid>
        </Grid>
      </DragDropContext>

      {/* Task Dialog (Create/Edit) */}
      <TaskDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleTaskSubmit}
        task={currentTask}
        title={dialogTitle}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        content={`Are you sure you want to delete the task "${taskToDeleteTitle}"? This action cannot be undone.`}
      />
    </Container>
  );
};

export default TaskBoard;
