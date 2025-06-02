import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { Task, Category } from '../../core/models/models';

@Component({
  selector: 'app-edit-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss']
})
export class EditTaskModalComponent implements OnInit, OnChanges {
  @Input() task!: Task;
  @Input() categories: Category[] = [];

  editedTask!: Task;

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {
    if (this.task) {
      this.editedTask = { ...this.task };
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && changes['task'].currentValue) {
      this.editedTask = { ...changes['task'].currentValue };
    }
  }

  onSave(): void {
    this.modalController.dismiss(this.editedTask, 'save');
  }

  onCancel(): void {
    this.modalController.dismiss(null, 'cancel');
  }
}
