export interface SubTask {
  id: number;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  subtasks: SubTask[];
  columnId: number;
}

export interface Column {
  id: number;
  name: string;
  tasks: Task[];
}

export interface Board {
  id: number;
  name: string;
  columns: Column[];
}

export function getTaskCompletedCount(task: Task): number {
  return task.subtasks.reduce((sum, st) => sum + (st.isCompleted ? 1 : 0), 0);
}
