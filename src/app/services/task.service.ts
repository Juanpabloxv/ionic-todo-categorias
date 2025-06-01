import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task, Category } from '../models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksKey = 'tasks';
  private categoriesKey = 'categories';

  private tasksSubject = new BehaviorSubject<Task[]>(this.loadTasks());
  private categoriesSubject = new BehaviorSubject<Category[]>(this.loadCategories());

  tasks$ = this.tasksSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();

  private loadTasks(): Task[] {
    const data = localStorage.getItem(this.tasksKey);
    return data ? JSON.parse(data) : [];
  }

  private loadCategories(): Category[] {
    const data = localStorage.getItem(this.categoriesKey);
    return data ? JSON.parse(data) : [];
  }

  private saveTasks(tasks: Task[]) {
    localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
    this.tasksSubject.next(tasks);
  }

  private saveCategories(categories: Category[]) {
    localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
    this.categoriesSubject.next(categories);
  }

  // Tasks
  addTask(task: Task) {
    const tasks = this.loadTasks();
    tasks.push(task);
    this.saveTasks(tasks);
  }

  updateTask(updated: Task) {
    const tasks = this.loadTasks().map(t => t.id === updated.id ? updated : t);
    this.saveTasks(tasks);
  }

  deleteTask(id: string) {
    const tasks = this.loadTasks().filter(t => t.id !== id);
    this.saveTasks(tasks);
  }

  // Categories
  addCategory(category: Category) {
    const cats = this.loadCategories();
    cats.push(category);
    this.saveCategories(cats);
  }

  updateCategory(updated: Category) {
  const current = this.categoriesSubject.getValue();
  const updatedList = current.map(c => c.id === updated.id ? updated : c);
  this.saveCategories(updatedList);
}

  deleteCategory(id: string) {
    const cats = this.loadCategories().filter(c => c.id !== id);
    this.saveCategories(cats);

    // Opcional: eliminar categoría de tareas asignadas
    const tasks = this.loadTasks().map(t => t.categoryId === id ? { ...t, categoryId: undefined } : t);
    this.saveTasks(tasks);
  }
}
