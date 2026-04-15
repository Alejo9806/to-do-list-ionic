import { Injectable, signal, computed } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_KEY = 'tasks_storage';
  
  // Utilizando Signals para una gestión del estado reactiva y moderna (Angular 16+)
  private tasksSignal = signal<Task[]>([]);

  // Computed signal para componentes que necesiten derivar estado
  public tasks = this.tasksSignal.asReadonly();

  constructor() {
    this.loadTasks();
  }

  // Cargar tareas desde Local Storage
  private loadTasks() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.tasksSignal.set(parsed);
      } catch (e) {
        console.error('Error parsing tasks from local storage', e);
        this.tasksSignal.set([]);
      }
    }
  }

  // Guardar tareas en Local Storage
  private saveTasks() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasksSignal()));
  }

  // Agregar una nueva tarea
  addTask(title: string) {
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: Date.now()
    };
    
    // Actualizar el estado usando el mutate/update del signal
    this.tasksSignal.update(tasks => [newTask, ...tasks]);
    this.saveTasks();
  }

  // Marcar/Desmarcar como completada
  toggleComplete(id: string) {
    this.tasksSignal.update(tasks =>
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    this.saveTasks();
  }

  // Eliminar tarea
  deleteTask(id: string) {
    this.tasksSignal.update(tasks => tasks.filter(t => t.id !== id));
    this.saveTasks();
  }
}
