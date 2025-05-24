import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { tasksDB, saveTasksToStorage } from '@/lib/db';
import { Task } from '@/types/task';
import { z } from 'zod';

// Task validation schema for creating new tasks
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
  dueDate: z.any().optional().nullable(),
  assignee: z.string()
    .max(50, 'Assignee name must be less than 50 characters')
    .optional()
    .transform(val => val === '' ? undefined : val),
});

// Partial schema for updating tasks
const partialTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .trim()
    .refine(val => val.length > 0, 'Title cannot be empty')
    .optional(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .transform(val => val === '' ? undefined : val),
  status: z.enum(['To Do', 'In Progress', 'Done'] as const, {
    errorMap: () => ({ message: 'Please select a valid status' })
  }).optional(),
  priority: z.enum(['Low', 'Medium', 'High'] as const, {
    errorMap: () => ({ message: 'Please select a valid priority' })
  }).optional(),
  dueDate: z.any().optional().nullable(),
  assignee: z.string()
    .max(50, 'Assignee name must be less than 50 characters')
    .optional()
    .transform(val => val === '' ? undefined : val),
});

// Helper function to validate complete task data
function validateTask(data: any) {
  const result = taskSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }));
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
}

// Helper function to validate partial task updates
function validatePartialTask(data: any) {
  const result = partialTaskSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message
    }));
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
}

// GET /api/tasks - Get all tasks
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // If ID is provided, return a single task
  if (id) {
    const task = tasksDB.find((t) => t.id === id);
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(task);
  }

  // Otherwise return all tasks
  return NextResponse.json(tasksDB);
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate task data
    const validation = validateTask(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }
    
    const newTask: Task = {
      id: uuidv4(),
      title: body.title,
      description: body.description || '',
      status: body.status,
      priority: body.priority,
      dueDate: body.dueDate || undefined,
      assignee: body.assignee || undefined,
    };
    
    tasksDB.push(newTask);
    
    // Save to localStorage
    saveTasksToStorage(tasksDB);
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks - Update a task
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const taskIndex = tasksDB.findIndex((t) => t.id === id);
    
    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    // For updates, use the partial validation schema
    const validation = validatePartialTask(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }
    
    // Update the task with the new data
    const updatedTask = {
      ...tasksDB[taskIndex],
      ...body,
      id, // Ensure the ID doesn't change
    };
    
    tasksDB[taskIndex] = updatedTask;
    
    // Save to localStorage
    saveTasksToStorage(tasksDB);
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks - Delete a task
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { error: 'Task ID is required' },
      { status: 400 }
    );
  }
  
  const taskIndex = tasksDB.findIndex((t) => t.id === id);
  
  if (taskIndex === -1) {
    return NextResponse.json(
      { error: 'Task not found' },
      { status: 404 }
    );
  }
  
  // Remove the task from the array
  tasksDB.splice(taskIndex, 1);
  
  // Save to localStorage
  saveTasksToStorage(tasksDB);
  
  return NextResponse.json({ success: true });
}
