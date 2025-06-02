import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task, Category } from '../models/models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);

  tasks$ = this.tasksSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();

  constructor(private api: ApiService) {
    this.loadAllData();
  }

  private loadAllData() {
    this.api.getCategories().subscribe(categories => this.categoriesSubject.next(categories));
    this.api.getTasks().subscribe(tasksFromApi => {
      const adaptedTasks = tasksFromApi.map(task => ({
        ...task,
        category_id: task.category?.id ?? null // Adaptamos para usar en el frontend
      }));
      this.tasksSubject.next(adaptedTasks);
    });
  }

  // Tasks
  addTask(task: Partial<Task>) {
    this.api.createTask(task).subscribe(newTask => {
      const adaptedTask = {
        ...newTask,
        category_id: newTask.category?.id ?? null
      };
      const current = this.tasksSubject.getValue();
      this.tasksSubject.next([...current, adaptedTask]);
    });
  }

  updateTask(updated: Task) {
    this.api.updateTask(updated.id, updated).subscribe(task => {
      const adaptedTask = {
        ...task,
        category_id: task.category?.id ?? null
      };
      const updatedTasks = this.tasksSubject.getValue().map(t =>
        t.id === task.id ? adaptedTask : t
      );
      this.tasksSubject.next(updatedTasks);
    });
  }

  deleteTask(id: number) {
    this.api.deleteTask(id).subscribe(() => {
      const updatedTasks = this.tasksSubject.getValue().filter(t => t.id !== id);
      this.tasksSubject.next(updatedTasks);
    });
  }

  // Categories
  addCategory(category: Partial<Category>) {
    this.api.createCategory(category).subscribe(newCat => {
      const current = this.categoriesSubject.getValue();
      this.categoriesSubject.next([...current, newCat]);
    });
  }

  updateCategory(updated: Category) {
    this.api.updateCategory(updated.id, updated).subscribe(cat => {
      const updatedList = this.categoriesSubject.getValue().map(c =>
        c.id === cat.id ? cat : c
      );
      this.categoriesSubject.next(updatedList);
    });
  }

  deleteCategory(id: number) {
    this.api.deleteCategory(id).subscribe(() => {
      const updatedCats = this.categoriesSubject.getValue().filter(c => c.id !== id);
      this.categoriesSubject.next(updatedCats);

      const updatedTasks = this.tasksSubject.getValue().map(t =>
        t.category?.id === id ? { ...t, category: null, category_id: undefined } : t
      );
      this.tasksSubject.next(updatedTasks);
    });
  }
}