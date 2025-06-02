import { Component } from '@angular/core';
import { Task, Category } from '../../core/models/models';
import { TaskService } from '../../core/services/task.service';
import { v4 as uuidv4 } from 'uuid';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class CategoriesPage {
  categories: Category[] = [];
  newCategoryName = '';
  editingCategoryId: string | null = null;
  editedCategoryName = '';

  constructor(
    private taskService: TaskService,
    private alertController: AlertController
  ) {
    this.taskService.categories$.subscribe(cats => this.categories = cats);
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;
    const category: Category = { id: uuidv4(), name: this.newCategoryName.trim() };
    this.taskService.addCategory(category);
    this.newCategoryName = '';
  }

  async confirmDeleteCategory(category: Category) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Seguro que quieres eliminar la categoría "${category.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.deleteCategory(category.id);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteCategory(id: string) {
    this.taskService.deleteCategory(id);
  }

  startEditing(category: Category) {
    this.editingCategoryId = category.id;
    this.editedCategoryName = category.name;
  }

  cancelEditing() {
    this.editingCategoryId = null;
    this.editedCategoryName = '';
  }

  updateCategory(category: Category) {
    const trimmed = this.editedCategoryName.trim();
    if (!trimmed || trimmed === category.name) {
      this.cancelEditing();
      return;
    }
    const updated: Category = { ...category, name: trimmed };
    this.taskService.updateCategory(updated);
    this.cancelEditing();
  }
}