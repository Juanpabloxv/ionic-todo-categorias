export interface Category {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  category: Category | null;       
  category_id?: number | null;      
  editing?: boolean;            
}