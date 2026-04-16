import { Injectable, signal, computed } from '@angular/core';
import { Task } from '../models/task.model';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_KEY = 'tasks_storage';
  private readonly CATEGORY_STORAGE_KEY = 'categories_storage';
  
  // Utilizando Signals para una gestión del estado reactiva
  private tasksSignal = signal<Task[]>([]);
  private categoriesSignal = signal<Category[]>([]);
  public selectedCategoryId = signal<string | null>(null);

  // Computed signals
  public categories = this.categoriesSignal.asReadonly();
  
  public tasks = computed(() => {
    const activeCategory = this.selectedCategoryId();
    const allTasks = this.tasksSignal();
    
    if (activeCategory === null) {
      return allTasks;
    }
    return allTasks.filter(task => task.categoryId === activeCategory);
  });

  constructor() {
    this.loadData();
  }

  private loadData() {
    // Tareas
    const savedTasks = localStorage.getItem(this.STORAGE_KEY);
    if (savedTasks) {
      try {
        this.tasksSignal.set(JSON.parse(savedTasks));
      } catch (e) {
        this.tasksSignal.set([]);
      }
    }
    // Categorías
    const savedCategories = localStorage.getItem(this.CATEGORY_STORAGE_KEY);
    if (savedCategories) {
      try {
        this.categoriesSignal.set(JSON.parse(savedCategories));
      } catch (e) {
        this.categoriesSignal.set([]);
      }
    }
  }

  private saveData() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasksSignal()));
    localStorage.setItem(this.CATEGORY_STORAGE_KEY, JSON.stringify(this.categoriesSignal()));
  }

  // ---- TAREAS ----

  addTask(title: string, categoryId: string | null = null) {
    if (!title.trim()) return;
    
    // Si no se provee category id explícito pero hay una categoría seleccionada (y no es "Todas")
    // Se la asignamos por defecto.
    const finalCategoryId = categoryId !== null ? categoryId : this.selectedCategoryId();

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: Date.now(),
      categoryId: finalCategoryId
    };
    
    this.tasksSignal.update(tasks => [newTask, ...tasks]);
    this.saveData();
  }

  toggleComplete(id: string) {
    this.tasksSignal.update(tasks =>
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    this.saveData();
  }

  deleteTask(id: string) {
    this.tasksSignal.update(tasks => tasks.filter(t => t.id !== id));
    this.saveData();
  }

  // ---- CATEGORÍAS ----

  addCategory(name: string) {
    if (!name.trim()) return;
    const newCat: Category = {
      id: crypto.randomUUID(),
      name: name.trim()
    };
    this.categoriesSignal.update(cats => [...cats, newCat]);
    this.saveData();
  }

  updateCategory(id: string, newName: string) {
    if (!newName.trim()) return;
    this.categoriesSignal.update(cats =>
      cats.map(cat => cat.id === id ? { ...cat, name: newName.trim() } : cat)
    );
    this.saveData();
  }

  deleteCategory(id: string) {
    // Eliminar la categoría
    this.categoriesSignal.update(cats => cats.filter(cat => cat.id !== id));
    
    // Desvincular de las tareas que la tenían
    this.tasksSignal.update(tasks => 
      tasks.map(t => t.categoryId === id ? { ...t, categoryId: null } : t)
    );

    // Si estábamos filtrando por ella, resetear el filtro
    if (this.selectedCategoryId() === id) {
      this.selectedCategoryId.set(null);
    }
    this.saveData();
  }
}
