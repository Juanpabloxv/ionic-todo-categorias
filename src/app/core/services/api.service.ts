import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, Category } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly BASE_URL = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // TASKS

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.BASE_URL}/tasks/`);
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.BASE_URL}/tasks/${id}/`);
  }

  createTask(task: { title?: string; description?: string; status?: 'pending' | 'completed'; category: string | null }): Observable<Task> {
    return this.http.post<Task>(`${this.BASE_URL}/tasks/`, task);
  }

  updateTask(id: string, task: { title?: string; description?: string; status?: 'pending' | 'completed'; category: string | null }): Observable<Task> {
    return this.http.put<Task>(`${this.BASE_URL}/tasks/${id}/`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/tasks/${id}/`);
  }

  // CATEGORIES

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.BASE_URL}/categories/`);
  }

  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.BASE_URL}/categories/${id}/`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.BASE_URL}/categories/`, category);
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.BASE_URL}/categories/${id}/`, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/categories/${id}/`);
  }
}