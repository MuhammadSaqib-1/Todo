export interface Todo {
  id: number;
  title: string;
  description?: string;
  is_completed: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
  due_date?: string;
  priority_level: string; // low, normal, high, urgent
  category: string; // Work, Personal, Shopping, etc.
}