export interface SubTask {
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  subtasks: SubTask[];
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
