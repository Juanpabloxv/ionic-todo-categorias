export interface Category {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId?: string;
  editing?: boolean;
}