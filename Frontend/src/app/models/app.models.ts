export interface User {
  fullName: string;
  email: string;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  fullName: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export enum TaskStatus {
  Todo = 'Todo',
  InProgress = 'InProgress',
  Review = 'Review',
  Done = 'Done'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical'
}

export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
}

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  dueDate?: Date;
  assigneeId?: string;
  jiraKey?: string;
}
