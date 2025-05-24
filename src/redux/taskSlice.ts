import { createSlice, createAsyncThunk, PayloadAction, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { Task } from '@/types/task';
import { taskService } from '@/services/taskService';

// Define the task state interface
interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

// Define the initial state

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
};

// Async thunks for API calls
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_: void, { rejectWithValue }: { rejectWithValue: (value: string) => any }) => {
    try {
      return await taskService.fetchTasks();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task: Omit<Task, 'id'>, { rejectWithValue }: { rejectWithValue: (value: string) => any }) => {
    try {
      return await taskService.addTask(task);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, task }: { id: string; task: Partial<Task> }, { rejectWithValue }: { rejectWithValue: (value: string) => any }) => {
    try {
      return await taskService.updateTask(id, task);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }: { rejectWithValue: (value: string) => any }) => {
    try {
      await taskService.deleteTask(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete task');
    }
  }
);

// Create the task slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<TaskState>) => {
    // Fetch tasks
    builder
      .addCase(fetchTasks.pending, (state: TaskState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state: TaskState, action: PayloadAction<Task[]>) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state: TaskState, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add task
    builder
      .addCase(addTask.pending, (state: TaskState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state: TaskState, action: PayloadAction<Task>) => {
        state.isLoading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state: TaskState, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state: TaskState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state: TaskState, action: PayloadAction<Task>) => {
        state.isLoading = false;
        const index = state.tasks.findIndex((task: Task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state: TaskState, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state: TaskState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state: TaskState, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter((task: Task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state: TaskState, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default taskSlice.reducer;
