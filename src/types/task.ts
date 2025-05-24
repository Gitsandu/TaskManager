export type TaskStatus = "To Do" | "In Progress" | "Done";

export type TaskPriority = "Low" | "Medium" | "High";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // Store as ISO string, handle Date object in forms
  assignee?: string;
}
