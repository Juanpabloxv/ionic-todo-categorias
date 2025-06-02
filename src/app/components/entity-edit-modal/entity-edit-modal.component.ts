// entity-edit-modal.component.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Task, Category } from '../../core/models/models';

@Component({
  selector: 'app-entity-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './entity-edit-modal.component.html',
  styleUrls: ['./entity-edit-modal.component.scss']
})
export class EntityEditModalComponent implements OnInit, OnChanges {
  @Input() entity!: Task | Category;
  @Input() entityType!: 'task' | 'category';
  @Input() categories: Category[] = [];

  editedEntity: Task | Category = {} as any;

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {
    if (this.entity) {
      this.editedEntity = { ...this.entity };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entity'] && changes['entity'].currentValue) {
      this.editedEntity = { ...changes['entity'].currentValue };
    }
  }

  // Getters y setters para ngModel
  get titleOrName(): string {
    return this.entityType === 'task'
      ? (this.editedEntity as Task).title
      : (this.editedEntity as Category).name;
  }

  set titleOrName(value: string) {
    if (this.entityType === 'task') {
      (this.editedEntity as Task).title = value;
    } else {
      (this.editedEntity as Category).name = value;
    }
  }

  get description(): string {
    return (this.editedEntity as Task).description ?? '';
  }

  set description(value: string) {
    (this.editedEntity as Task).description = value;
  }

  get categoryId(): string {
    return (this.editedEntity as Task).categoryId ?? '';
  }

  set categoryId(value: string) {
    (this.editedEntity as Task).categoryId = value;
  }

  onSave(): void {
    const activeEl = document.activeElement as HTMLElement;
    if (activeEl) activeEl.blur();

    if (this.entityType === 'task') {
      const task = this.editedEntity as Task;
      if (!task.title?.trim()) return;
      this.modalController.dismiss(task, 'save');
    } else {
      const category = this.editedEntity as Category;
      if (!category.name?.trim()) return;
      this.modalController.dismiss(category, 'save');
    }
  }

  onCancel(): void {
    const activeEl = document.activeElement as HTMLElement;
    if (activeEl) activeEl.blur();
    this.modalController.dismiss(null, 'cancel');
  }
}