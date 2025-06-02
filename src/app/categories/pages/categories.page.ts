import { Component } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Category } from '../../core/models/models';
import { v4 as uuidv4 } from 'uuid';
import {
  IonicModule,
  AlertController,
  ModalController
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EntityEditModalComponent } from '../../components/entity-edit-modal/entity-edit-modal.component';

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

  constructor(
    private taskService: TaskService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {
    this.taskService.categories$.subscribe(cats => (this.categories = cats));
  }

  addCategory() {
    const name = this.newCategoryName.trim();
    if (!name) return;
    const category: Category = { id: uuidv4(), name };
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
          handler: () => this.deleteCategory(category.id)
        }
      ]
    });
    await alert.present();
  }

  deleteCategory(id: string) {
    this.taskService.deleteCategory(id);
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