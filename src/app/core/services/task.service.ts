import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task, Category } from '../models/models';
import { ApiService } from './api.service';

type TaskPayload = {
  title?: string;
  description?: string;
  status?: 'pending' | 'completed';
  category: string | null;
};

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
        // Si el backend envía solo el ID en `category`, lo usamos como category_id
        category_id: typeof task.category === 'string' ? task.category : task.category?.id ?? null,
        category: null  // Limpiamos el campo category para evitar confusión
      }));
      this.tasksSubject.next(adaptedTasks);
    });
  }

  fetchTasks() {
    this.api.getTasks().subscribe(tasksFromApi => {
      const adaptedTasks = tasksFromApi.map(task => ({
        ...task,
        category_id: typeof task.category === 'string' ? task.category : task.category?.id ?? null,
        category: null
      }));
      this.tasksSubject.next(adaptedTasks);
    });
  }  

  addTask(task: Partial<Task>) {
    const dataToSend: TaskPayload = {
      title: task.title,
      description: task.description,
      status: task.status || 'pending',
      category: task.category_id ?? null
    };

    this.api.createTask(dataToSend).subscribe(() => {
      // Luego de crear la tarea, recargar desde el backend
      this.fetchTasks();
    });
  }

  updateTask(updated: Task) {
    const dataToSend: TaskPayload = {
      title: updated.title,
      description: updated.description,
      status: updated.status,
      category: updated.category_id ?? null
    };

    this.api.updateTask(updated.id, dataToSend).subscribe(task => {
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

  deleteTask(id: string) {
    this.api.deleteTask(id).subscribe(() => {
      const updatedTasks = this.tasksSubject.getValue().filter(t => t.id !== id);
      this.tasksSubject.next(updatedTasks);
    });
  }

  // 🔵 CATEGORIES
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

  deleteCategory(id: string) {
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