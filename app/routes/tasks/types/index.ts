export interface Task {
  id: string;
  embassy_id: string;
  title: string;
  description: string;
  assigned_to?: User | null;
  assigned_user?: User | null;
  status: TaskStatus;
  priority: TaskPriority;
  is_urgent: boolean;
  due_date: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  id: number;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  profile_picture?: string;
  role: string;
}

export interface TasksQueryResponse {
  tasks: Task[];
}

export interface CreateTaskInput {
  title: string;
  description: string;
  due_date: string;
  status: TaskStatus;
  priority: TaskPriority;
  is_urgent: boolean;
  assigned_to: string;
  created_by: string;
  embassy_id: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  urgent: number;
  overdue: number;
}
