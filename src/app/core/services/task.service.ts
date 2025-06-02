import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task, Category } from '../models/models';

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
    const currentTasks = this.tasksSubject.getValue();
    this.saveTasks([...currentTasks, task]);
  }

  updateTask(updated: Task) {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.map(t => t.id === updated.id ? updated : t);
    this.saveTasks(updatedTasks);
  }

  deleteTask(id: string) {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.filter(t => t.id !== id);
    this.saveTasks(updatedTasks);
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

    const tasks = this.loadTasks().map(t => t.categoryId === id ? { ...t, categoryId: undefined } : t);
    this.saveTasks(tasks);
  }
}