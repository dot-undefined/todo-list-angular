// src/app/todo.ts
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  description?: string;
}
