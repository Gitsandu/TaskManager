'use client';

import { FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Button,
  Grid,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Task, TaskStatus, TaskPriority } from '@/types/task';

const taskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .trim()
    .refine(val => val.length > 0, 'Title cannot be empty'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .transform(val => val === '' ? undefined : val),
  status: z.enum(['To Do', 'In Progress', 'Done'] as const, {
    errorMap: () => ({ message: 'Please select a valid status' })
  }),
  priority: z.enum(['Low', 'Medium', 'High'] as const, {
    errorMap: () => ({ message: 'Please select a valid priority' })
  }),
  dueDate: z.date({
    errorMap: () => ({ message: 'Please enter a valid date' })
  })
    .optional()
    .nullable()
    .refine(
      (date) => {
        if (!date) return true; // Allow null/undefined
        // Ensure date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        return date >= today;
      },
      { message: 'Due date cannot be in the past' }
    ),
  assignee: z.string()
    .max(50, 'Assignee name must be less than 50 characters')
    .optional()
    .transform(val => val === '' ? undefined : val),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

const TaskForm: FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const defaultValues: TaskFormData = initialData
    ? {
        ...initialData,
        dueDate: initialData.dueDate ? new Date(initialData.dueDate) : null,
      }
    : {
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        dueDate: null,
        assignee: '',
      };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const handleFormSubmit = (data: TaskFormData) => {
    // Format the data before submitting
    const formattedData = {
      ...data,
      title: data.title.trim(),
      description: data.description?.trim(),
      assignee: data.assignee?.trim(),
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      {Object.keys(errors).length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Please correct the errors in the form before submitting
        </Alert>
      )}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Title"
            fullWidth
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={!!errors.status}>
            <InputLabel id="status-label">Status</InputLabel>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select labelId="status-label" label="Status" {...field}>
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
              )}
            />
            {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth error={!!errors.priority}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select labelId="priority-label" label="Priority" {...field}>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              )}
            />
            {errors.priority && <FormHelperText>{errors.priority.message}</FormHelperText>}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Controller
            name="dueDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="Due Date"
                value={field.value}
                onChange={field.onChange}
                disablePast={true}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.dueDate,
                    helperText: errors.dueDate?.message,
                  },
                }}
              />
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Assignee"
            fullWidth
            {...register('assignee')}
            error={!!errors.assignee}
            helperText={errors.assignee?.message}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              {initialData ? 'Update Task' : 'Create Task'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default TaskForm;
