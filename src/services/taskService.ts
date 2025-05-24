import { Task } from '@/types/task';

// Base API URL
const API_URL = '/api/tasks';

// Service for handling task-related API calls
export const taskService = {
  // Fetch all tasks
  fetchTasks: async (): Promise<Task[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  },

  // Fetch a single task by ID
  fetchTaskById: async (id: string): Promise<Task> => {
    const response = await fetch(`${API_URL}?id=${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch task');
    }
    return response.json();
  },

  // Add a new task
  addTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add task');
    }
    return response.json();
  },

  // Update an existing task
  updateTask: async (id: string, task: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update task');
    }
    return response.json();
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete task');
    }
  },
};
