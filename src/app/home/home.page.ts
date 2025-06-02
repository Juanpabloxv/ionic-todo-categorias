import { Component, ViewChild, ElementRef } from '@angular/core';
import { TaskService } from '../core/services/task.service';
import { Task, Category } from '../core/models/models';
import { Keyboard } from '@ionic-native/keyboard/ngx';

import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EntityEditModalComponent } from '../components/entity-edit-modal/entity-edit-modal.component';
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
  filterCategoryId: number | null = null;  // CAMBIO
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

    const taskData: Partial<Task> = {
      title: this.newTaskTitle.trim(),
      description: this.newTaskDescription.trim(),
      status: 'pending',
      category_id: this.filterCategoryId ?? undefined  // CAMBIO
    };

    this.taskService.addTask(taskData);
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
    const updatedStatus = task.status === 'completed' ? 'pending' : 'completed';
    this.taskService.updateTask({ ...task, status: updatedStatus }); // CAMBIO
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
    if (this.filterCategoryId === null) return this.tasks;
    return this.tasks.filter(t => t.category_id === this.filterCategoryId); // CAMBIO
  }

  setFilter(category_id: number | null) {
    this.filterCategoryId = category_id;
  }

  getCategoryName(category_id: number | undefined): string {
    if (!category_id) return '';
    const category = this.categories.find(c => c.id === category_id); // CAMBIO
    return category ? category.name : '';
  }

  async onEditTaskRequest(task: Task, event?: Event) {
    const opener = event?.target as HTMLElement;
    opener?.blur?.();

    const modal = await this.modalController.create({
      component: EntityEditModalComponent,
      componentProps: {
        entity: { ...task },
        entityType: 'task',
        categories: this.categories
      },
      cssClass: 'edit-task-modal'
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    document.activeElement instanceof HTMLElement && document.activeElement.blur();

    if (role === 'save' && data) {
      this.taskService.updateTask(data);
    }
  }
}