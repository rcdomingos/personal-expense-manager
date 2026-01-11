
import { DatabaseService } from '../../../services/db';
import { Classification } from '../../../types';
import { authService } from '../../../services/authService';

export const classificationService = {
  getClassifications: (): Classification[] => {
    const user = authService.getCurrentUser();
    if (!user) return [];
    return DatabaseService.getAll('classifications', user.id);
  },

  addClassification: (name: string): void => {
    const user = authService.getCurrentUser();
    if (!user) return;
    const newClassification: Classification = {
      id: crypto.randomUUID(),
      userId: user.id,
      name,
    };
    DatabaseService.insert('classifications', newClassification);
  },

  updateClassification: (id: string, name: string): void => {
    DatabaseService.update('classifications', id, { name });
  },

  deleteClassification: (id: string): void => {
    // Note: In a real app, check if categories are using this classification first
    DatabaseService.delete('classifications', id);
  }
};
