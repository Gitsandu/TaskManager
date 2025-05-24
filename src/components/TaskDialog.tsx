'use client';

import { FC } from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import TaskForm from './TaskForm';
import { Task } from '@/types/task';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  task?: Task;
  title: string;
}

const TaskDialog: FC<TaskDialogProps> = ({ open, onClose, onSubmit, task, title }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TaskForm
          initialData={task}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
