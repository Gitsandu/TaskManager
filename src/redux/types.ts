import { Task } from '@/types/task';

export interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  tasks: TaskState;
}
