import { Component } from '@angular/core';
import { AlertController, ModalController, IonicModule } from '@ionic/angular';
import { TaskService } from '../../core/services/task.service';
import { Category } from '../../core/models/models';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EntityEditModalComponent } from '../../components/entity-edit-modal/entity-edit-modal.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class CategoriesPage {
  categories: Category[] = [];
  newCategoryName = '';

  constructor(
    private taskService: TaskService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.taskService.categories$.subscribe((cats: Category[]) => {
      this.categories = cats;
    });
  }

  addCategory() {
    const name = this.newCategoryName.trim();
    if (!name) return;

    const category: Partial<Category> = { name };
    this.taskService.addCategory(category);
    this.newCategoryName = '';
  }

  deleteCategory(id: number) {
    this.taskService.deleteCategory(id);
  }

  async confirmDeleteCategory(category: Category) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Seguro que deseas eliminar la categoría "${category.name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          cssClass: 'danger',
          handler: () => this.deleteCategory(category.id)
        }
      ]
    });

    await alert.present();
  }

  async openEditCategoryModal(category: Category) {
    const modal = await this.modalController.create({
      component: EntityEditModalComponent,
      componentProps: {
        entity: { ...category },
        entityType: 'category'
      },
      cssClass: 'edit-task-modal'
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();
    if (role === 'save' && data) {
      this.taskService.updateCategory(data);
    }
  }
}