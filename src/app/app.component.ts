// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from './todo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Todo List';
  todos: Todo[] = [];
  newTodoTitle = '';
  newTodoDescription = '';
  newTodoPriority: 'low' | 'medium' | 'high' = 'medium';
  filterStatus: 'all' | 'active' | 'completed' = 'all';
  sortBy: 'priority' | 'date' = 'date';
  searchQuery = '';
  priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];

  constructor() {
    // Load todos from localStorage on init
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
    }
  }

  get remaining(): number {
    return this.todos.filter(todo => !todo.completed).length;
  }

  get filteredTodos(): Todo[] {
    let filtered = this.todos;

    // Apply status filter
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(todo =>
        this.filterStatus === 'completed' ? todo.completed : !todo.completed
      );
    }

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(query) ||
        (todo.description?.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (this.sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  }

  addTodo(): void {
    if (this.newTodoTitle.trim().length === 0) return;

    const newTodo: Todo = {
      id: Date.now(),
      title: this.newTodoTitle.trim(),
      description: this.newTodoDescription.trim(),
      completed: false,
      createdAt: new Date(),
      priority: this.newTodoPriority
    };

    this.todos.unshift(newTodo);
    this.saveTodos();
    this.resetForm();
  }

  toggleTodo(todo: Todo): void {
    todo.completed = !todo.completed;
    this.saveTodos();
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.saveTodos();
  }

  updateTodoPriority(todo: Todo, priority: 'low' | 'medium' | 'high'): void {
    todo.priority = priority;
    this.saveTodos();
  }

  private saveTodos(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  private resetForm(): void {
    this.newTodoTitle = '';
    this.newTodoDescription = '';
    this.newTodoPriority = 'medium';
  }

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }

  getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
    switch (priority) {
      case 'high':
        return '#e53e3e';
      case 'medium':
        return '#e6a23c';
      case 'low':
        return '#38a169';
      default:
        return '#a0aec0';
    }
  }
}
