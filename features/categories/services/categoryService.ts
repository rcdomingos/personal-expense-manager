
import { DatabaseService } from '../../../services/db';
import { Category, TransactionType } from '../../../types';
import { authService } from '../../../services/authService';

export const categoryService = {
  getCategories: (type?: TransactionType): Category[] => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    const categories = DatabaseService.getAll('categories', user.id);
    if (type) {
      return categories.filter(c => c.type === type);
    }
    return categories;
  },

  addCategory: (category: Omit<Category, 'id' | 'userId'>): void => {
    const user = authService.getCurrentUser();
    if (!user) return;
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
      userId: user.id,
    };
    DatabaseService.insert('categories', newCategory);
  },

  updateCategory: (id: string, data: Partial<Omit<Category, 'id' | 'userId'>>): void => {
    DatabaseService.update('categories', id, data);
  },

  deleteCategory: (id: string): void => {
    DatabaseService.delete('categories', id);
  }
};
