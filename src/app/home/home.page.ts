import { Component, inject } from '@angular/core';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { TodoService } from '../services/todo.service';
import { Category } from '../models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  public todoService = inject(TodoService);
  private alertCtrl = inject(AlertController);
  private actionSheetCtrl = inject(ActionSheetController);

  public newTaskTitle: string = '';
  public newTaskCategoryId: string | null = null;

  addTask() {
    this.todoService.addTask(this.newTaskTitle, this.newTaskCategoryId);
    this.newTaskTitle = '';
  }

  toggleTask(id: string) {
    this.todoService.toggleComplete(id);
  }

  deleteTask(id: string) {
    this.todoService.deleteTask(id);
  }

  // --- Category filtering and management ---

  setFilter(categoryId: string | null) {
    this.todoService.selectedCategoryId.set(categoryId);
  }

  getTaskCategoryName(categoryId?: string | null): string {
    if (!categoryId) return '';
    const cat = this.todoService.categories().find((c) => c.id === categoryId);
    return cat ? cat.name : '';
  }

  async manageCategories() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Gestionar Categorías',
      buttons: [
        {
          text: 'Nueva Categoría',
          icon: 'add-circle-outline',
          handler: () => {
            this.showCategoryAlert();
          },
        },
        ...this.todoService.categories().map((cat) => ({
          text: `Editar: ${cat.name}`,
          icon: 'create-outline',
          handler: () => {
            this.showCategoryAlert(cat);
          },
        })),
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async showCategoryAlert(category?: Category) {
    const isEdit = !!category;

    const buttons: any[] = [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
    ];

    if (isEdit) {
      buttons.push({
        text: 'Eliminar',
        role: 'destructive',
        cssClass: 'alert-danger-text',
        handler: () => {
          this.todoService.deleteCategory(category.id);
        },
      });
    }

    buttons.push({
      text: 'Guardar',
      handler: (data: any) => {
        if (isEdit) {
          this.todoService.updateCategory(category.id, data.name);
        } else {
          this.todoService.addCategory(data.name);
        }
      },
    });

    const alert = await this.alertCtrl.create({
      header: isEdit ? 'Editar Categoría' : 'Nueva Categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre de la categoría',
          value: category ? category.name : '',
        },
      ],
      buttons: buttons,
    });
    await alert.present();
  }
}
