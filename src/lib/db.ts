import { Task } from '@/types/task';

// Initial sample tasks
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project setup',
    description: 'Initialize the project with Next.js and set up basic structure',
    status: 'Done',
    priority: 'High',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    assignee: 'John Doe'
  },
  {
    id: '2',
    title: 'Implement task board',
    description: 'Create the drag and drop task board with columns for different statuses',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
    assignee: 'Jane Smith'
  },
  {
    id: '3',
    title: 'Add filter functionality',
    description: 'Implement filters for task status and priority',
    status: 'To Do',
    priority: 'Low',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    assignee: 'Alex Johnson'
  }
];

// Helper function to load tasks from localStorage (client-side only)
const loadTasksFromStorage = (): Task[] => {
  if (typeof window === 'undefined') {
    return initialTasks; // Return initial tasks on server
  }
  
  try {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : initialTasks;
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return initialTasks;
  }
};

// Helper function to save tasks to localStorage (client-side only)
export const saveTasksToStorage = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

// This is a very simple in-memory store with localStorage persistence.
// In a real app, this would be a database.
export const tasksDB: Task[] = loadTasksFromStorage();
