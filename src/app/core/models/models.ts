export interface Category {
  id: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  category: Category | null;
  category_id?: string | null;
  editing?: boolean;
}