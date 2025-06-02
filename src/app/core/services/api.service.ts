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

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.BASE_URL}/tasks/${id}/`);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.BASE_URL}/tasks/`, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.BASE_URL}/tasks/${id}/`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/tasks/${id}/`);
  }

  // CATEGORIES

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.BASE_URL}/categories/`);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.BASE_URL}/categories/${id}/`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.BASE_URL}/categories/`, category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.BASE_URL}/categories/${id}/`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/categories/${id}/`);
  }
}
