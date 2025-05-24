# Collaborative Task Manager

A modern task management application built with Next.js, TypeScript, Material UI, and Zustand.

## Features

- Create, read, update, and delete tasks
- Organize tasks by status (To Do, In Progress, Done)
- Filter tasks by status and priority
- Assign tasks to team members
- Set due dates for tasks
- Responsive design for desktop and mobile
- Bonus: Recipe search page using external API

## Tech Stack

- **Framework**: Next.js (App Router) with React
- **Language**: TypeScript
- **UI Components**: Material UI (MUI)
- **State Management**: Zustand
- **Data Fetching**: Tanstack Query (React Query)
- **Forms**: React Hook Form with Zod validation
- **API**: Next.js API Routes with in-memory data storage

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
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

## Project Structure

- `src/app`: Next.js App Router pages
- `src/components`: Reusable React components
- `src/store`: Zustand store for state management
- `src/types`: TypeScript interfaces and types
- `src/lib`: Utility functions and in-memory database
- `src/theme`: MUI theme configuration

## API Routes

- `GET /api/tasks`: Get all tasks
- `POST /api/tasks`: Create a new task
- `GET /api/tasks/[id]`: Get a specific task
- `PUT /api/tasks/[id]`: Update a task
- `DELETE /api/tasks/[id]`: Delete a task

## License

This project is licensed under the MIT License.
