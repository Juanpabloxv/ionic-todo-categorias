import { Component, ViewChild, ElementRef } from '@angular/core';
import { TaskService } from '../core/services/task.service';
import { Task, Category } from '../core/models/models';
import { v4 as uuidv4 } from 'uuid';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EditTaskModalComponent } from '../components/edit-task-modal/edit-task-modal.component';
import { TaskListComponent } from '../components/task-list/task-list.component';

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
    TaskListComponent,
  ],
  providers: [Keyboard]
})
export class HomePage {
  tasks: Task[] = [];
  categories: Category[] = [];
  filterCategoryId: string | null = null;
  newTaskTitle = '';
  newTaskDescription = '';

  @ViewChild('taskInput', { static: false }) taskInputRef!: ElementRef;

  compareFn = (a: any, b: any) => a === b;

  constructor(
    private taskService: TaskService,
    private alertController: AlertController,
    private keyboard: Keyboard,
    private modalController: ModalController
  ) {
    this.taskService.tasks$.subscribe(tasks => this.tasks = tasks);
    this.taskService.categories$.subscribe(cats => this.categories = cats);
  }

  addTask() {
    if (!this.newTaskTitle.trim()) return;
    const task: Task = {
      id: uuidv4(),
      title: this.newTaskTitle.trim(),
      description: this.newTaskDescription.trim(),
      completed: false,
      categoryId: this.filterCategoryId || undefined
    };

    this.taskService.addTask(task);
    this.newTaskTitle = '';
    this.newTaskDescription = '';

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
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => this.deleteTask(task)
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

  async onEditTaskRequest(task: Task, event?: Event) {
    // Solo intentar hacer blur si se recibió un evento
    const opener = event?.target as HTMLElement;
    opener?.blur?.();

    const modal = await this.modalController.create({
      component: EditTaskModalComponent,
      componentProps: {
        task: { ...task },
        categories: this.categories
      }
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    document.activeElement instanceof HTMLElement && document.activeElement.blur();

    if (role === 'save' && data) {
      this.taskService.updateTask(data);
    }
  }
}