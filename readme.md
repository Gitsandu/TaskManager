# Collaborative Task Manager

A modern task management application built with Next.js, TypeScript, Material UI, and Redux.

## Features

- Create, read, update, and delete tasks
- Organize tasks by status (To Do, In Progress, Done)
- Filter tasks by status and priority
- Assign tasks to team members
- Set due dates for tasks
- Responsive design for desktop and mobile
- Drag and drop task management interface
- Recipe search page using TheMealDB external API

## Tech Stack

- **Framework**: Next.js 15+ (App Router) with React 19+
- **Language**: TypeScript 5.8+
- **UI Components**: Material UI (MUI) 7.1+
- **State Management**: Redux with Redux Toolkit
- **Data Fetching**: Tanstack Query (React Query) 5.76+
- **Forms**: React Hook Form with Zod validation
- **API**: Next.js API Routes with in-memory data storage and localStorage persistence
- **Drag and Drop**: react-beautiful-dnd

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Gitsandu/TaskManager.git
   cd collaborative-task-manager
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Application Usage

- **Task Management**: The main page displays a Kanban-style board with tasks organized by status.
- **Create Tasks**: Click the "Add Task" button to create a new task with title, description, status, priority, due date, and assignee.
- **Edit Tasks**: Click on any task card to edit its details.
- **Delete Tasks**: Use the delete option in the task menu to remove tasks.
- **Drag and Drop**: Move tasks between status columns by dragging and dropping.
- **Recipe Search**: Navigate to the Recipe page to search for recipes using TheMealDB API.

## Project Structure

- `src/app`: Next.js App Router pages and API routes
- `src/components`: Reusable React components (TaskBoard, TaskCard, TaskForm, etc.)
- `src/redux`: Redux store, slices, and state management
- `src/services`: API service functions for data fetching
- `src/types`: TypeScript interfaces and types
- `src/lib`: Utility functions and in-memory database with localStorage persistence
- `src/theme`: MUI theme configuration

## API Routes

- `GET /api/tasks`: Get all tasks
- `GET /api/tasks?id=[id]`: Get a specific task
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks?id=[id]`: Update a task
- `DELETE /api/tasks?id=[id]`: Delete a task

## Data Storage

The application uses a simple in-memory database with localStorage persistence for task data. In a production environment, this would be replaced with a proper database solution. The current implementation:

- Initializes with sample tasks
- Persists changes to localStorage when available
- Loads saved tasks from localStorage on application startup
