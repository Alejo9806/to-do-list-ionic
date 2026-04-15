import { Component, inject } from '@angular/core';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  public todoService = inject(TodoService);
  public newTaskTitle: string = '';

  addTask() {
    this.todoService.addTask(this.newTaskTitle);
    this.newTaskTitle = '';
  }

  toggleTask(id: string) {
    this.todoService.toggleComplete(id);
  }

  deleteTask(id: string) {
    this.todoService.deleteTask(id);
  }
}
