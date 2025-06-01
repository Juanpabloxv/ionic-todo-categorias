import { Component, ViewChild, ElementRef } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task, Category } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TaskListComponent } from '../task-list/task-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
    TaskListComponent
  ],
  providers: [Keyboard] // <-- Asegura que el plugin esté disponible
})
export class HomePage {
  tasks: Task[] = [];
  categories: Category[] = [];
  filterCategoryId: string | null = null;
  newTaskTitle = '';

  @ViewChild('taskInput', { static: false }) taskInputRef!: ElementRef;

  compareFn = (a: any, b: any) => a === b;

  constructor(
    private taskService: TaskService,
    private alertController: AlertController,
    private keyboard: Keyboard // <-- Inyectamos el servicio
  ) {
    this.taskService.tasks$.subscribe(tasks => this.tasks = tasks);
    this.taskService.categories$.subscribe(cats => this.categories = cats);
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    const task: Task = {
      id: uuidv4(),
      title: this.newTaskTitle.trim(),
      completed: false,
      categoryId: this.filterCategoryId || undefined
    };
    this.taskService.addTask(task);
    this.newTaskTitle = '';

    // Reabrir teclado al agregar tarea
    setTimeout(() => {
      const inputEl = this.taskInputRef?.nativeElement?.querySelector('input');
      if (inputEl) {
        inputEl.focus();
        this.keyboard.show();
      }
    }, 300);
  }

  toggleCompleted(task: Task) {
    this.taskService.updateTask({ ...task, completed: !task.completed });
  }

  deleteTask(task: Task) {
    this.taskService.deleteTask(task.id);
  }

  async confirmDeleteTask(task: Task) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Seguro que quieres eliminar la tarea "${task.title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => {
            this.deleteTask(task);
          }
        }
      ]
    });

    await alert.present();
  }

  filteredTasks() {
    if (!this.filterCategoryId) return this.tasks;
    return this.tasks.filter(t => t.categoryId === this.filterCategoryId);
  }

  setFilter(categoryId: string | null) {
    this.filterCategoryId = categoryId;
  }

  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return '';
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }
}
