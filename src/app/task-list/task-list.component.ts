import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';

import { Task, Category } from '../models';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonButton,
    IonIcon,
  ],
})
export class TaskListComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Input() categories: Category[] = [];
  @Input() filterCategoryId: string | null = null;

  @Output() toggleCompleted = new EventEmitter<Task>();
  @Output() deleteTask = new EventEmitter<Task>();

  constructor() {}

  ngOnInit() {}

  filteredTasks(): Task[] {
    if (!this.filterCategoryId) return this.tasks;
    return this.tasks.filter((t) => t.categoryId === this.filterCategoryId);
  }

  getCategoryName(categoryId: string | undefined): string {
    if (!categoryId) return '';
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : '';
  }

  onToggleCompleted(task: Task) {
    this.toggleCompleted.emit(task);
  }

  onDeleteTask(task: Task) {
    this.deleteTask.emit(task);
  }
}
